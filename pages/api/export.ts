import { exec, spawn } from "child_process";
import { rename, stat } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";
import admin from 'firebase-admin';
import { join } from 'path';

export const config = {
    api: {
        bodyParser: true,
    },
};

const execute = async (command: Array<string>) => {
    return new Promise<void>((resolve, reject) => {
        const ffmpeg = spawn("ffmpeg", command);

        ffmpeg.stderr.on("data", (data) => {
            console.log(data.toString());
        });

        ffmpeg.once("error", reject);
        ffmpeg.on("exit", (code, signal) => {
            resolve();
        });
    });
};


enum MediaType {
    Audio = 0,
    Video = 1,
}

type MediaFile = {
    display_name: string,
    id: string,
    url: string,
    type: MediaType,
    duration: string,
    startDelta: number,
    endDelta: number
}

type MediaList = Array<MediaFile>

export default async function NextApiHandler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        res.status(405).json({
            data: null,
            error: "Method Not Allowed",
        });
        return;
    }

    let uid = "default";

    if (req.headers.authorization) {
        if (!admin.apps.length) {
            await admin.initializeApp({
                credential: admin.credential.cert(join(
                    process.env.ROOT_DIR || process.cwd(),
                    "credentials.json"
                ))
            })
        }

        uid = await (await admin.auth().verifyIdToken(req.headers.authorization)).uid
    }

    const fileList: MediaList = req.body.list;
    const timeStamp = req.body.time;

    if (fileList.length <= 0) return res.status(200).end();

    let argsList = [];
    fileList.map((file, i) => {
        argsList.push(
            "-i",
            `${process.env.PWD}/public/${uid}/${file.id}.mp4`
        );
    });

    let filterComplex = "";
    fileList.map((file, i) => {
        filterComplex += `[${i}:v:0]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1:color=black,setsar=sar=1[Scaled_${i}];`;
    });

    fileList.map((file, i) => {
        filterComplex += `[Scaled_${i}]`;
    });

    filterComplex += `concat=n=${fileList.length}:v=1:a=0[v]`;

    argsList.push("-filter_complex", `${filterComplex}`);
    argsList.push(
        "-map",
        `[v]`,
        "-r", "60",
        "-vsync",
        "1",
        "-y",
        "-preset",
        "faster",
        "-crf",
        "22",
        `${process.env.PWD}/public/${uid}/output-tmp.mp4`
    );

    await execute(argsList);

    // CUTTING

    let timeSoFar: number = 0;
    let clipList_v: Array<string> = [];

    for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i];
        let clip_duration = parseFloat(file.duration);

        if (file.startDelta > 0) {
            clipList_v.push(
                `select='not(between(t,${timeSoFar},${timeSoFar + file.startDelta}))'`
            );
        }

        if (file.endDelta > 0) {
            clipList_v.push(
                `select='not(between(t,${timeSoFar + clip_duration - file.endDelta},${timeSoFar + clip_duration}))'`
            );
        }

        timeSoFar += clip_duration;
    }

    let argsList_trim = [
        "-i",
        `${process.env.PWD}/public/${uid}/output-tmp.mp4`,
        "-vf",
        `${clipList_v.length > 0 ? clipList_v.join(",") + "," : ""
        }setpts=N/FRAME_RATE/TB`,
        "-vsync",
        "2",
        "-y",
        "-crf",
        "22",
        "-preset",
        "faster",
        `${process.env.PWD}/public/${uid}/output-tmp-2.mp4`
    ];

    await execute(argsList_trim);

    let total_duration: number = 0;

    for (let i = 0; i < fileList.length; i++) {
        let file = fileList[i];
        total_duration += parseFloat(file.duration) - file.startDelta - file.endDelta;
    }

    let argList_audio = [
        "-i",
        `${process.env.PWD}/public/${uid}/output-tmp-2.mp4`,
        "-i",
        `${process.env.PWD}/public/${uid}/song.mpga`,
        "-c",
        "copy",
        "-map", "0:v:0", "-map", "1:a:0",
        "-t", total_duration.toFixed(2),
        `${process.env.PWD}/public/${uid}/output-${timeStamp}.mp4`,
    ]

    try {
        await stat(`${process.env.PWD}/public/${uid}/song.mpga`)
        await execute(argList_audio);
    } catch (_) {
        await rename(
            `${process.env.PWD}/public/${uid}/output-tmp-2.mp4`,
            `${process.env.PWD}/public/${uid}/output-${timeStamp}.mp4`
        )
    }

    res.status(200).end();
}
