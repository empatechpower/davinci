export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If it's already a Cloudinary URL, insert transformation parameters
  if (src.includes("res.cloudinary.com")) {
    const q = quality ?? 75;
    return src.replace("/upload/", `/upload/w_${width},q_${q},f_auto/`);
  }
  // Fallback for non-Cloudinary URLs (Unsplash etc.)
  return src;
}
