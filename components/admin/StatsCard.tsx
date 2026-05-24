interface StatsCardProps {
  label: string;
  value: string | number;
  bgColor?: string;
  borderColor?: string;
}

export default function StatsCard({
  label,
  value,
  bgColor = "bg-white",
  borderColor = "border-ad-border",
}: StatsCardProps) {
  return (
    <div
      className={`${bgColor} border ${borderColor} rounded-[16px] px-6 py-5 flex flex-col gap-2`}
    >
      <p className="text-[12px] text-ad-gray font-medium">{label}</p>
      <p className="text-[32px] font-bold text-ad-purple leading-none">
        {value}
      </p>
    </div>
  );
}
