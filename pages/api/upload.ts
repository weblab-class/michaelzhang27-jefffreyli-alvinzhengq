
import formidable from "formidable";
import { join } from "path";
import mime from "mime";
import { NextApiRequest, NextApiResponse } from "next";
import { mkdir, stat } from "fs/promises"

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function NextApiHandler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        res.status(405).json({
            data: null,
            error: "Method Not Allowed",
        });
        return;
    }

    const uploadDir = join(
        process.env.ROOT_DIR || process.cwd(),
        `/public/${req.headers.userid}`
    );
    try {
        await stat(uploadDir);
    } catch (err) {
        await mkdir(uploadDir);
    }

    let filename = "";
    const form = formidable({
        maxFiles: 1,
        maxFileSize: 80 * 1024 * 1024,
        uploadDir,
        filename: (_name, _ext, part) => {
            if (filename !== "") {
                return filename;
            }


            filename = `${_name}.${mime.getExtension(part.mimetype || "") || "unknown"}`;
            return filename;
        },
        filter: (part) => {
            return (
                part.name === "media" && (part.mimetype?.includes("video") || false)
            );
        },
    });

    form.parse(req, (err, fields, files) => {
        if (err) res.status(500).json({ data: err })
        else res.status(200).json({ data: files })
    })

    res.status(200);
}