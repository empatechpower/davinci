import Link from "next/link";

interface DavinciLogoProps {
  className?: string;
  dark?: boolean;
}

export default function DavinciLogo({ className = "", dark = false }: DavinciLogoProps) {
  return (
    <Link href="/" className={`flex flex-col leading-none ${className}`}>
      <span
        className="font-black text-[22px] tracking-tight"
        style={{
          background:
            "linear-gradient(90deg, #ff8c42 0%, #e63946 25%, #2a9d8f 50%, #e9c46a 75%, #264653 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        DAVINCI
      </span>
      <span
        className="text-[10px] font-bold tracking-[0.2em]"
        style={{ color: dark ? "rgba(255,255,255,0.6)" : "#264653" }}
      >
        PROJECT
      </span>
    </Link>
  );
}
