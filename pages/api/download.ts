
import { join } from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { mkdir, stat } from "fs/promises"
import axios from "axios";
import { createWriteStream, existsSync } from "fs";
import { pipeline } from "stream/promises";
import admin from 'firebase-admin';

export const config = {
    api: {
        bodyParser: true,
    },
};

const downloadFile = async (file: MediaFile, save_path: string) => {
    try {
        const request = await axios.get(file.url, {
            responseType: 'stream',
        });
        await pipeline(request.data, createWriteStream(save_path));
    } catch (error) {
        console.error('download pipeline failed', error);
    }
}

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

export default async function NextApiHandler(req: NextApiRequest, res: NextApiResponse) {
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

    const uploadDir = join(
        process.env.ROOT_DIR || process.cwd(),
        `/public/${uid}`
    );
    try {
        await stat(uploadDir);
    } catch (err) {
        await mkdir(uploadDir);
    }

    let fileObj: MediaFile = req.body.file_obj;

    if (fileObj.type === 0 || !existsSync(join(uploadDir, `${fileObj.type ? fileObj.id : "song"}.${fileObj.type ? "mp4" : "mpga"}`))) {
        await downloadFile(fileObj, join(uploadDir, `${fileObj.type ? fileObj.id : "song"}.${fileObj.type ? "mp4" : "mpga"}`));
    }


    res.status(200).end();
}