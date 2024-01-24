
import { NextApiRequest, NextApiResponse } from "next";
import { statSync, createReadStream } from "fs";
import admin from 'firebase-admin';
import { join } from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
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

    if (!admin.app.length) {
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

    if (!range) {
        return new Response('Range Header Required', {
            status: 400
        })
    }

    const videoPath = process.env.PWD + `/public/${uid}/${slug}`;
    const videoSize = statSync(videoPath).size;
    const CHUNK_SIZE = 10 ** 6;

    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    const header = {
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength.toString(),
        'Content-Type': 'video/mp4',
    };

    const videoStream = createReadStream(videoPath, { start, end });

    res.writeHead(206, header);
    videoStream.pipe(res);
}