import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ImageIcon } from "lucide-react";

interface ArtistCardProps {
  id: string;
  name: string;
  category: string;
  shortBio: string;
  soldCount: number;
  availableCount: number;
  image?: string;
}

export default function ArtistCard({
  id,
  name,
  category,
  shortBio,
  soldCount,
  availableCount,
  image,
}: ArtistCardProps) {
  return (
    <Link href={`/artists/${id}`} className="group flex flex-col gap-4">
      {/* Artist photo */}
      <div
        className="overflow-hidden rounded-[8px] bg-[#f5f2ef] w-full"
        style={{ aspectRatio: "1 / 1" }}
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            width={600}
            height={600}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-light text-dv-muted">{name[0]}</span>
          </div>
        )}
      </div>

      {/* Category badge */}
      <span className="self-start bg-dv-accent text-white text-[12px] font-medium px-3 py-1 rounded-full">
        {category}
      </span>

      {/* Name */}
      <h3 className="font-serif italic text-dv-accent text-[22px] leading-tight group-hover:opacity-80 transition-opacity -mt-1">
        {name}
      </h3>

      {/* Bio — 3 lines max */}
      <p className="text-[14px] text-dv-muted leading-relaxed line-clamp-3 -mt-1">
        {shortBio}
      </p>

      {/* Stats */}
      <div className="flex items-start gap-8 mt-1">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-dv-accent" />
            <span className="text-[15px] font-semibold text-dv-text">{soldCount}</span>
          </div>
          <span className="text-[12px] text-dv-muted ml-[22px]">sold</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-dv-accent" />
            <span className="text-[15px] font-semibold text-dv-text">{availableCount}</span>
          </div>
          <span className="text-[12px] text-dv-muted ml-[22px]">available</span>
        </div>
      </div>
    </Link>
  );
}
