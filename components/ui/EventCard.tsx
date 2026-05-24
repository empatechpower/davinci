import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: "Upcoming" | "Past";
  attendees: string;
  featured?: boolean;
  imageSrc?: string;
}

export default function EventCard({
  id,
  title,
  date,
  time,
  location,
  category,
  status,
  attendees,
  featured,
}: EventCardProps) {
  return (
    <div className="bg-white border border-dv-accent-border rounded-[24px] overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-[200px] bg-dv-accent/10 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-dv-accent/40 text-4xl font-serif">{title[0]}</span>
        </div>
        <div className="absolute top-4 left-4 flex gap-2">
          {featured && (
            <span className="bg-dv-accent text-white text-[12px] px-3 py-1 rounded-full">
              Featured Event
            </span>
          )}
          <span
            className={`text-[12px] px-3 py-1 rounded-full ${
              status === "Upcoming"
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-3">
        <h3 className="font-serif text-[20px] text-dv-text">{title}</h3>
        <div className="flex flex-col gap-2 text-[14px] text-dv-muted">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-dv-accent shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-dv-accent shrink-0" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-dv-accent shrink-0" />
            <span>{location}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[12px] text-dv-muted bg-gray-100 px-3 py-1 rounded-full">
            {category} · {attendees} attendees
          </span>
          <Link
            href={`/events/${id}`}
            className="text-[14px] text-dv-accent font-medium hover:underline"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
