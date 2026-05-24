"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  Star,
  User,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { EVENTS } from "@/lib/mock-data";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const INFO_ROWS = (event: (typeof EVENTS)[0]) => [
  { icon: Calendar, label: "Date", value: event.date },
  { icon: Clock, label: "Time", value: event.time },
  { icon: MapPin, label: "Location", value: event.location },
  { icon: Users, label: "Expected Attendees", value: `${event.expectedAttendees}\npeople` },
];

export default function EventDetailPage({ params }: Props) {
  const { id } = use(params);
  const event = EVENTS.find((e) => e.id === id);
  if (!event) notFound();

  const isPast = event.status === "Past";

  const [registered, setRegistered] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    attendees: "1",
    dietary: "",
    special: "",
  });

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, [showToast]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRegistered(true);
    setShowToast(true);
  }

  /* ─────────────────────────────────────────────
     SUCCESS STATE
  ───────────────────────────────────────────── */
  if (registered) {
    return (
      <div className="bg-[#fafaf8] min-h-screen py-16 px-4">
        <div className="max-w-[560px] mx-auto bg-white border border-black/8 rounded-[24px] p-10 shadow-sm text-center">
          {/* Check icon */}
          <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-9 h-9 text-green-500" />
          </div>

          <h1 className="font-serif italic text-dv-accent text-[32px] mb-2">
            You&apos;re Registered!
          </h1>
          <p className="text-[15px] text-dv-muted mb-7">
            Thank you for registering for{" "}
            <span className="font-semibold text-dv-text">{event.title}</span>
          </p>

          {/* Event summary */}
          <div className="rounded-[16px] p-5 mb-5 text-left" style={{ background: "#fff7f0" }}>
            <p className="text-[13px] font-semibold text-dv-text mb-3">Event Details</p>
            <div className="flex flex-col gap-2.5">
              {[
                { icon: Calendar, text: event.date },
                { icon: Clock, text: event.time },
                { icon: MapPin, text: event.location },
                {
                  icon: Users,
                  text: `${form.attendees} attendee${form.attendees !== "1" ? "s" : ""}`,
                },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-[14px] text-dv-text">
                  <Icon className="w-4 h-4 text-dv-accent shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Confirmation notice */}
          <div className="bg-blue-50 rounded-[12px] p-4 mb-7 text-left">
            <p className="text-[13px] text-blue-800 leading-relaxed">
              <span className="font-semibold">Confirmation sent!</span> We&apos;ve sent a
              confirmation email to{" "}
              <span className="font-medium">{form.email}</span> with all the event details and
              your registration information.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href="/events"
              className="flex-1 h-11 rounded-full border border-black/20 text-[14px] text-dv-text flex items-center justify-center hover:border-dv-accent hover:text-dv-accent transition-colors"
            >
              Browse More Events
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 h-11 rounded-full bg-dv-accent text-white text-[14px] font-medium flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              View My Registrations
            </Link>
          </div>
        </div>

        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-6 right-6 bg-[#1a3a2a] text-white text-[14px] font-medium px-5 py-3 rounded-[12px] flex items-center gap-2.5 shadow-lg z-50">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            Registration successful!
          </div>
        )}
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     PAST EVENT LAYOUT
  ───────────────────────────────────────────── */
  if (isPast) {
    return (
      <div className="bg-[#fafaf8] min-h-screen">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-[14px] text-dv-muted mb-6 hover:text-dv-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Events
          </Link>

          {/* Hero */}
          <div className="relative h-[360px] rounded-[20px] overflow-hidden mb-8">
            <Image src={event.image} alt={event.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
            {/* Top badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-white text-dv-accent text-[12px] font-medium px-3 py-1 rounded-full border border-dv-accent/25">
                {event.category}
              </span>
              {event.featured && (
                <span className="bg-dv-accent text-white text-[12px] font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3" fill="white" />
                  Featured Event
                </span>
              )}
            </div>
            <span className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-[12px] font-medium px-3 py-1 rounded-full">
              Past Event
            </span>
            {/* Title */}
            <h1 className="absolute bottom-6 left-6 right-6 font-serif italic text-white text-[36px] sm:text-[44px] leading-tight">
              {event.title}
            </h1>
          </div>

          {/* Two-column body */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* Left */}
            <div className="flex flex-col gap-6">
              {/* About */}
              <div className="bg-white border border-black/8 rounded-[20px] p-7">
                <h2 className="font-serif italic text-dv-accent text-[22px] mb-3">
                  About This Event
                </h2>
                <p className="text-[15px] text-dv-muted leading-relaxed">{event.description}</p>
              </div>

              {/* What to Expect */}
              <div className="bg-white border border-black/8 rounded-[20px] p-7">
                <h2 className="font-serif italic text-dv-accent text-[22px] mb-5">
                  What to Expect
                </h2>
                <div className="flex flex-col gap-5">
                  {[
                    {
                      n: "1",
                      title: "View Amazing Artworks",
                      desc: "Experience a curated collection of stunning pieces created by our talented special-needs artists.",
                    },
                    {
                      n: "2",
                      title: "Meet the Artists",
                      desc: "Connect with the artists, hear their stories, and learn about their creative journey.",
                    },
                    {
                      n: "3",
                      title: "Purchase & Support",
                      desc: "All artworks are available for purchase, with 60% of proceeds going directly to the artists.",
                    },
                  ].map(({ n, title, desc }) => (
                    <div key={n} className="flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-dv-accent/15 text-dv-accent text-[13px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {n}
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-dv-text mb-1">{title}</p>
                        <p className="text-[14px] text-dv-muted leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supporting Mission */}
              <div className="rounded-[20px] p-7" style={{ background: "#fff7f0" }}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full bg-dv-accent flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4 text-white" fill="white" />
                  </div>
                  <h2 className="font-serif italic text-dv-accent text-[20px]">
                    Supporting Our Mission
                  </h2>
                </div>
                <p className="text-[14px] text-dv-muted leading-relaxed">
                  Every event helps support special-needs artists in finding hope and purpose
                  through their creations. Your participation makes a real difference in their
                  lives and helps us continue our mission of empowering artists and makers, one
                  creation at a time.
                </p>
              </div>
            </div>

            {/* Right sticky info card */}
            <div>
              <div className="bg-white border border-black/8 rounded-[20px] p-6 sticky top-20">
                <h3 className="font-serif italic text-dv-accent text-[20px] mb-5">
                  Event Information
                </h3>
                <div className="flex flex-col gap-4 mb-5">
                  {INFO_ROWS(event).map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-dv-accent/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-dv-accent" />
                      </div>
                      <div>
                        <p className="text-[11px] text-dv-muted mb-0.5">{label}</p>
                        <p className="text-[14px] text-dv-text whitespace-pre-line">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 rounded-[12px] p-3.5 mb-4">
                  <p className="text-[13px] font-semibold text-green-800">
                    {event.admission === "Free" ? "Free Admission" : event.admission}
                  </p>
                  <p className="text-[12px] text-green-700 mt-0.5">
                    No ticket required • Limited spots available
                  </p>
                </div>

                <button
                  disabled
                  className="w-full h-11 rounded-full bg-[#99a1af] text-white text-[14px] font-medium cursor-not-allowed"
                >
                  Event Has Passed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────
     UPCOMING EVENT — REGISTRATION FORM LAYOUT
  ───────────────────────────────────────────── */
  return (
    <div className="bg-[#fafaf8] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-[14px] text-dv-muted mb-6 hover:text-dv-accent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">

          {/* Left: Event info card */}
          <div className="bg-white border border-black/8 rounded-[20px] overflow-hidden shadow-sm">
            <div className="relative h-[210px]">
              <Image src={event.image} alt={event.title} fill className="object-cover" />
            </div>
            <div className="p-6 flex flex-col gap-4">
              <span className="inline-flex bg-dv-accent/10 text-dv-accent text-[12px] font-medium px-3 py-1 rounded-full w-fit border border-dv-accent/20">
                {event.category}
              </span>
              <h1 className="font-serif italic text-dv-accent text-[26px] leading-snug">
                {event.title}
              </h1>
              <div className="flex flex-col gap-3">
                {INFO_ROWS(event).map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-dv-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-dv-accent" />
                    </div>
                    <div>
                      <p className="text-[11px] text-dv-muted">{label}</p>
                      <p className="text-[14px] text-dv-text whitespace-pre-line">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-dv-text mb-1.5">About This Event</p>
                <p className="text-[14px] text-dv-muted leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>

          {/* Right: Registration form */}
          <div className="bg-white border border-black/8 rounded-[20px] p-7 shadow-sm">
            <h2 className="font-serif italic text-dv-accent text-[26px] mb-5">
              Register for Event
            </h2>

            {/* Sign-in tip */}
            <div
              className="flex items-start gap-2.5 rounded-[12px] p-3.5 mb-6 border border-dv-accent/15"
              style={{ background: "#fff7f0" }}
            >
              <Star className="w-4 h-4 text-dv-accent shrink-0 mt-0.5" fill="#ff8c42" />
              <p className="text-[13px] text-dv-muted leading-snug">
                Sign in to auto-fill your information and track your registrations.{" "}
                <Link href="/login" className="text-dv-accent font-medium hover:underline">
                  Sign in now
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-dv-text">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2.5 border border-black/15 rounded-[10px] px-3 h-11 focus-within:border-dv-accent transition-colors">
                  <User className="w-4 h-4 text-dv-muted shrink-0" />
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="flex-1 text-[14px] text-dv-text placeholder:text-dv-muted bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-dv-text">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2.5 border border-black/15 rounded-[10px] px-3 h-11 focus-within:border-dv-accent transition-colors">
                  <Mail className="w-4 h-4 text-dv-muted shrink-0" />
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="flex-1 text-[14px] text-dv-text placeholder:text-dv-muted bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-dv-text">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2.5 border border-black/15 rounded-[10px] px-3 h-11 focus-within:border-dv-accent transition-colors">
                  <Phone className="w-4 h-4 text-dv-muted shrink-0" />
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="flex-1 text-[14px] text-dv-text placeholder:text-dv-muted bg-transparent outline-none"
                  />
                </div>
              </div>

              {/* Attendee count */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-dv-text">
                  Number of Attendees
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={form.attendees}
                  onChange={(e) => setForm({ ...form, attendees: e.target.value })}
                  className="border border-black/15 rounded-[10px] px-3 h-11 text-[14px] text-dv-text outline-none focus:border-dv-accent transition-colors"
                />
              </div>

              {/* Dietary */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-dv-text">
                  Dietary Restrictions{" "}
                  <span className="text-dv-muted font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={form.dietary}
                  onChange={(e) => setForm({ ...form, dietary: e.target.value })}
                  placeholder="e.g., Vegetarian, Gluten-free"
                  className="border border-black/15 rounded-[10px] px-3 h-11 text-[14px] text-dv-text placeholder:text-dv-muted outline-none focus:border-dv-accent transition-colors"
                />
              </div>

              {/* Special requirements */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-dv-text">
                  Special Requirements{" "}
                  <span className="text-dv-muted font-normal">(Optional)</span>
                </label>
                <textarea
                  value={form.special}
                  onChange={(e) => setForm({ ...form, special: e.target.value })}
                  placeholder="Any accessibility needs or special requests..."
                  rows={3}
                  className="border border-black/15 rounded-[10px] px-3 py-2.5 text-[14px] text-dv-text placeholder:text-dv-muted outline-none focus:border-dv-accent transition-colors resize-none"
                />
              </div>

              {/* Terms notice */}
              <div className="rounded-[10px] px-4 py-3" style={{ background: "#fff7f0" }}>
                <p className="text-[13px] text-dv-muted leading-snug">
                  By registering, you agree to receive event updates and reminders via email.
                </p>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-dv-accent text-white text-[15px] font-medium hover:opacity-90 transition-opacity mt-1"
              >
                Complete Registration
              </button>

              <p className="text-center text-[12px] text-dv-muted">
                {event.admission === "Free" ? "Free admission" : event.admission} • Limited spots
                available
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
