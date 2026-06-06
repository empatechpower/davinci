"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Pencil, Trash2, Filter, Loader2, Plus, ArrowLeft, X } from "lucide-react";
import type { Artist, Artwork } from "@/lib/db/types";

/* ── shared labeled input ── */
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

/* ── form state type ── */
type ArtworkFormState = {
  title: string; slug: string; artist_id: string;
  category: string; product_type: string; sku: string;
  price: string; dimensions: string;
  description: string; remarks: string;
  photos: File[]; photoPreviews: string[];
  videos: File[]; videoNames: string[];
};

const BLANK: ArtworkFormState = {
  title: "", slug: "", artist_id: "", category: "", product_type: "",
  sku: "", price: "", dimensions: "", description: "", remarks: "",
  photos: [], photoPreviews: [], videos: [], videoNames: [],
};

/* ── create / edit form ── */
function ArtworkForm({
  artwork, initState, artists, onBack, onSaved,
}: {
  artwork?: Artwork; initState?: Partial<ArtworkFormState>;
  artists: Artist[]; onBack: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState<ArtworkFormState>({ ...BLANK, ...initState });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const isEdit        = !!artwork;
  const set = (key: keyof ArtworkFormState) => (v: string) => setForm((p) => ({ ...p, [key]: v }));

  const handleTitleChange = (v: string) => setForm((p) => ({
    ...p, title: v,
    slug: isEdit ? p.slug : v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
  }));

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const previews = arr.map((f) => URL.createObjectURL(f));
    setForm((p) => ({ ...p, photos: [...p.photos, ...arr], photoPreviews: [...p.photoPreviews, ...previews] }));
  };

  const removePhoto = (i: number) => setForm((p) => ({
    ...p,
    photos: p.photos.filter((_, j) => j !== i),
    photoPreviews: p.photoPreviews.filter((_, j) => j !== i),
  }));

  const handleVideos = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setForm((p) => ({
      ...p,
      videos: [...p.videos, ...arr],
      videoNames: [...p.videoNames, ...arr.map((f) => f.name)],
    }));
  };

  const removeVideo = (i: number) => setForm((p) => ({
    ...p,
    videos: p.videos.filter((_, j) => j !== i),
    videoNames: p.videoNames.filter((_, j) => j !== i),
  }));

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title",        form.title);
      fd.append("slug",         form.slug);
      fd.append("artist_id",    form.artist_id);
      fd.append("category",     form.category);
      fd.append("product_type", form.product_type);
      fd.append("sku",          form.sku);
      fd.append("price",        form.price);
      fd.append("dimensions",   form.dimensions);
      fd.append("description",  form.description);
      fd.append("remarks",      form.remarks);
      form.photos.forEach((f) => fd.append("photos", f));
      form.videos.forEach((f) => fd.append("videos", f));

      const url    = isEdit ? `/api/admin/artworks/${artwork!.id}` : "/api/admin/artworks";
      const method = isEdit ? "PATCH" : "POST";
      const res    = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      onSaved();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-[780px]">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="p-1 text-ad-dark hover:text-ad-purple transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-[20px] font-bold text-ad-dark">
          {isEdit ? `Edit — ${artwork!.title}` : "Create New Artwork"}
        </h2>
      </div>

      <div className="bg-white border border-ad-border rounded-[16px] p-6 flex flex-col gap-5">

        {/* Product details */}
        <section className="flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold text-ad-dark">Product Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Title" placeholder="Artwork title" value={form.title} onChange={handleTitleChange} />
            <LabeledInput label="SKU"   placeholder="e.g., DV-001"   value={form.sku}   onChange={set("sku")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Product Category" placeholder="e.g., Postcard"         value={form.category}     onChange={set("category")} />
            <LabeledInput label="Product Type"     placeholder="e.g., A3 Metal Frame"   value={form.product_type} onChange={set("product_type")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <LabeledInput label="Price ($)"   type="number" placeholder="0.00"        value={form.price}      onChange={set("price")} />
            <LabeledInput label="Dimensions"  placeholder="e.g., 30×40 cm"            value={form.dimensions} onChange={set("dimensions")} />
          </div>
          <div className="border border-ad-border rounded-[8px] px-3 pt-2 pb-2 bg-white">
            <p className="text-[12px] font-semibold text-ad-dark mb-0.5">Artist</p>
            <select value={form.artist_id} onChange={(e) => set("artist_id")(e.target.value)}
              className="w-full text-[13px] text-ad-dark outline-none bg-transparent">
              <option value="">Select artist</option>
              {artists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          {/* hidden slug */}
          <LabeledInput label="Slug (URL)" placeholder="auto-generated" value={form.slug} onChange={set("slug")} />
        </section>

        {/* Text content */}
        <section className="flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold text-ad-dark">Content</h3>
          <div className="border border-ad-border rounded-[8px] px-3 pt-2 pb-2 bg-white">
            <p className="text-[12px] font-semibold text-ad-dark mb-0.5">Description</p>
            <textarea placeholder="Enter artwork description" value={form.description}
              onChange={(e) => set("description")(e.target.value)}
              rows={4} className="w-full text-[13px] text-ad-dark placeholder:text-gray-400 outline-none bg-transparent resize-none" />
          </div>
          <div className="border border-ad-border rounded-[8px] px-3 pt-2 pb-2 bg-white">
            <p className="text-[12px] font-semibold text-ad-dark mb-0.5">Remarks</p>
            <textarea placeholder="Additional remarks or notes" value={form.remarks}
              onChange={(e) => set("remarks")(e.target.value)}
              rows={3} className="w-full text-[13px] text-ad-dark placeholder:text-gray-400 outline-none bg-transparent resize-none" />
          </div>
        </section>

        {/* Photos */}
        <section className="flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold text-ad-dark">Photos</h3>

          {/* Existing photos when editing */}
          {isEdit && artwork?.photos && artwork.photos.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-[11px] text-ad-gray">Current photos</p>
              <div className="flex flex-wrap gap-2">
                {artwork.photos.map((url, i) => (
                  <div key={i} className="w-16 h-16 rounded-[6px] overflow-hidden border border-ad-border">
                    <Image src={url} alt={`photo ${i + 1}`} width={64} height={64} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {isEdit && !artwork?.photos && artwork?.image_url && (
            <div className="flex flex-col gap-1">
              <p className="text-[11px] text-ad-gray">Current photo</p>
              <div className="w-16 h-16 rounded-[6px] overflow-hidden border border-ad-border">
                <Image src={artwork.image_url} alt="current" width={64} height={64} className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* New photo previews */}
          {form.photoPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.photoPreviews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-[6px] overflow-hidden border border-ad-border">
                  <Image src={src} alt={`preview ${i + 1}`} fill className="object-cover" />
                  <button type="button" onClick={() => removePhoto(i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => handlePhotos(e.target.files)} />
          <button type="button" onClick={() => photoInputRef.current?.click()}
            className="self-start flex items-center gap-2 border border-ad-border text-[13px] text-ad-gray rounded-[8px] px-4 h-9 hover:bg-gray-50 transition-colors">
            <Plus className="w-4 h-4" />
            {isEdit ? "Add / Replace Photos" : "Upload Photos"}
          </button>
        </section>

        {/* Videos */}
        <section className="flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold text-ad-dark">Videos</h3>

          {/* Existing videos when editing */}
          {isEdit && artwork?.videos && artwork.videos.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-[11px] text-ad-gray">{artwork.videos.length} video(s) already uploaded</p>
            </div>
          )}

          {/* Selected video file names */}
          {form.videoNames.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {form.videoNames.map((name, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 border border-ad-border rounded-[8px] px-3 py-2">
                  <span className="text-[13px] text-ad-dark flex-1 truncate">{name}</span>
                  <button type="button" onClick={() => removeVideo(i)}
                    className="text-ad-gray hover:text-red-500 transition-colors shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <input ref={videoInputRef} type="file" accept="video/*" multiple className="hidden"
            onChange={(e) => handleVideos(e.target.files)} />
          <button type="button" onClick={() => videoInputRef.current?.click()}
            className="self-start flex items-center gap-2 border border-ad-border text-[13px] text-ad-gray rounded-[8px] px-4 h-9 hover:bg-gray-50 transition-colors">
            <Plus className="w-4 h-4" />
            {isEdit ? "Add / Replace Videos" : "Upload Videos"}
          </button>
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
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Artwork"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ── main page ── */
export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists]   = useState<Artist[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All Categories");
  const [selected, setSelected] = useState<Artwork | null>(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing]   = useState<Artwork | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [w, a] = await Promise.all([
      fetch("/api/admin/artworks").then((r) => r.json()),
      fetch("/api/admin/artists").then((r) => r.json()),
    ]);
    setArtworks(Array.isArray(w) ? w : []);
    setArtists(Array.isArray(a) ? a : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this artwork? This cannot be undone.")) return;
    setDeleting(id); setSelected(null);
    await fetch(`/api/admin/artworks/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  if (creating) return (
    <ArtworkForm artists={artists} onBack={() => setCreating(false)} onSaved={() => { setCreating(false); load(); }} />
  );
  if (editing) return (
    <ArtworkForm
      artwork={editing}
      initState={{
        title: editing.title, slug: editing.slug ?? "",
        artist_id: editing.artist_id ?? "", category: editing.category ?? "",
        product_type: editing.product_type ?? "", sku: editing.sku ?? "",
        price: editing.price?.toString() ?? "", dimensions: editing.dimensions ?? "",
        description: editing.description ?? "", remarks: editing.remarks ?? "",
      }}
      artists={artists}
      onBack={() => setEditing(null)}
      onSaved={() => { setEditing(null); load(); }}
    />
  );

  const categories = ["All Categories", ...Array.from(new Set(artworks.map((a) => a.category).filter(Boolean) as string[]))];
  const filtered = artworks.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === "All Categories" || a.category === category;
    return matchSearch && matchCat;
  });

  const stats = [
    { label: "Total Artworks", value: artworks.length },
    { label: "Categories",     value: categories.length - 1 },
    { label: "Artists",        value: artists.length },
  ];

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-bold text-ad-dark">Artworks Management</h2>
            <p className="text-[12px] text-ad-gray">Browse and manage all artworks in the collection</p>
          </div>
          <button onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-ad-purple text-white text-[14px] font-medium rounded-[8px] px-4 h-10 hover:opacity-90 transition-opacity shrink-0">
            <Plus className="w-4 h-4" /> Create New Artwork
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

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 bg-white border border-ad-border rounded-[8px] px-3 h-10 flex-1 max-w-md">
            <Search className="w-4 h-4 text-ad-gray shrink-0" />
            <input type="text" placeholder="Search by title..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-[13px] outline-none text-ad-dark placeholder:text-ad-gray bg-transparent" />
          </div>
          <div className="flex items-center gap-2 bg-white border border-ad-border rounded-[8px] px-3 h-10 min-w-[160px]">
            <Filter className="w-4 h-4 text-ad-gray shrink-0" />
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="flex-1 text-[13px] text-ad-dark outline-none bg-transparent">
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-ad-purple" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[14px] text-ad-gray">
            {artworks.length === 0 ? "No artworks yet. Click \"Create New Artwork\" to add one." : "No artworks match your filters."}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((artwork) => {
              const artist    = artists.find((a) => a.id === artwork.artist_id);
              const thumbUrl  = artwork.photos?.[0] ?? artwork.image_url;
              return (
                <div key={artwork.id}
                  className="bg-white border border-ad-border rounded-[12px] overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setSelected(artwork)}>
                  <div className="aspect-square relative overflow-hidden bg-as-card">
                    {thumbUrl
                      ? <Image src={thumbUrl} alt={artwork.title} fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl text-ad-purple/30 font-light">{artwork.title[0]}</div>
                    }
                    {deleting === artwork.id && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-ad-purple" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[13px] font-medium text-ad-dark truncate">{artwork.title}</p>
                    <p className="text-[11px] text-ad-gray truncate">{artist?.name ?? "Unknown artist"}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[12px] bg-ad-purple/10 text-ad-purple px-2 py-0.5 rounded-full truncate max-w-[100px]">
                        {artwork.product_type || artwork.category || "—"}
                      </span>
                      <span className="text-[13px] font-semibold text-ad-dark">${artwork.price ?? "—"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View / detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-[16px] w-full max-w-[580px] max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Photo strip */}
            <div className="relative aspect-video bg-as-card">
              {(selected.photos?.[0] ?? selected.image_url)
                ? <Image src={selected.photos?.[0] ?? selected.image_url!} alt={selected.title} fill className="object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-6xl text-ad-purple/20">{selected.title[0]}</div>
              }
              <button onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-ad-dark hover:bg-white">✕</button>
            </div>
            {/* Extra photos */}
            {selected.photos && selected.photos.length > 1 && (
              <div className="flex gap-2 px-4 py-2 overflow-x-auto">
                {selected.photos.slice(1).map((url, i) => (
                  <div key={i} className="w-14 h-14 shrink-0 rounded-[6px] overflow-hidden border border-ad-border">
                    <Image src={url} alt={`photo ${i + 2}`} width={56} height={56} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[18px] font-bold text-ad-dark">{selected.title}</h3>
                  <p className="text-[13px] text-ad-gray mt-0.5">by {artists.find((a) => a.id === selected.artist_id)?.name ?? "Unknown"}</p>
                  {selected.sku && <p className="text-[11px] text-ad-gray mt-0.5">SKU: {selected.sku}</p>}
                </div>
                <p className="text-[20px] font-bold text-ad-purple shrink-0">${selected.price ?? "—"}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {selected.category     && <span className="text-[12px] bg-ad-purple/10 text-ad-purple px-2 py-0.5 rounded-full">{selected.category}</span>}
                {selected.product_type && <span className="text-[12px] bg-ad-purple/10 text-ad-purple px-2 py-0.5 rounded-full">{selected.product_type}</span>}
                {selected.dimensions   && <span className="text-[12px] bg-gray-100 text-ad-gray px-2 py-0.5 rounded-full">{selected.dimensions}</span>}
              </div>
              {selected.description && <p className="mt-4 text-[13px] text-ad-gray leading-relaxed">{selected.description}</p>}
              {selected.remarks     && <p className="mt-2 text-[13px] text-ad-gray leading-relaxed italic">{selected.remarks}</p>}
              {selected.videos && selected.videos.length > 0 && (
                <div className="mt-4 flex flex-col gap-3">
                  <p className="text-[12px] font-semibold text-ad-dark">Videos</p>
                  {selected.videos.map((url, i) => (
                    <video key={i} src={url} controls className="w-full rounded-[8px] bg-black" style={{ maxHeight: 260 }}>
                      Your browser does not support the video tag.
                    </video>
                  ))}
                </div>
              )}
              <div className="mt-5 flex gap-3">
                <button onClick={() => setSelected(null)} className="flex-1 h-10 rounded-[8px] border border-ad-border text-[14px] text-ad-gray hover:bg-gray-50">Close</button>
                <button onClick={() => { setSelected(null); setEditing(selected); }}
                  className="flex items-center gap-2 px-4 h-10 rounded-[8px] border border-ad-border text-[14px] text-ad-gray hover:bg-gray-50">
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => handleDelete(selected.id)} disabled={deleting === selected.id}
                  className="flex items-center gap-2 px-4 h-10 rounded-[8px] border border-red-200 text-[14px] text-red-600 hover:bg-red-50 disabled:opacity-40">
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
