import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function uploadToCloudinary(file: File, folder: string, resource_type: "image" | "video"): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type }, (err, result) => {
        if (err || !result) reject(err ?? new Error("Upload failed"));
        else resolve(result.secure_url);
      })
      .end(buffer);
  });
}

export const uploadImage = (file: File, folder: string) => uploadToCloudinary(file, folder, "image");
export const uploadVideo = (file: File, folder: string) => uploadToCloudinary(file, folder, "video");
