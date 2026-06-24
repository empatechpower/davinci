"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag, CalendarDays, Mail, Phone, MapPin, User,
  Calendar, Clock, Users, FileText, Trash2, Eye, X, Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Order, OrderItem, Event, EventRegistration } from "@/lib/db/types";

type OrderWithItems = Order & { order_items: OrderItem[] };
type RegWithEvent  = EventRegistration & { events: Event };

function statusStyle(status: string) {
  if (status === "delivered") return "bg-green-100 text-green-700";
  if (status === "shipped")   return "bg-purple-100 text-purple-700";
  return "bg-yellow-100 text-yellow-700";
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fmt(n: number | string | null) { return `$${Number(n ?? 0).toFixed(2)}`; }

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [orders,   setOrders]   = useState<OrderWithItems[]>([]);
  const [regs,     setRegs]     = useState<RegWithEvent[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [profile,  setProfile]  = useState<{ phone?: string | null; address?: string | null }>({});
  const [activeTab, setActiveTab]       = useState<"orders" | "events">("orders");
  const [eventFilter, setEventFilter]   = useState("All Events");
  const [selectedReg, setSelectedReg]   = useState<RegWithEvent | null>(null);

  useEffect(() => {
    (async () => {
      const [ordRes, regRes, profRes] = await Promise.all([
        fetch("/api/user/orders"),
        fetch("/api/user/registrations"),
        fetch("/api/user/profile"),
      ]);
      const [ords, registrations, prof] = await Promise.all([ordRes.json(), regRes.json(), profRes.json()]);
      setOrders(Array.isArray(ords) ? ords : []);
      setRegs(Array.isArray(registrations) ? registrations.filter((r: RegWithEvent) => r.events) : []);
      setProfile(prof ?? {});
      setLoading(false);
    })();
  }, []);

  const upcomingRegs = regs.filter((r) => r.events?.status === "upcoming");
  const pastRegs     = regs.filter((r) => r.events?.status === "past");

  async function handleCancelRegistration(regId: string) {
    if (!confirm("Cancel this registration?")) return;
    const res = await fetch(`/api/user/registrations/${regId}`, { method: "DELETE" });
    if (res.ok) {
      setRegs((prev) => prev.filter((r) => r.id !== regId));
      setSelectedReg((prev) => (prev?.id === regId ? null : prev));
    }
  }

  const filteredRegs =
    eventFilter === "Upcoming" ? upcomingRegs :
    eventFilter === "Past"     ? pastRegs     :
    regs;

  const totalSpent    = orders.reduce((s, o) => s + (o.total ?? 0), 0);
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const inProgressCount = orders.filter((o) => o.status !== "delivered").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#faf9f7" }}>
        <Loader2 className="w-6 h-6 animate-spin text-dv-accent" />
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen" style={{ background: "#faf9f7" }}>
      <div className="max-w-[1280px] mx-auto px-4 py-10">
        <h1 className="font-serif italic text-dv-accent text-[36px] leading-tight mb-1">My Dashboard</h1>
        <p className="text-[15px] text-dv-muted mb-8">Manage your orders and account information</p>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">

          {/* SIDEBAR */}
          <div className="flex flex-col gap-5">
            <div className="rounded-[20px] overflow-hidden border border-black/8 shadow-sm bg-white">
              <div className="flex flex-col items-center py-8 gap-3" style={{ background: "linear-gradient(135deg, #ff8c42 0%, #ffad72 100%)" }}>
                <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <p className="font-serif italic text-white text-[20px] leading-tight">
                  {session?.user?.name ?? "Guest"}
                </p>
              </div>
              <div className="px-5 py-5 flex flex-col gap-4">
                {[
                  { icon: Mail,   label: "Email",   value: session?.user?.email ?? "—" },
                  { icon: Phone,  label: "Phone",   value: profile.phone    ?? "—" },
                  { icon: MapPin, label: "Address", value: profile.address  ?? "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-dv-accent" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-dv-muted uppercase tracking-wide">{label}</p>
                      <p className="text-[13px] text-dv-text">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] px-5 py-5 border border-black/8 shadow-sm" style={{ background: "#fff7f0" }}>
              <p className="font-serif italic text-dv-accent text-[16px] mb-4">Order Statistics</p>
              <div className="flex flex-col gap-0">
                {[
                  { label: "Total Orders",  value: String(orders.length),  color: "text-dv-text"  },
                  { label: "Delivered",     value: String(deliveredCount),  color: "text-green-600" },
                  { label: "In Progress",   value: String(inProgressCount), color: "text-dv-accent" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-black/8">
                    <span className="text-[14px] text-dv-muted">{label}</span>
                    <span className={`text-[14px] font-semibold ${color}`}>{value}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3">
                  <span className="text-[14px] font-medium text-dv-text">Total Spent</span>
                  <span className="font-serif italic text-dv-accent text-[18px] font-bold">{fmt(totalSpent)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex flex-col gap-6">
            <div className="bg-white border border-black/10 rounded-full p-1 inline-flex self-start shadow-sm">
              {([
                { key: "orders", icon: ShoppingBag, label: "Orders & Invoices" },
                { key: "events", icon: CalendarDays, label: "My Events" },
              ] as const).map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`inline-flex items-center gap-2 px-5 h-10 rounded-full text-[14px] font-medium transition-all ${
                    activeTab === key ? "bg-dv-accent text-white shadow-sm" : "text-dv-text hover:text-dv-accent"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="bg-white border border-black/8 rounded-[20px] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag className="w-5 h-5 text-dv-accent" />
                  <h2 className="font-serif italic text-dv-accent text-[24px]">My Orders &amp; Invoices</h2>
                </div>
                <p className="text-[13px] text-dv-muted mb-6">View your order history and download invoices</p>

                {orders.length === 0 ? (
                  <p className="text-[14px] text-dv-muted text-center py-8">No orders yet.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-black/8 rounded-[16px] p-5">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-[14px] font-semibold text-dv-text">{order.order_number}</p>
                            <p className="text-[12px] text-dv-muted">{fmtDate(order.created_at)}</p>
                          </div>
                          <span className={`text-[12px] font-medium px-3 py-1 rounded-full shrink-0 ${statusStyle(order.status)}`}>
                            {capitalize(order.status)}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1.5 mb-4">
                          {order.order_items?.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-[13px]">
                              <span className="text-dv-muted">
                                {item.artwork_title ?? "Artwork"}{item.artist_name ? ` by ${item.artist_name}` : ""} (x{item.quantity})
                              </span>
                              <span className="text-dv-text font-medium">
                                {fmt((item.price ?? 0) * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-black/8 pt-3 flex items-center justify-between">
                          <div>
                            <p className="text-[12px] text-dv-muted mb-0.5">Total Amount</p>
                            <p className="font-serif italic text-dv-accent text-[18px] font-bold">
                              {fmt(order.total ?? 0)}
                            </p>
                          </div>
                          <Link
                            href={`/invoice/${order.order_number}`}
                            className="inline-flex items-center gap-2 bg-dv-accent text-white text-[13px] font-medium px-4 h-9 rounded-full hover:opacity-90 transition-opacity"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View Invoice
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === "events" && (
              <div className="bg-white border border-black/8 rounded-[20px] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="w-5 h-5 text-dv-accent" />
                  <h2 className="font-serif italic text-dv-accent text-[24px]">My Event Registrations</h2>
                </div>
                <p className="text-[13px] text-dv-muted mb-6">View and manage your registered events</p>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "Total Registrations", value: regs.length },
                    { label: "Upcoming Events",     value: upcomingRegs.length },
                    { label: "Past Events",          value: pastRegs.length },
                  ].map(({ label, value }) => (
                    <div key={label} className="border border-black/8 rounded-[14px] px-4 py-3">
                      <p className="text-[11px] text-dv-muted mb-1">{label}</p>
                      <p className="font-serif italic text-dv-accent text-[24px] font-bold leading-none">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mb-5 flex-wrap">
                  {[
                    { key: "All Events", label: "All Events" },
                    { key: "Upcoming",   label: `Upcoming (${upcomingRegs.length})` },
                    { key: "Past",       label: `Past (${pastRegs.length})` },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setEventFilter(key)}
                      className={`text-[13px] font-medium px-4 h-8 rounded-full border transition-colors ${
                        eventFilter === key
                          ? "bg-dv-accent text-white border-dv-accent"
                          : "border-black/15 text-dv-text hover:border-dv-accent hover:text-dv-accent"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredRegs.map((reg) => {
                    const event = reg.events;
                    return (
                      <div key={reg.id} className="border border-black/8 rounded-[16px] overflow-hidden flex flex-col">
                        <div className="relative h-[160px] w-full">
                          {event.image_url ? (
                            <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-dv-bg" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                            {event.category && (
                              <span className="text-[11px] font-medium bg-dv-accent text-white px-2.5 py-0.5 rounded-full">
                                {event.category}
                              </span>
                            )}
                            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                              event.status === "upcoming" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                            }`}>
                              {capitalize(event.status)}
                            </span>
                          </div>
                          <p className="absolute bottom-3 left-4 right-4 font-serif text-white text-[15px] font-semibold leading-snug">
                            {event.title}
                          </p>
                        </div>
                        <div className="p-4 flex flex-col gap-2 flex-1">
                          <div className="flex flex-col gap-1.5 text-[12px] text-dv-muted">
                            {event.date && (
                              <span className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-dv-accent shrink-0" />
                                {fmtDate(event.date)}
                              </span>
                            )}
                            {event.time && (
                              <span className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-dv-accent shrink-0" />
                                {event.time}
                              </span>
                            )}
                            {event.location && (
                              <span className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-dv-accent shrink-0" />
                                {event.location}
                              </span>
                            )}
                            <span className="flex items-center gap-2">
                              <Users className="w-3.5 h-3.5 text-dv-accent shrink-0" />
                              {reg.attendee_count} attendee{reg.attendee_count > 1 ? "s" : ""}
                            </span>
                          </div>
                          <p className="text-[11px] text-dv-muted/70 mt-1">
                            Registered on {fmtDate(reg.registered_at)}
                          </p>
                          <div className="flex items-center gap-2 mt-auto pt-2">
                            <button
                              onClick={() => setSelectedReg(reg)}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 border border-black/15 rounded-full h-8 text-[12px] text-dv-text hover:border-dv-accent hover:text-dv-accent transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleCancelRegistration(reg.id)}
                              className="w-8 h-8 rounded-full border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors shrink-0"
                              aria-label="Cancel registration"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredRegs.length === 0 && (
                    <div className="col-span-2 text-center py-12 text-[14px] text-dv-muted border border-black/8 rounded-[16px]">
                      No events in this category.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* REGISTRATION DETAILS MODAL */}
    {selectedReg && (() => {
      const event = selectedReg.events;
      return (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedReg(null); }}
        >
          <div className="bg-white rounded-[24px] w-full max-w-[720px] overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 flex items-center justify-between border-b border-black/8">
              <h3 className="font-serif italic text-dv-accent text-[20px]">Registration Details</h3>
              <button onClick={() => setSelectedReg(null)} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-dv-muted" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              {event.image_url && (
                <div className="relative h-[200px] w-full rounded-[14px] overflow-hidden">
                  <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[20px] font-semibold text-dv-text mb-2">{event.title}</h2>
                  {event.category && (
                    <span className="text-[12px] font-medium text-dv-accent border border-dv-accent px-3 py-1 rounded-full">
                      {event.category}
                    </span>
                  )}
                </div>
                <span className={`text-[12px] font-medium px-3 py-1 rounded-full shrink-0 ${
                  event.status === "upcoming" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {event.status === "upcoming" ? "Upcoming Event" : "Past Event"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-[14px] p-4" style={{ background: "#faf9f7" }}>
                  <h4 className="text-[14px] font-semibold text-dv-text mb-3">Event Information</h4>
                  <div className="flex flex-col gap-2.5 text-[13px]">
                    {event.date && (
                      <span className="flex items-center gap-2 text-dv-muted">
                        <Calendar className="w-3.5 h-3.5 text-dv-accent shrink-0" />
                        {fmtDate(event.date)}
                      </span>
                    )}
                    {event.time && (
                      <span className="flex items-center gap-2 text-dv-muted">
                        <Clock className="w-3.5 h-3.5 text-dv-accent shrink-0" />
                        {event.time}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-2 text-dv-muted">
                        <MapPin className="w-3.5 h-3.5 text-dv-accent shrink-0" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="rounded-[14px] p-4" style={{ background: "#faf9f7" }}>
                  <h4 className="text-[14px] font-semibold text-dv-text mb-3">Your Registration</h4>
                  <div className="flex flex-col gap-2 text-[13px]">
                    {[
                      { label: "Name:",       value: selectedReg.name      ?? "—" },
                      { label: "Email:",      value: selectedReg.email     ?? "—" },
                      { label: "Phone:",      value: selectedReg.phone     ?? "—" },
                      { label: "Attendees:", value: String(selectedReg.attendee_count) },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-dv-muted text-[11px]">{label}</p>
                        <p className="text-dv-text font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedReg.dietary_restrictions && (
                <div>
                  <h4 className="text-[14px] font-semibold text-dv-text mb-2">Additional Information</h4>
                  <p className="text-[12px] text-dv-accent">Dietary Restrictions:</p>
                  <p className="text-[14px] text-dv-text">{selectedReg.dietary_restrictions}</p>
                </div>
              )}

              {event.description && (
                <div>
                  <h4 className="text-[14px] font-semibold text-dv-text mb-1">About This Event</h4>
                  <p className="text-[13px] text-dv-muted leading-relaxed">{event.description}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2 border-t border-black/8">
                <button
                  onClick={() => setSelectedReg(null)}
                  className="flex-1 h-10 rounded-full border border-black/15 text-[14px] text-dv-text hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleCancelRegistration(selectedReg.id)}
                  className="flex-1 h-10 rounded-full bg-red-600 text-white text-[14px] font-medium hover:opacity-90 transition-opacity"
                >
                  Cancel Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    })()}
    </>
  );
}
