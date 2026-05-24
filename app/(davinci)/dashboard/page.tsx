"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Calendar, Clock, MapPin, Users, X, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { EVENTS } from "@/lib/mock-data";

const MOCK_USER = {
  name: "Sarah Johnson",
  email: "sarah.j@email.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, San Francisco, CA 94105",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
};

const STATS = [
  { label: "Total Orders", value: "3" },
  { label: "Delivered", value: "1" },
  { label: "In Progress", value: "2" },
  { label: "Total Spent", value: "$1,910" },
];

const REGISTERED_EVENT_IDS = ["spring-art-exhibition-2025", "watercolor-workshop-emma"];

const MY_REGISTRATIONS = [
  {
    eventId: "spring-art-exhibition-2025",
    attendeeCount: 2,
    registeredOn: "December 20, 2024",
    dietaryRestrictions: "Vegetarian",
    specialRequirements: null as string | null,
  },
  {
    eventId: "watercolor-workshop-emma",
    attendeeCount: 1,
    registeredOn: "December 18, 2024",
    dietaryRestrictions: null as string | null,
    specialRequirements: null as string | null,
  },
];

const MOCK_ORDERS = [
  {
    id: "ORD-2024-001",
    item: "Spring Awakening",
    artist: "Sarah Mitchell",
    total: "$450.00",
    status: "Delivered",
    date: "Nov 13, 2024",
  },
  {
    id: "ORD-2024-002",
    item: "Energy in Motion",
    artist: "Marcus Chen",
    total: "$650.00",
    status: "In Transit",
    date: "Nov 12, 2024",
  },
  {
    id: "ORD-2024-003",
    item: "Morning Dew",
    artist: "Sarah Mitchell",
    total: "$380.00",
    status: "Processing",
    date: "Nov 10, 2024",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "events">("events");
  const [eventFilter, setEventFilter] = useState("All Events");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const myEvents = REGISTERED_EVENT_IDS
    .map((eid) => {
      const event = EVENTS.find((e) => e.id === eid);
      const reg = MY_REGISTRATIONS.find((r) => r.eventId === eid);
      return event && reg ? { ...event, ...reg } : null;
    })
    .filter(Boolean) as (typeof EVENTS[0] & typeof MY_REGISTRATIONS[0])[];

  const upcomingCount = myEvents.filter((e) => e.status === "Upcoming").length;
  const pastCount = myEvents.filter((e) => e.status === "Past").length;

  const filteredEvents =
    eventFilter === "Upcoming"
      ? myEvents.filter((e) => e.status === "Upcoming")
      : eventFilter === "Past"
      ? myEvents.filter((e) => e.status === "Past")
      : myEvents;

  const selectedReg = MY_REGISTRATIONS.find((r) => r.eventId === selectedEventId);
  const selectedEvent = selectedEventId ? EVENTS.find((e) => e.id === selectedEventId) : null;

  return (
    <>
      <div className="max-w-[1280px] mx-auto px-4 py-10">
        {/* Back + heading */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[14px] text-dv-muted mb-4 hover:text-dv-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-serif text-[36px] text-dv-accent">My Dashboard</h1>
          <p className="text-[16px] text-dv-muted">Manage your orders and account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Profile card */}
            <div className="bg-white border-2 border-dv-accent-border rounded-[16px] p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-dv-accent-border">
                  <Image
                    src={MOCK_USER.avatar}
                    alt={MOCK_USER.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[16px] font-semibold text-dv-text">{MOCK_USER.name}</p>
                  <p className="text-[13px] text-dv-muted">Customer</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[13px] text-dv-muted">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>{MOCK_USER.email}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-dv-muted">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{MOCK_USER.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-dv-muted">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{MOCK_USER.address}</span>
                </div>
              </div>
            </div>

            {/* Order stats */}
            <div className="bg-white border border-black rounded-[16px] p-6">
              <p className="text-[14px] font-semibold text-dv-text mb-4">Order Statistics</p>
              <div className="grid grid-cols-2 gap-4">
                {STATS.map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <p className="text-[11px] text-dv-muted uppercase tracking-wide">{label}</p>
                    <p className="text-[22px] font-serif text-dv-accent">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div>
            {/* Tab switcher */}
            <div className="bg-white border border-black rounded-[20px] p-1 inline-flex mb-6">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-5 h-10 rounded-full text-[14px] font-medium transition-colors ${
                  activeTab === "orders" ? "bg-dv-accent text-white" : "text-dv-text hover:text-dv-accent"
                }`}
              >
                Orders &amp; Invoices
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`px-5 h-10 rounded-full text-[14px] font-medium transition-colors ${
                  activeTab === "events" ? "bg-dv-accent text-white" : "text-dv-text hover:text-dv-accent"
                }`}
              >
                My Events
              </button>
            </div>

            {/* Events tab */}
            {activeTab === "events" && (
              <div>
                {/* Summary stats */}
                <div className="mb-5">
                  <h2 className="text-[16px] font-semibold text-dv-text mb-1">My Event Registrations</h2>
                  <p className="text-[13px] text-dv-muted mb-4">View and manage your registered events</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Total Registrations", value: String(myEvents.length) },
                      { label: "Upcoming Events", value: String(upcomingCount) },
                      { label: "Past Events", value: String(pastCount) },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white border border-black rounded-[12px] px-4 py-3">
                        <p className="text-[11px] text-dv-muted uppercase tracking-wide">{label}</p>
                        <p className="text-[22px] font-serif text-dv-accent">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filter chips */}
                <div className="flex gap-2 mb-5 flex-wrap">
                  {[
                    { key: "All Events", label: "All Events" },
                    { key: "Upcoming", label: `Upcoming (${upcomingCount})` },
                    { key: "Past", label: `Past (${pastCount})` },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setEventFilter(key)}
                      className={`text-[13px] px-4 h-8 rounded-full border transition-colors ${
                        eventFilter === key
                          ? "bg-dv-accent text-white border-dv-accent"
                          : "border-black text-dv-text hover:border-dv-accent"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Event cards */}
                <div className="flex flex-col gap-4">
                  {filteredEvents.map((event) => {
                    const reg = MY_REGISTRATIONS.find((r) => r.eventId === event.id)!;
                    return (
                      <div key={event.id} className="bg-white border border-black rounded-[16px] overflow-hidden">
                        {/* Event image */}
                        <div className="relative h-[160px] w-full">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-3 left-4 flex gap-2">
                            <span className="text-[11px] bg-dv-accent text-white px-2.5 py-0.5 rounded-full">
                              {event.category}
                            </span>
                            <span
                              className={`text-[11px] px-2.5 py-0.5 rounded-full ${
                                event.status === "Past"
                                  ? "bg-gray-500 text-white"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {event.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="font-serif text-[18px] text-dv-text mb-3">{event.title}</h3>
                          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-dv-muted mb-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {event.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {event.time}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              {event.location}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5" />
                              {reg.attendeeCount} attendee{reg.attendeeCount > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[12px] text-dv-muted">Registered on {reg.registeredOn}</p>
                            <button
                              onClick={() => setSelectedEventId(event.id)}
                              className="text-[13px] text-dv-accent font-medium hover:underline"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredEvents.length === 0 && (
                    <div className="bg-white border border-black rounded-[16px] p-10 text-center">
                      <p className="text-[14px] text-dv-muted">No events in this category.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders tab */}
            {activeTab === "orders" && (
              <div className="bg-white border border-black rounded-[16px] overflow-hidden">
                <div className="px-6 py-4 border-b border-black">
                  <p className="text-[15px] font-semibold text-dv-text">Orders &amp; Invoices</p>
                </div>
                <div className="divide-y divide-black/10">
                  {MOCK_ORDERS.map((order) => (
                    <div key={order.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[14px] font-medium text-dv-text">{order.item}</p>
                        <p className="text-[12px] text-dv-muted">by {order.artist} · {order.date}</p>
                        <p className="text-[11px] text-dv-muted font-mono mt-0.5">{order.id}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[15px] font-serif text-dv-accent">{order.total}</p>
                        <span
                          className={`text-[11px] px-2.5 py-0.5 rounded-full ${
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : order.status === "In Transit"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration details modal */}
      {selectedEvent && selectedReg && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-[720px] overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-black/10 flex items-center justify-between">
              <h3 className="font-serif text-[20px] text-dv-accent">Registration Details</h3>
              <button
                onClick={() => setSelectedEventId(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-dv-text" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {/* Event hero image */}
              <div className="relative h-[220px] w-full rounded-[16px] overflow-hidden">
                <Image
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="flex gap-2 mb-2">
                    <span className="text-[11px] bg-dv-accent text-white px-2.5 py-0.5 rounded-full">
                      {selectedEvent.category}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full ${
                        selectedEvent.status === "Past"
                          ? "bg-gray-500 text-white"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedEvent.status === "Past" ? "Past Event" : "Upcoming Event"}
                    </span>
                  </div>
                  <h2 className="font-serif text-[22px] text-white leading-tight">
                    {selectedEvent.title}
                  </h2>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-black/10 rounded-[16px] p-4 bg-[#fafaf9]">
                  <h4 className="text-[14px] font-semibold text-dv-text mb-3">Event Information</h4>
                  <div className="flex flex-col gap-2.5 text-[13px]">
                    {[
                      { label: "Date", value: selectedEvent.date },
                      { label: "Time", value: selectedEvent.time },
                      { label: "Location", value: selectedEvent.location },
                      { label: "Admission", value: selectedEvent.admission },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-dv-muted shrink-0">{label}</span>
                        <span className="text-dv-text text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-black/10 rounded-[16px] p-4 bg-[#fafaf9]">
                  <h4 className="text-[14px] font-semibold text-dv-text mb-3">Your Registration</h4>
                  <div className="flex flex-col gap-2.5 text-[13px]">
                    {[
                      { label: "Name", value: MOCK_USER.name },
                      { label: "Email", value: MOCK_USER.email },
                      { label: "Phone", value: MOCK_USER.phone },
                      { label: "Attendees", value: String(selectedReg.attendeeCount) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between gap-4">
                        <span className="text-dv-muted shrink-0">{label}</span>
                        <span className="text-dv-text text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dietary / special requirements */}
              {(selectedReg.dietaryRestrictions || selectedReg.specialRequirements) && (
                <div className="border border-dv-accent-border rounded-[16px] p-4 bg-dv-accent/5">
                  <h4 className="text-[14px] font-semibold text-dv-text mb-2">Additional Information</h4>
                  {selectedReg.dietaryRestrictions && (
                    <p className="text-[13px] text-dv-muted">
                      Dietary restrictions: {selectedReg.dietaryRestrictions}
                    </p>
                  )}
                  {selectedReg.specialRequirements && (
                    <p className="text-[13px] text-dv-muted mt-1">
                      Special requirements: {selectedReg.specialRequirements}
                    </p>
                  )}
                </div>
              )}

              {/* About */}
              <div>
                <h4 className="text-[14px] font-semibold text-dv-text mb-1">About This Event</h4>
                <p className="text-[13px] text-dv-muted leading-relaxed">
                  {selectedEvent.longDescription}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-black/10">
                <button
                  onClick={() => setSelectedEventId(null)}
                  className="flex-1 h-10 rounded-full border border-black text-[14px] text-dv-text hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 h-10 rounded-full bg-red-600 text-white text-[14px] hover:opacity-90 transition-opacity">
                  Cancel Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
