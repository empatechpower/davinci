"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Search, X, Eye, Pencil, Trash2, MapPin, Users, Download, Calendar, Clock, Star, Loader2 } from "lucide-react";
import type { Event as EventItem, EventRegistration } from "@/lib/db/types";

const CATEGORIES = ["Exhibition", "Workshop", "Art Fair", "Community Event", "Fundraiser"];
const STATUS_OPTIONS = ["All Status", "Upcoming", "Past"];
const CATEGORY_OPTIONS = ["All Categories", ...CATEGORIES];

const STATUS_STYLE: Record<string, string> = {
  Upcoming: "bg-green-50 text-green-700",
  Past: "bg-gray-100 text-gray-500",
};

const DEFAULT_FORM = {
  title: "", date: "", time: "", location: "", category: "Exhibition",
  attendees: "0", description: "", image_url: "", status: "Upcoming", featured: false,
};

export default function EventsManagementPage() {
  const [events, setEvents]           = useState<EventItem[]>([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter]     = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [addModalOpen, setAddModalOpen]     = useState(false);
  const [attendeesModalEvent, setAttendeesModalEvent] = useState<EventItem | null>(null);
  const [detailsEvent, setDetailsEvent]     = useState<EventItem | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/events");
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAddEvent = async () => {
    setSaving(true);
    const slug = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const fd = new FormData();
    fd.append("slug", slug);
    fd.append("title", form.title);
    if (form.date)     fd.append("date", form.date);
    if (form.time)     fd.append("time", form.time);
    if (form.location) fd.append("location", form.location);
    if (form.category) fd.append("category", form.category);
    if (form.attendees) fd.append("expected_attendees", form.attendees);
    if (form.description) fd.append("description", form.description);
    if (form.image_url) fd.append("image_url", form.image_url);
    fd.append("status", form.status);
    fd.append("featured", String(form.featured));
    const res = await fetch("/api/admin/events", { method: "POST", body: fd });
    setSaving(false);
    if (res.ok) { setAddModalOpen(false); setForm(DEFAULT_FORM); load(); }
  };

  const filtered = events.filter((e) => {
    const matchSearch   = !search || e.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = statusFilter === "All Status" || e.status === statusFilter;
    const matchCategory = categoryFilter === "All Categories" || e.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const stats = [
    { label: "Total Events", value: events.length },
    { label: "Upcoming",     value: events.filter((e) => e.status === "Upcoming").length },
    { label: "Past Events",  value: events.filter((e) => e.status === "Past").length },
    { label: "Featured",     value: events.filter((e) => e.featured).length },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-ad-purple/10 rounded-[8px] flex items-center justify-center mt-0.5">
              <Plus className="w-4 h-4 text-ad-purple" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-ad-dark">Events Management</h2>
              <p className="text-[14px] text-ad-gray">Manage exhibitions, workshops, and community events</p>
            </div>
          </div>
          <button onClick={() => setAddModalOpen(true)}
            className="bg-ad-purple text-white text-[14px] rounded-[8px] px-4 h-9 flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0">
            <Plus className="w-4 h-4" /> Add Event
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-white border border-ad-border rounded-[16px] px-5 py-4">
              <p className="text-[12px] text-ad-gray">{label}</p>
              <p className="text-[28px] font-bold text-ad-purple leading-tight">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-ad-border rounded-[16px] p-4 flex flex-col sm:flex-row gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-ad-border rounded-[8px] px-3 h-10 text-[14px] text-ad-dark outline-none">
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-ad-border rounded-[8px] px-3 h-10 text-[14px] text-ad-dark outline-none">
            {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-ad-gray absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search events..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-black bg-[#f7fafc] rounded-[8px] pl-9 pr-3 h-9 text-[14px] outline-none" />
          </div>
        </div>

        <div className="bg-white border border-ad-border rounded-[16px] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-ad-purple" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f8f7fc] border-b border-ad-border">
                  <tr>
                    {["Event", "Date & Time", "Location", "Category", "Attendees", "Status", "Actions"].map((col) => (
                      <th key={col} className="px-4 py-3 text-left text-[12px] font-semibold text-ad-gray whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((event) => (
                    <tr key={event.id} className="border-b border-ad-border last:border-none hover:bg-gray-50/50">
                      <td className="px-4 py-3 min-w-[220px]">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-[8px] overflow-hidden bg-as-card shrink-0">
                            {event.thumbnail_url
                              ? <Image src={event.thumbnail_url} alt={event.title} width={48} height={48} className="w-full h-full object-cover" />
                              : <div className="w-full h-full bg-dv-accent/20 flex items-center justify-center"><span className="text-dv-accent text-lg font-serif">{event.title[0]}</span></div>
                            }
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-ad-dark leading-tight">{event.title}</p>
                            {event.featured && (
                              <span className="text-[11px] bg-ad-purple/10 text-ad-purple px-2 py-0.5 rounded-full inline-block mt-0.5">Featured</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-[13px] text-ad-dark">{event.date}</p>
                        <p className="text-[12px] text-ad-gray">{event.time}</p>
                      </td>
                      <td className="px-4 py-3 min-w-[140px]">
                        <div className="flex items-center gap-1 text-[13px] text-ad-gray">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[12px] bg-ad-purple/10 text-ad-purple px-2 py-1 rounded-full whitespace-nowrap">{event.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-[13px] text-ad-dark">
                          <Users className="w-3 h-3 text-ad-gray" />{event.expected_attendees ?? "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${STATUS_STYLE[event.status] ?? ""}`}>{event.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setDetailsEvent(event)}
                            className="p-1.5 text-ad-gray hover:text-ad-purple hover:bg-ad-purple/10 rounded-[6px] transition-colors" title="View details">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-ad-gray hover:text-blue-600 hover:bg-blue-50 rounded-[6px] transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button>
                          <button className="p-1.5 text-ad-gray hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && !loading && (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-[14px] text-ad-gray">
                      {events.length === 0 ? "No events yet. Add your first event!" : "No events match your filters."}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Event modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[560px] overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-ad-border flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-ad-dark">Add New Event</h3>
              <button onClick={() => setAddModalOpen(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-ad-gray" /></button>
            </div>
            <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              {[
                { label: "Event Title *", key: "title", type: "text", placeholder: "Enter event title" },
                { label: "Location *", key: "location", type: "text", placeholder: "Enter event location" },
                { label: "Image URL", key: "image_url", type: "text", placeholder: "https://..." },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-[14px] font-medium text-ad-dark">{label}</label>
                  <input type={type} placeholder={placeholder}
                    value={form[key as keyof typeof form] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="border border-ad-border rounded-[8px] px-3 h-10 text-[14px] outline-none focus:border-ad-purple" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-medium text-ad-dark">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="border border-ad-border rounded-[8px] px-3 h-10 text-[14px] outline-none focus:border-ad-purple" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-medium text-ad-dark">Time *</label>
                  <input type="text" placeholder="e.g., 10:00 AM - 6:00 PM" value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="border border-ad-border rounded-[8px] px-3 h-10 text-[14px] outline-none focus:border-ad-purple" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-medium text-ad-dark">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border border-ad-border rounded-[8px] px-3 h-10 text-[14px] outline-none">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-medium text-ad-dark">Expected Attendees</label>
                  <input type="number" value={form.attendees} onChange={(e) => setForm({ ...form, attendees: e.target.value })}
                    className="border border-ad-border rounded-[8px] px-3 h-10 text-[14px] outline-none focus:border-ad-purple" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[14px] font-medium text-ad-dark">Description</label>
                <textarea placeholder="Enter event description" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className="border border-ad-border rounded-[8px] px-3 py-2 text-[14px] outline-none resize-none focus:border-ad-purple" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] font-medium text-ad-dark">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="border border-ad-border rounded-[8px] px-3 h-10 text-[14px] outline-none">
                    <option>Upcoming</option><option>Past</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <input type="checkbox" id="featured" checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-ad-purple" />
                  <label htmlFor="featured" className="text-[14px] font-medium text-ad-dark">Featured Event</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setAddModalOpen(false)}
                  className="flex-1 h-10 rounded-[8px] border border-ad-border text-[14px] text-ad-gray hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddEvent} disabled={saving || !form.title}
                  className="flex-1 h-10 rounded-[8px] bg-ad-purple text-white text-[14px] hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}{saving ? "Saving…" : "Add Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {attendeesModalEvent && (
        <AttendeesModal event={attendeesModalEvent} onClose={() => setAttendeesModalEvent(null)} />
      )}

      {detailsEvent && (
        <EventDetailsModal
          event={detailsEvent}
          onClose={() => setDetailsEvent(null)}
          onViewAttendees={() => { setAttendeesModalEvent(detailsEvent); setDetailsEvent(null); }}
        />
      )}
    </>
  );
}

function EventDetailsModal({ event, onClose, onViewAttendees }: {
  event: EventItem; onClose: () => void; onViewAttendees: () => void;
}) {
  const STATUS_PILL: Record<string, string> = {
    Upcoming: "bg-green-100 text-green-700",
    Past: "bg-gray-100 text-gray-500",
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] w-full max-w-[620px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 flex items-center justify-between border-b border-ad-border-light shrink-0">
          <h3 className="text-[16px] font-bold text-ad-dark">Event Details</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-ad-gray" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {event.image_url && (
            <div className="relative w-full aspect-video bg-as-card">
              <Image src={event.image_url} alt={event.title} fill className="object-cover" />
            </div>
          )}
          <div className="px-6 py-5 flex flex-col gap-4">
            <h2 className="text-[22px] font-bold text-ad-dark leading-snug">{event.title}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{event.category}</span>
              {event.featured && (
                <span className="flex items-center gap-1 text-[12px] bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
                  <Star className="w-3 h-3 fill-orange-500 stroke-none" />Featured
                </span>
              )}
              <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${STATUS_PILL[event.status] ?? "bg-gray-100 text-gray-600"}`}>{event.status}</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3"><Calendar className="w-4 h-4 text-ad-purple mt-0.5 shrink-0" /><div><p className="text-[12px] text-ad-gray">Date</p><p className="text-[14px] text-ad-dark">{event.date}</p></div></div>
              <div className="flex items-start gap-3"><Clock className="w-4 h-4 text-ad-purple mt-0.5 shrink-0" /><div><p className="text-[12px] text-ad-gray">Time</p><p className="text-[14px] text-ad-dark">{event.time}</p></div></div>
              <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-ad-purple mt-0.5 shrink-0" /><div><p className="text-[12px] text-ad-gray">Location</p><p className="text-[14px] text-ad-dark">{event.location}</p></div></div>
              <div className="flex items-start gap-3"><Users className="w-4 h-4 text-ad-purple mt-0.5 shrink-0" /><div><p className="text-[12px] text-ad-gray">Expected Attendees</p><p className="text-[14px] text-ad-dark">{event.expected_attendees ?? "—"}<span className="text-ad-gray"> people</span></p></div></div>
            </div>
            {event.description && <div><p className="text-[14px] font-bold text-ad-dark mb-1">Description</p><p className="text-[13px] text-ad-gray leading-relaxed">{event.description}</p></div>}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-ad-border-light flex gap-3 shrink-0">
          <button onClick={onClose} className="px-5 h-10 rounded-[8px] border border-ad-border text-[14px] text-ad-gray hover:bg-gray-50 transition-colors">Close</button>
          <button onClick={onViewAttendees} className="flex items-center gap-2 bg-ad-purple text-white text-[14px] font-medium rounded-[8px] px-5 h-10 hover:opacity-90 transition-opacity ml-auto">
            <Pencil className="w-4 h-4" />Edit Event
          </button>
        </div>
      </div>
    </div>
  );
}

function AttendeesModal({ event, onClose }: { event: EventItem; onClose: () => void }) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/admin/events/${event.id}/registrations`);
      const data = await res.json();
      setRegistrations(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, [event.id]);

  const totalAttendees = registrations.reduce((sum, r) => sum + r.attendee_count, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-[16px] w-full max-w-[640px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-5 bg-white border-b border-ad-border flex items-start justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-ad-dark">Event Attendees</h3>
            <p className="text-[14px] text-ad-gray">{event.title}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-ad-gray" /></button>
        </div>
        <div className="px-6 py-4 flex items-center justify-between border-b border-ad-border">
          <div className="flex gap-8">
            <div><p className="text-[12px] text-ad-gray">Total Registrations</p><p className="text-[24px] font-bold text-ad-dark">{registrations.length}</p></div>
            <div><p className="text-[12px] text-ad-gray">Total Attendees</p><p className="text-[24px] font-bold text-ad-dark">{totalAttendees}</p></div>
          </div>
          <button className="flex items-center gap-2 border border-black text-[14px] text-dv-text rounded-full px-4 h-9 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />Export CSV
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-ad-purple" /></div>
          ) : registrations.length === 0 ? (
            <p className="text-center text-[14px] text-ad-gray py-8">No registrations yet.</p>
          ) : registrations.map((r) => (
            <div key={r.id} className="bg-white border border-ad-border-light rounded-[16px] p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-[15px] font-medium text-ad-dark">{r.name ?? "Anonymous"}</p>
                <span className="text-[12px] text-ad-gray bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                  {r.attendee_count} attendee{r.attendee_count > 1 ? "s" : ""}
                </span>
              </div>
              <p className="text-[12px] text-ad-gray">Registered {new Date(r.registered_at).toLocaleDateString()}</p>
              <div className="mt-2 flex flex-col gap-1 text-[13px]">
                {r.email && <div className="flex items-center gap-2 text-ad-gray"><span>✉</span>{r.email}</div>}
                {r.phone && <div className="flex items-center gap-2 text-ad-gray"><span>📞</span>{r.phone}</div>}
                {r.dietary_restrictions && <p className="text-ad-dark">Dietary: <span className="text-ad-gray">{r.dietary_restrictions}</span></p>}
                {r.special_requirements && <p className="text-ad-dark">Special Requirements: <span className="text-ad-gray">{r.special_requirements}</span></p>}
              </div>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 bg-white border-t border-ad-border flex items-center justify-between">
          <p className="text-[12px] text-ad-gray">{event.date} · {event.time} · {event.location}</p>
          <button onClick={onClose} className="border border-black text-[14px] text-dv-text rounded-full px-5 h-9 hover:bg-gray-50 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}
