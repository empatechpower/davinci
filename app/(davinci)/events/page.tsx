"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, CalendarDays, Loader2 } from "lucide-react";
import type { Event } from "@/lib/db/types";

function fmt(dateStr: string | null) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function EventsPage() {
  const [events, setEvents]   = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data ?? []);
      setLoading(false);
    })();
  }, []);

  const upcoming = events.filter((e) => e.status === "upcoming");
  const past      = events.filter((e) => e.status === "past");
  const featured  = upcoming.filter((e) => e.featured);

  return (
    <div className="flex flex-col">

      {/* HERO */}
      <section style={{ background: "#f7f2eb" }} className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 flex flex-col items-center text-center gap-4">
          <CalendarDays className="w-10 h-10 text-dv-accent" />
          <h1 className="font-serif italic text-dv-accent text-[42px] sm:text-[52px] leading-tight">
            Events &amp; Workshops
          </h1>
          <p className="text-[16px] text-dv-muted max-w-[480px] leading-relaxed">
            Join us for inspiring exhibitions, hands-on workshops, and community gatherings.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-[1280px] mx-auto px-4 py-10 w-full">

        {/* Tabs */}
        <div className="inline-flex border border-black/12 rounded-full p-1 mb-10" style={{ background: "#fafaf8" }}>
          {(["upcoming", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 h-9 rounded-full text-[14px] font-medium transition-all ${
                activeTab === tab ? "bg-white text-dv-text shadow-sm" : "text-dv-muted hover:text-dv-text"
              }`}
            >
              {tab === "upcoming" ? "Upcoming Events" : "Past Events"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-dv-accent" />
          </div>
        ) : (
          <>
            {/* UPCOMING TAB */}
            {activeTab === "upcoming" && (
              <>
                {featured.length > 0 && (
                  <section className="mb-14">
                    <h2 className="font-serif italic text-dv-accent text-[28px] mb-6">Featured Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {featured.map((event) => (
                        <Link
                          key={event.id}
                          href={`/events/${event.slug}`}
                          className="group bg-white rounded-[20px] overflow-hidden border border-black/8 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="relative h-[240px]">
                            {event.image_url ? (
                              <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-dv-bg flex items-center justify-center text-4xl text-dv-muted font-light">
                                {event.title[0]}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            {event.category && (
                              <span className="absolute top-3 left-3 bg-dv-accent text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                                {event.category}
                              </span>
                            )}
                            <h3 className="absolute bottom-4 left-5 right-5 font-serif text-[22px] text-white leading-snug">
                              {event.title}
                            </h3>
                          </div>
                          <div className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                              {event.date && (
                                <div className="flex items-center gap-2 text-[14px] text-dv-accent">
                                  <Calendar className="w-4 h-4 shrink-0" />
                                  {fmt(event.date)}
                                </div>
                              )}
                              {event.time && (
                                <div className="flex items-center gap-2 text-[14px] text-dv-accent">
                                  <Clock className="w-4 h-4 shrink-0" />
                                  {event.time}
                                </div>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-2 text-[14px] text-dv-accent">
                                  <MapPin className="w-4 h-4 shrink-0" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                            {event.description && (
                              <p className="text-[14px] text-dv-muted leading-relaxed">{event.description}</p>
                            )}
                            <span className="w-full h-11 rounded-full bg-dv-accent text-white text-[15px] font-medium flex items-center justify-center gap-1.5 group-hover:opacity-90 transition-opacity">
                              Register Now →
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                <section className="mb-14">
                  <h2 className="font-serif italic text-dv-accent text-[28px] mb-6">All Upcoming Events</h2>
                  {upcoming.length === 0 ? (
                    <p className="text-[15px] text-dv-muted">No upcoming events at the moment.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcoming.map((event) => (
                        <Link
                          key={event.id}
                          href={`/events/${event.slug}`}
                          className="group bg-white rounded-[16px] overflow-hidden border border-black/8 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="relative h-[180px]">
                            {event.image_url ? (
                              <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-dv-bg flex items-center justify-center text-3xl text-dv-muted font-light">
                                {event.title[0]}
                              </div>
                            )}
                            {event.category && (
                              <span className="absolute top-2 right-2 bg-white text-dv-accent text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-dv-accent/40">
                                {event.category}
                              </span>
                            )}
                          </div>
                          <div className="p-4 flex flex-col gap-3">
                            <h3 className="text-[15px] font-semibold text-dv-text leading-snug">{event.title}</h3>
                            <div className="flex flex-col gap-1.5">
                              {event.date && (
                                <div className="flex items-center gap-2 text-[13px] text-dv-accent">
                                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                                  {fmt(event.date)}
                                </div>
                              )}
                              {event.time && (
                                <div className="flex items-center gap-2 text-[13px] text-dv-accent">
                                  <Clock className="w-3.5 h-3.5 shrink-0" />
                                  {event.time}
                                </div>
                              )}
                            </div>
                            <span className="w-full h-9 rounded-full bg-dv-accent text-white text-[13px] font-medium flex items-center justify-center group-hover:opacity-90 transition-opacity">
                              Register
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* PAST TAB */}
            {activeTab === "past" && (
              <section className="mb-14">
                <h2 className="font-serif italic text-dv-accent text-[28px] mb-6">Past Events</h2>
                {past.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-[15px] text-dv-muted">No past events to display.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {past.map((event) => (
                      <div
                        key={event.id}
                        className="bg-white rounded-[16px] overflow-hidden border border-black/8 shadow-sm opacity-85"
                      >
                        <div className="relative h-[180px]">
                          {event.image_url ? (
                            <Image src={event.image_url} alt={event.title} fill className="object-cover grayscale-[30%]" />
                          ) : (
                            <div className="w-full h-full bg-dv-bg flex items-center justify-center text-3xl text-dv-muted font-light">
                              {event.title[0]}
                            </div>
                          )}
                          <span className="absolute top-2 left-2 bg-gray-600 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                            Past
                          </span>
                          {event.category && (
                            <span className="absolute top-2 right-2 bg-white/90 text-dv-muted text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                              {event.category}
                            </span>
                          )}
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                          <h3 className="text-[15px] font-semibold text-dv-text leading-snug">{event.title}</h3>
                          <div className="flex flex-col gap-1.5">
                            {event.date && (
                              <div className="flex items-center gap-2 text-[13px] text-dv-muted">
                                <Calendar className="w-3.5 h-3.5 shrink-0" />
                                {fmt(event.date)}
                              </div>
                            )}
                            {event.time && (
                              <div className="flex items-center gap-2 text-[13px] text-dv-muted">
                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                {event.time}
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/events/${event.slug}`}
                            className="w-full h-9 rounded-full border border-black/20 text-dv-muted text-[13px] font-medium flex items-center justify-center hover:border-dv-accent hover:text-dv-accent transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* NEWSLETTER CTA */}
        <div
          className="rounded-[24px] py-14 px-6 flex flex-col items-center text-center gap-5"
          style={{ background: "#fff7f0" }}
        >
          <CalendarDays className="w-10 h-10 text-dv-accent" />
          <h2 className="font-serif italic text-dv-accent text-[32px] leading-tight">
            Never Miss an Event
          </h2>
          <p className="text-[15px] text-dv-muted max-w-[440px] leading-relaxed">
            Subscribe to our newsletter to get updates about upcoming workshops, exhibitions, and special events.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full max-w-[420px]">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white border border-black/15 rounded-full px-5 h-11 text-[14px] text-dv-text placeholder:text-dv-muted outline-none focus:border-dv-accent min-w-0"
            />
            <button
              type="submit"
              className="bg-dv-accent text-white text-[14px] font-medium px-6 h-11 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
