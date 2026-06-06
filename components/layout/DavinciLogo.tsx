import Link from "next/link";
import Image from "next/image";

interface DavinciLogoProps {
  className?: string;
  dark?: boolean;
  width?: number;
  height?: number;
}

export default function DavinciLogo({
  className = "",
  width = 80,
  height = 40,
}: DavinciLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      <Image
        src="/Logo.svg"
        alt="DaVinci Project"
        width={width}
        height={height}
        priority
      />
    </Link>
  );
}
