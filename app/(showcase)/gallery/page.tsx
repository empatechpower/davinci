"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Instagram, Loader2, ArrowUp } from "lucide-react";

interface InstagramPost {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

interface Profile {
  username?: string;
  media_count?: number;
  followers_count?: number;
  follows_count?: number;
}

const HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "DaVinciProject";

function formatCount(n?: number): string {
  if (!n) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function PostCard({ post }: { post: InstagramPost }) {
  const src =
    post.media_type === "VIDEO" ? (post.thumbnail_url ?? post.media_url) : post.media_url;

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-[12px] bg-[#f0ece6]"
      style={{ aspectRatio: "1/1" }}
    >
      {src ? (
        <Image
          src={src}
          alt={post.caption?.slice(0, 80) ?? "Instagram post"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Instagram className="w-8 h-8 text-dv-muted/40" />
        </div>
      )}
      {/* hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
        <Instagram className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      {post.media_type === "VIDEO" && (
        <span className="absolute top-2.5 right-2.5 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
          VIDEO
        </span>
      )}
      {post.media_type === "CAROUSEL_ALBUM" && (
        <span className="absolute top-2.5 right-2.5 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
          ALBUM
        </span>
      )}
    </a>
  );
}

export default function GalleryPage() {
  const [posts, setPosts]       = useState<InstagramPost[]>([]);
  const [profile, setProfile]   = useState<Profile>({});
  const [cursor, setCursor]     = useState<string | null>(null);
  const [hasMore, setHasMore]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);

  async function fetchPosts(after?: string) {
    const url = after ? `/api/instagram?after=${after}` : "/api/instagram";
    const res = await fetch(url);

    if (res.status === 503) {
      setNotConfigured(true);
      return;
    }

    const data = await res.json();
    if (data.error) return;

    setPosts((prev) => after ? [...prev, ...data.posts] : data.posts);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);
    if (!after) setProfile(data.profile);
  }

  useEffect(() => {
    fetchPosts().finally(() => setLoading(false));
  }, []);

  async function handleLoadMore() {
    if (!cursor) return;
    setLoadingMore(true);
    await fetchPosts(cursor);
    setLoadingMore(false);
  }

  return (
    <div className="flex flex-col">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: "#f7f2eb" }}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.06]"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1400&q=60)" }}
        />
        <div className="relative max-w-[860px] mx-auto px-4 py-16 sm:py-20 text-center flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-2 border border-dv-accent text-dv-accent text-[13px] px-4 py-1.5 rounded-full">
            <Instagram className="w-3.5 h-3.5 shrink-0" />
            From our Instagram @{HANDLE}
          </span>

          <h1 className="font-serif italic text-dv-accent text-[40px] sm:text-[52px] leading-tight">
            Our Creative Gallery
          </h1>

          <p className="text-[15px] text-dv-muted max-w-[520px] leading-relaxed">
            Explore our journey through inspiring moments, beautiful artwork, and community
            celebrations. Every image tells a story of hope, purpose, and artistic expression.
          </p>

          <a
            href={`https://instagram.com/${HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-dv-accent text-white text-[14px] font-medium px-6 h-10 rounded-full hover:opacity-90 transition-opacity"
          >
            <Instagram className="w-4 h-4" />
            Follow @{HANDLE}
          </a>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      {!notConfigured && !loading && (
        <div className="bg-white border-b border-black/8 py-5">
          <div className="max-w-[860px] mx-auto px-4 flex justify-center gap-10 sm:gap-20">
            {[
              { label: "Posts",     value: profile.media_count ? `${profile.media_count}+` : "—" },
              { label: "Followers", value: formatCount(profile.followers_count) },
              { label: "Following", value: formatCount(profile.follows_count) },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <p className="text-[20px] font-bold text-dv-accent">{value}</p>
                <p className="text-[12px] text-dv-muted uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── POSTS GRID ── */}
      <section className="bg-white py-12">
        <div className="max-w-[860px] mx-auto px-4">

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-7 h-7 animate-spin text-dv-accent" />
            </div>
          ) : notConfigured ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-dv-accent/10 flex items-center justify-center">
                <Instagram className="w-7 h-7 text-dv-accent" />
              </div>
              <p className="text-[18px] font-serif italic text-dv-accent">Instagram not connected</p>
              <p className="text-[14px] text-dv-muted max-w-[340px]">
                Add your <span className="font-semibold">INSTAGRAM_ACCESS_TOKEN</span> to your
                environment variables to display your feed here.
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <p className="text-[32px]">📸</p>
              <p className="text-[16px] font-semibold text-dv-text">No posts yet</p>
              <p className="text-[14px] text-dv-muted">Posts from your Instagram will appear here.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="border border-dv-accent text-dv-accent text-[14px] font-medium px-7 h-10 rounded-full flex items-center gap-2 hover:bg-dv-accent/5 transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Loading…</>
                    ) : (
                      "Load More Posts"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── JOIN OUR COMMUNITY ── */}
      <section style={{ background: "#f7f2eb" }} className="py-16">
        <div className="max-w-[560px] mx-auto px-4 text-center flex flex-col items-center gap-5">
          <span className="text-[12px] uppercase tracking-widest text-dv-muted border border-dv-muted/40 px-4 py-1 rounded-full">
            ✦ Join Our Community
          </span>
          <h2 className="font-serif italic text-dv-accent text-[32px] leading-tight">
            Be Part of Our Creative Journey
          </h2>
          <p className="text-[15px] text-dv-muted leading-relaxed">
            Follow us on Instagram for daily inspiration, behind-the-scenes moments, artist stories,
            and updates on our workshops and exhibitions. Your support helps our artists thrive!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://instagram.com/${HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-dv-accent text-white text-[14px] font-medium px-6 h-10 rounded-full hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-4 h-4" />
              Follow @{HANDLE}
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-2 border border-dv-accent text-dv-accent text-[14px] font-medium px-6 h-10 rounded-full hover:bg-dv-accent/5 transition-colors"
            >
              <ArrowUp className="w-4 h-4" />
              Back to Top
            </button>
          </div>
        </div>
      </section>

      {/* ── ADMIN NOTE (only shown when not configured) ── */}
      {notConfigured && (
        <div className="bg-amber-50 border-t border-amber-200 px-4 py-3">
          <p className="text-[13px] text-amber-800 text-center max-w-[700px] mx-auto">
            <span className="font-semibold">Admin Note:</span> This gallery requires an Instagram access token.
            Add <span className="font-mono bg-amber-100 px-1 rounded">INSTAGRAM_ACCESS_TOKEN</span> and{" "}
            <span className="font-mono bg-amber-100 px-1 rounded">NEXT_PUBLIC_INSTAGRAM_HANDLE</span> to
            your environment variables.{" "}
            <Link href="/admin" className="underline font-medium">Go to Admin Panel →</Link>
          </p>
        </div>
      )}

    </div>
  );
}
