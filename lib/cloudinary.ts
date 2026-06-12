import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadImage(file: File, folder: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (err, result) => {
        if (err || !result) reject(err ?? new Error("Upload failed"));
        else resolve(result.secure_url);
      })
      .end(buffer);
  });
}

export async function uploadVideo(file: File, folder: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_chunked_stream(
      { folder, resource_type: "video", chunk_size: 6_000_000 },
      (err, result) => {
        if (err || !result) reject(err ?? new Error("Upload failed"));
        else resolve(result.secure_url);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}
