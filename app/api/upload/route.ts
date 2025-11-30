import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_SECRET_KEY!,
});

interface CloudinaryResponse {
    url: string;
    size: number;
}

function uploadToCloudinary(buffer: Buffer, fileType: string): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
        const isImage = fileType.startsWith("image/");
        const folder = isImage ? "vfd/images" : "vfd/documents";

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: "auto",
                use_filename: true,
                unique_filename: true,
            },
            // Thêm Type rõ ràng cho callback của Cloudinary để tránh ngầm hiểu là 'any'
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                if (error) {
                    return reject(error);
                }
                if (!result) {
                    return reject(new Error("Upload failed: No result returned"));
                }
                resolve({
                    url: result.secure_url,
                    size: result.bytes
                });
            }
        );
        uploadStream.end(buffer);
    });
}

export async function POST(req: Request) {
    try {
        const data = await req.formData();
        const file = data.get("file");

        // Kiểm tra kỹ kiểu dữ liệu của file
        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "No file provided or invalid file" }, { status: 400 });
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File quá lớn (Max 10MB)" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await uploadToCloudinary(buffer, file.type);

        return NextResponse.json({
            link: uploadResult.url,
            size: uploadResult.size
        });
    } catch (error: unknown) {
        // SỬA LỖI Ở ĐÂY: Thay 'any' bằng 'unknown'
        console.error("Upload Error:", error);

        // Kiểm tra an toàn để lấy message
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
