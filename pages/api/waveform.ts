

import { NextApiRequest, NextApiResponse } from "next";
import { statSync, createReadStream } from "fs";
import admin from 'firebase-admin';
import { join } from 'path';
import { access, constants, readFile, stat } from "fs/promises";
import { spawn } from "child_process";

export const config = {
    api: {
        bodyParser: false,
    },
};

function checkFileExists(file: string) {
    return access(file, constants.F_OK)
        .then(() => true)
        .catch(() => false)
}

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

export default async function NextApiHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        res.status(405).json({
            data: null,
            error: "Method Not Allowed",
        });
        return;
    }

    const range = req.headers.range
    const { slug, token } = req.query

    if (!admin.apps.length) {
        await admin.initializeApp({
            credential: admin.credential.cert(join(
                process.env.ROOT_DIR || process.cwd(),
                "credentials.json"
            ))
        })
    }

    let uid = "default";
    if (token) {
        uid = await (await admin.auth().verifyIdToken(token as string)).uid
    } else {
        res.status(500).end();
    }

    if (!await checkFileExists(process.env.PWD + `/public/${uid}/song.mpga`)) {
        res.status(500).end();

    } else {
        await execute([
            "-i", process.env.PWD + `/public/${uid}/song.mpga`,
            "-filter_complex", "showwavespic=s=8000x100:colors=black",
            "-frames:v", "1",
            "-y",
            process.env.PWD + `/public/${uid}/waveform.png`
        ])

        const file = await readFile(process.env.PWD + `/public/${uid}/waveform.png`);

        res.setHeader('Content-Type', 'image/png');
        res.send(file)
    }

    res.status(200).end();
}
