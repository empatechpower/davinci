"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Eye, Pencil, Trash2, Palette, ShoppingBag, Users, Plus, ArrowLeft, Loader2 } from "lucide-react";
import type { Artist, Artwork } from "@/lib/db/types";

/* ── shared input ── */
function LabeledInput({ label, type = "text", placeholder, value, onChange, className = "" }: {
  label: string; type?: string; placeholder?: string;
  value: string; onChange: (v: string) => void; className?: string;
}) {
  return (
    <div className={`border border-ad-border rounded-[8px] px-3 pt-2 pb-2 bg-white ${className}`}>
      <p className="text-[12px] font-semibold text-ad-dark mb-0.5">{label}</p>
      <input type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-[13px] text-ad-dark placeholder:text-gray-400 outline-none bg-transparent" />
    </div>
  );
}

/* ── create form ── */
const BLANK = { firstName: "", lastName: "", slug: "", category: "", medium: "", tagline: "", short_bio: "", full_bio: "", photo: null as File | null };

function CreateArtistForm({ onBack, onCreated }: { onBack: () => void; onCreated: () => void }) {
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (key: keyof typeof BLANK) => (v: string) => setForm((p) => ({ ...p, [key]: v }));

  const handleFirstNameChange = (v: string) => {
    setForm((p) => {
      const full = `${v} ${p.lastName}`.trim();
      return { ...p, firstName: v, slug: full.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") };
    });
  };
  const handleLastNameChange = (v: string) => {
    setForm((p) => {
      const full = `${p.firstName} ${v}`.trim();
      return { ...p, lastName: v, slug: full.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") };
    });
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name",      `${form.firstName} ${form.lastName}`.trim());
      fd.append("slug",      form.slug);
      fd.append("category",  form.category);
      fd.append("medium",    form.medium);
      fd.append("tagline",   form.tagline);
      fd.append("short_bio", form.short_bio);
      fd.append("full_bio",  form.full_bio);
      if (form.photo) fd.append("image", form.photo);
      const res = await fetch("/api/admin/artists", { method: "POST", body: fd });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      onCreated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create artist.");
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-[780px]">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="p-1 text-ad-dark hover:text-ad-purple transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h2 className="text-[20px] font-bold text-ad-dark">Create New Artist</h2>
      </div>
      <div className="bg-white border border-ad-border rounded-[16px] p-6 flex flex-col gap-5">
        <section className="flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold text-ad-dark">Basic Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="First Name" placeholder="Enter first name" value={form.firstName} onChange={handleFirstNameChange} />
            <LabeledInput label="Last Name"  placeholder="Enter last name"  value={form.lastName}  onChange={handleLastNameChange}  />
          </div>
          <LabeledInput label="Slug" placeholder="url-slug" value={form.slug} onChange={set("slug")} />
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Category" placeholder="e.g., Painting"    value={form.category} onChange={set("category")} />
            <LabeledInput label="Medium"   placeholder="e.g., Watercolor"  value={form.medium}   onChange={set("medium")}   />
          </div>
          <LabeledInput label="Tagline / Quote" placeholder="Short artist quote" value={form.tagline} onChange={set("tagline")} />
        </section>
        <section className="flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold text-ad-dark">Biography</h3>
          <div className="border border-ad-border rounded-[8px] px-3 pt-2 pb-2 bg-white">
            <p className="text-[12px] font-semibold text-ad-dark mb-0.5">Short Bio</p>
            <textarea placeholder="Brief introduction" value={form.short_bio}
              onChange={(e) => set("short_bio")(e.target.value)}
              rows={3} className="w-full text-[13px] text-ad-dark placeholder:text-gray-400 outline-none bg-transparent resize-none" />
          </div>
          <div className="border border-ad-border rounded-[8px] px-3 pt-2 pb-2 bg-white">
            <p className="text-[12px] font-semibold text-ad-dark mb-0.5">Full Bio</p>
            <textarea placeholder="Full artist story and background" value={form.full_bio}
              onChange={(e) => set("full_bio")(e.target.value)}
              rows={6} className="w-full text-[13px] text-ad-dark placeholder:text-gray-400 outline-none bg-transparent resize-none" />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold text-ad-dark">Profile Image</h3>
          <div className="border border-ad-border rounded-[8px] px-3 pt-2 pb-2 bg-white max-w-[270px]">
            <p className="text-[12px] font-semibold text-ad-dark mb-0.5">Artist Photo</p>
            <input type="file" accept="image/*"
              onChange={(e) => setForm((p) => ({ ...p, photo: e.target.files?.[0] ?? null }))}
              className="w-full text-[12px] text-ad-gray file:mr-3 file:py-1 file:px-2 file:rounded-[4px] file:border file:border-ad-border file:text-[12px] file:bg-gray-50 file:text-ad-gray hover:file:bg-gray-100 cursor-pointer" />
          </div>
        </section>
        {error && <p className="text-[13px] text-red-500">{error}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onBack}
            className="border border-ad-border text-ad-gray text-[14px] rounded-[8px] px-5 h-10 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-ad-purple text-white text-[14px] font-medium rounded-[8px] px-6 h-10 hover:opacity-90 transition-opacity disabled:opacity-60">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Creating…" : "Create New Artist"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ── edit form ── */
function EditArtistForm({ artist, onBack, onSaved }: { artist: Artist; onBack: () => void; onSaved: () => void }) {
  const nameParts = (artist.name ?? "").trim().split(" ");
  const [form, setForm] = useState({
    firstName: nameParts.slice(0, -1).join(" ") || nameParts[0] || "",
    lastName:  nameParts.length > 1 ? nameParts[nameParts.length - 1] : "",
    slug:      artist.slug      ?? "",
    category:  artist.category  ?? "",
    tagline:   artist.tagline   ?? "",
    medium:    artist.medium    ?? "",
    short_bio: artist.short_bio ?? "",
    full_bio:  artist.full_bio  ?? "",
    photo: null as File | null,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const set = (key: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [key]: v }));

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name",      `${form.firstName} ${form.lastName}`.trim());
      fd.append("slug",      form.slug);
      fd.append("category",  form.category);
      fd.append("tagline",   form.tagline);
      fd.append("medium",    form.medium);
      fd.append("short_bio", form.short_bio);
      fd.append("full_bio",  form.full_bio);
      if (form.photo) fd.append("image", form.photo);

      const res = await fetch(`/api/admin/artists/${artist.id}`, { method: "PATCH", body: fd });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      onSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-[780px]">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="p-1 text-ad-dark hover:text-ad-purple transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h2 className="text-[20px] font-bold text-ad-dark">Edit Artist — {artist.name}</h2>
      </div>
      <div className="bg-white border border-ad-border rounded-[16px] p-6 flex flex-col gap-5">
        <section className="flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold text-ad-dark">Basic Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="First Name" placeholder="Enter first name" value={form.firstName} onChange={set("firstName")} />
            <LabeledInput label="Last Name"  placeholder="Enter last name"  value={form.lastName}  onChange={set("lastName")}  />
          </div>
          <LabeledInput label="Slug" placeholder="url-slug" value={form.slug} onChange={set("slug")} />
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Category" placeholder="e.g., Painting"    value={form.category} onChange={set("category")} />
            <LabeledInput label="Medium"   placeholder="e.g., Watercolor"  value={form.medium}   onChange={set("medium")}   />
          </div>
          <LabeledInput label="Tagline / Quote" placeholder="Short artist quote" value={form.tagline} onChange={set("tagline")} />
        </section>
        <section className="flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold text-ad-dark">Biography</h3>
          <div className="border border-ad-border rounded-[8px] px-3 pt-2 pb-2 bg-white">
            <p className="text-[12px] font-semibold text-ad-dark mb-0.5">Short Bio</p>
            <textarea placeholder="Brief introduction" value={form.short_bio}
              onChange={(e) => set("short_bio")(e.target.value)}
              rows={3} className="w-full text-[13px] text-ad-dark placeholder:text-gray-400 outline-none bg-transparent resize-none" />
          </div>
          <div className="border border-ad-border rounded-[8px] px-3 pt-2 pb-2 bg-white">
            <p className="text-[12px] font-semibold text-ad-dark mb-0.5">Full Bio</p>
            <textarea placeholder="Full artist story and background" value={form.full_bio}
              onChange={(e) => set("full_bio")(e.target.value)}
              rows={6} className="w-full text-[13px] text-ad-dark placeholder:text-gray-400 outline-none bg-transparent resize-none" />
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold text-ad-dark">Profile Image</h3>
          {artist.image_url && (
            <div className="w-16 h-16 rounded-full overflow-hidden border border-ad-border">
              <Image src={artist.image_url} alt={artist.name} width={64} height={64} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="border border-ad-border rounded-[8px] px-3 pt-2 pb-2 bg-white max-w-[270px]">
            <p className="text-[12px] font-semibold text-ad-dark mb-0.5">Replace Photo</p>
            <input type="file" accept="image/*"
              onChange={(e) => setForm((p) => ({ ...p, photo: e.target.files?.[0] ?? null }))}
              className="w-full text-[12px] text-ad-gray file:mr-3 file:py-1 file:px-2 file:rounded-[4px] file:border file:border-ad-border file:text-[12px] file:bg-gray-50 file:text-ad-gray hover:file:bg-gray-100 cursor-pointer" />
          </div>
        </section>
        {error && <p className="text-[13px] text-red-500">{error}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onBack}
            className="border border-ad-border text-ad-gray text-[14px] rounded-[8px] px-5 h-10 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-ad-purple text-white text-[14px] font-medium rounded-[8px] px-6 h-10 hover:opacity-90 transition-opacity disabled:opacity-60">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ── main page ── */
export default function AdminArtistsPage() {
  const [artists, setArtists]     = useState<Artist[]>([]);
  const [artworks, setArtworks]   = useState<Artwork[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState<Artist | null>(null);
  const [creating, setCreating]   = useState(false);
  const [editing, setEditing]     = useState<Artist | null>(null);
  const [deleting, setDeleting]   = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [aRes, wRes] = await Promise.all([fetch("/api/admin/artists"), fetch("/api/admin/artworks")]);
    const [a, w] = await Promise.all([aRes.json(), wRes.json()]);
    setArtists(Array.isArray(a) ? a : []);
    setArtworks(Array.isArray(w) ? w : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this artist? This cannot be undone.")) return;
    setDeleting(id);
    await fetch(`/api/admin/artists/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  if (creating) return <CreateArtistForm onBack={() => setCreating(false)} onCreated={() => { setCreating(false); load(); }} />;
  if (editing)  return <EditArtistForm   artist={editing} onBack={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />;

  const filtered = artists.filter((a) =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.category ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Total Artists",  value: artists.length },
    { label: "Total Artworks", value: artworks.length },
    { label: "Total Sold",     value: artists.reduce((s, a) => s + a.sold_count, 0) },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-bold text-ad-dark">Artists Management</h2>
            <p className="text-[12px] text-ad-gray">Manage all artists in the DaVinci community</p>
          </div>
          <button onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-ad-purple text-white text-[14px] font-medium rounded-[8px] px-4 h-10 hover:opacity-90 transition-opacity shrink-0">
            <Plus className="w-4 h-4" /> Create New Artist
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="bg-white border border-ad-border rounded-[16px] px-6 py-5">
              <p className="text-[12px] text-ad-gray font-medium">{label}</p>
              <p className="text-[32px] font-bold text-ad-purple leading-none mt-1">{value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white border border-ad-border rounded-[8px] px-3 h-10 max-w-md">
          <Search className="w-4 h-4 text-ad-gray shrink-0" />
          <input type="text" placeholder="Search by name or category..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-[13px] outline-none text-ad-dark placeholder:text-ad-gray bg-transparent" />
        </div>

        <div className="bg-white border border-ad-border rounded-[16px] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-ad-purple" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f9fafb] border-b border-ad-border-light">
                  <tr>
                    {["Artist", "Category", "Medium", "Artworks", "Sold", "Actions"].map((col) => (
                      <th key={col} className="px-4 py-3 text-left text-[12px] font-semibold text-ad-gray whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((artist) => {
                    const works = artworks.filter((w) => w.artist_id === artist.id);
                    return (
                      <tr key={artist.id} className="border-b border-ad-border-light last:border-none hover:bg-gray-50">
                        <td className="px-4 py-3 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-as-card">
                              {artist.image_url
                                ? <Image src={artist.image_url} alt={artist.name} width={40} height={40} className="w-full h-full object-cover" />
                                : <div className="w-full h-full bg-ad-purple/20 flex items-center justify-center text-ad-purple font-bold">{artist.name[0]}</div>
                              }
                            </div>
                            <div>
                              <p className="text-[13px] font-medium text-ad-dark">{artist.name}</p>
                              <p className="text-[11px] text-ad-gray">{artist.tagline ?? ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12px] bg-ad-purple/10 text-ad-purple px-2 py-1 rounded-full whitespace-nowrap">
                            {artist.category ?? "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-ad-gray">{artist.medium ?? "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-[13px] text-ad-dark">
                            <Palette className="w-3.5 h-3.5 text-ad-gray" />{works.length}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-[13px] text-ad-dark">
                            <ShoppingBag className="w-3.5 h-3.5 text-ad-gray" />{artist.sold_count}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setSelected(artist)}
                              className="p-1.5 text-ad-gray hover:text-ad-purple hover:bg-ad-purple/10 rounded-[6px] transition-colors" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditing(artist)}
                              className="p-1.5 text-ad-gray hover:text-blue-600 hover:bg-blue-50 rounded-[6px] transition-colors" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(artist.id)} disabled={deleting === artist.id}
                              className="p-1.5 text-ad-gray hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-colors disabled:opacity-40" title="Delete">
                              {deleting === artist.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && !loading && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-[14px] text-ad-gray">
                      {artists.length === 0 ? "No artists yet. Add your first artist!" : "No artists match your search."}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] w-full max-w-[560px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="relative h-40 bg-as-card shrink-0">
              {selected.cover_image_url
                ? <Image src={selected.cover_image_url} alt={selected.name} fill className="object-cover" />
                : <div className="w-full h-full bg-ad-purple/10" />}
              <button onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-ad-dark hover:bg-white">✕</button>
            </div>
            <div className="px-6 py-5 flex-1 overflow-y-auto">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md -mt-10 shrink-0 bg-as-card">
                  {selected.image_url
                    ? <Image src={selected.image_url} alt={selected.name} width={64} height={64} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-ad-purple/20 flex items-center justify-center text-ad-purple text-2xl font-bold">{selected.name[0]}</div>
                  }
                </div>
                <div className="pt-1">
                  <h3 className="text-[18px] font-bold text-ad-dark">{selected.name}</h3>
                  <p className="text-[13px] text-ad-gray">{selected.tagline ?? ""}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                <div className="flex items-center gap-1.5 text-[13px] text-ad-gray"><Palette className="w-4 h-4" /><span>{selected.medium ?? "—"}</span></div>
                <div className="flex items-center gap-1.5 text-[13px] text-ad-gray"><ShoppingBag className="w-4 h-4" /><span>{selected.sold_count} sold</span></div>
                <div className="flex items-center gap-1.5 text-[13px] text-ad-gray"><Users className="w-4 h-4" /><span>{artworks.filter((w) => w.artist_id === selected.id).length} artworks</span></div>
              </div>
              <div className="mt-4"><p className="text-[13px] text-ad-gray leading-relaxed">{selected.full_bio ?? "No biography yet."}</p></div>
              {artworks.filter((w) => w.artist_id === selected.id).length > 0 && (
                <div className="mt-4">
                  <p className="text-[13px] font-semibold text-ad-dark mb-2">Artworks</p>
                  <div className="grid grid-cols-3 gap-2">
                    {artworks.filter((w) => w.artist_id === selected.id).map((work) => (
                      <div key={work.id} className="aspect-square rounded-[8px] overflow-hidden bg-as-card">
                        {work.image_url
                          ? <Image src={work.image_url} alt={work.title} width={120} height={120} className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-ad-purple/10 flex items-center justify-center text-ad-purple text-xs">{work.title[0]}</div>
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-ad-border flex gap-3">
              <button onClick={() => setSelected(null)} className="flex-1 h-10 rounded-[8px] border border-ad-border text-[14px] text-ad-gray hover:bg-gray-50">Close</button>
              <button onClick={() => { setSelected(null); setEditing(selected); }}
                className="flex-1 h-10 rounded-[8px] bg-ad-purple text-white text-[14px] hover:opacity-90 transition-opacity">
                Edit Artist
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
