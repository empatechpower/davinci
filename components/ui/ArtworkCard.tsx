import Link from "next/link";
import Image from "next/image";

interface ArtworkCardProps {
  title: string;
  description: string;
  price: string;
  imageSrc?: string;
  href: string;
}

export default function ArtworkCard({
  title,
  description,
  price,
  imageSrc,
  href,
}: ArtworkCardProps) {
  return (
    <Link href={href} className="flex flex-col gap-3 group">
      <div className="bg-as-card rounded-[10px] overflow-hidden aspect-square w-full">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            width={389}
            height={389}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-as-card flex items-center justify-center">
            <span className="text-as-muted text-5xl font-light">{title[0]}</span>
          </div>
        )}
      </div>
      <h4 className="text-[16px] font-normal text-as-text">{title}</h4>
      <p className="text-[16px] text-as-gray leading-relaxed line-clamp-2">
        {description}
      </p>
      <p className="text-[16px] font-normal text-as-text">{price}</p>
    </Link>
  );
}
