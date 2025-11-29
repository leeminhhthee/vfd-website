import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_SECRET_KEY!,
});

function uploadToCloudinary(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "vfd/news" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result!.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
}

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file = data.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const url = await uploadToCloudinary(buffer);

        return NextResponse.json({ link: url });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
