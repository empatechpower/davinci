import Image from "next/image";
import Link from "next/link";
import { Palette, Heart, Users, Target } from "lucide-react";
import DavinciLogo from "@/components/layout/DavinciLogo";

const VALUES = [
  {
    icon: Heart,
    title: "Compassion",
    description:
      "We lead with empathy and understanding, creating a safe space for all artists to thrive.",
    bg: "#fff0eb",
    iconColor: "#ff8c42",
  },
  {
    icon: Users,
    title: "Inclusion",
    description:
      "Every artist's voice matters. We celebrate diversity and ensure everyone feels valued.",
    bg: "#ffffff",
    iconColor: "#ff8c42",
  },
  {
    icon: Target,
    title: "Empowerment",
    description:
      "We provide tools, support, and opportunities for artists to reach their full potential.",
    bg: "#e8f5f3",
    iconColor: "#2a9d8f",
  },
];

const STATS = [
  { value: "25+", label: "Artists Supported", bg: "#fff0eb", color: "#ff8c42" },
  { value: "500+", label: "Artworks Created", bg: "#fdf6ec", color: "#ff8c42" },
  { value: "1,200+", label: "Happy Customers", bg: "#e8f5f3", color: "#2a9d8f" },
  { value: "$50K+", label: "Paid to Artists", bg: "#fff0eb", color: "#ff8c42" },
];

const STORY_PARAGRAPHS = [
  "DaVinci Project was born from a simple yet powerful observation: artistic expression knows no boundaries. In 2020, a small group of educators and art therapists noticed the incredible talents of special-needs individuals who had limited opportunities to share their work with the world.",
  "What started as weekend art sessions in a community center has grown into a thriving organization supporting over 25 artists. We've created a space where creativity flourishes, confidence builds, and dreams become reality.",
  "Today, our artists' works are displayed in homes across the country, each piece carrying not just beauty, but a story of perseverance, joy, and hope.",
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">

      {/* ══ HERO ══ */}
      <section
        className="py-20 text-center"
        style={{
          background:
            "linear-gradient(180deg, #f7f2eb 0%, #fdf9f5 60%, #ffffff 100%)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 flex flex-col items-center gap-5">
          <Palette className="w-12 h-12 text-dv-accent" />
          <h1 className="font-serif italic text-dv-accent text-[44px] sm:text-[56px] leading-tight">
            About DaVinci Project
          </h1>
          <p className="text-[17px] text-dv-muted max-w-[520px] leading-relaxed">
            A compassionate community where art becomes a bridge to hope,
            purpose, and empowerment for artists with special needs.
          </p>
        </div>
      </section>

      {/* ══ OUR MISSION ══ */}
      <section className="bg-white py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Text */}
            <div>
              <h2 className="font-serif italic text-dv-accent text-[36px] mb-6">
                Our Mission
              </h2>
              <div className="flex flex-col gap-4 text-[16px] text-dv-muted leading-relaxed">
                <p>
                  At DaVinci Project, we believe that everyone deserves the
                  opportunity to express themselves and find their purpose. Our
                  mission is to empower artists with special needs by providing
                  them with a platform to share their incredible talents with
                  the world.
                </p>
                <p>
                  Through art, we help our artists build confidence, develop
                  new skills, and create meaningful connections. Every
                  brushstroke, every sculpture, every creation is a testament
                  to their resilience and creativity.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative rounded-[20px] overflow-hidden aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=900&q=80"
                alt="Artist at work"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ VALUES ══ */}
      <section className="bg-white pb-20">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, description, bg, iconColor }) => (
              <div
                key={title}
                className="rounded-[20px] p-8 flex flex-col items-center text-center gap-4 border border-black/5"
                style={{ background: bg }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: `${iconColor}18` }}
                >
                  <Icon className="w-7 h-7" style={{ color: iconColor }} />
                </div>
                <h3 className="text-[17px] font-semibold text-dv-text">{title}</h3>
                <p className="text-[14px] text-dv-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR STORY ══ */}
      <section className="bg-white py-20 border-t border-black/5">
        <div className="max-w-[720px] mx-auto px-4 text-center">
          <h2 className="font-serif italic text-dv-accent text-[36px] mb-8">
            Our Story
          </h2>
          <div className="flex flex-col gap-5 text-[16px] text-dv-muted leading-relaxed">
            {STORY_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR IMPACT ══ */}
      <section className="bg-white py-20 border-t border-black/5">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif italic text-dv-accent text-[36px] mb-3">
              Our Impact
            </h2>
            <p className="text-[16px] text-dv-muted">
              Transparency and fairness are at the heart of everything we do.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map(({ value, label, bg, color }) => (
              <div
                key={label}
                className="rounded-[20px] py-10 px-6 flex flex-col items-center gap-2 text-center"
                style={{ background: bg }}
              >
                <p
                  className="font-serif text-[38px] font-bold leading-none"
                  style={{ color }}
                >
                  {value}
                </p>
                <p className="text-[14px] text-dv-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ OUR PARTNERS ══ */}
      <section className="bg-white py-20 border-t border-black/5">
        <div className="max-w-[1280px] mx-auto px-4 text-center">
          <h2 className="font-serif italic text-dv-accent text-[36px] mb-2">
            Our Partners
          </h2>
          <p className="text-[15px] text-dv-muted mb-10">
            To the people that believed in this movement.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <DavinciLogo />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DOWNLOAD E-CATALOG ══ */}
      <section
        className="relative py-24 overflow-hidden"
        style={{ background: "#1a1a1a" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=1400&q=60)",
          }}
        />
        <div className="relative max-w-[1280px] mx-auto px-4 flex flex-col items-center text-center gap-6">
          <h2 className="font-serif italic text-dv-accent text-[38px] sm:text-[48px] leading-tight">
            Download E-Catalog
          </h2>
          <p className="text-[16px] text-white/60 max-w-[400px] leading-relaxed">
            Browse our full collection of available artworks in our downloadable
            catalog.
          </p>
          <a
            href="#"
            className="bg-dv-accent text-white text-[15px] font-medium px-10 h-12 rounded-full flex items-center hover:opacity-90 transition-opacity"
          >
            Download
          </a>
        </div>
      </section>

      {/* ══ OUR CREATIVE COMMUNITY ══ */}
      <section className="py-20" style={{ background: "#f7f2eb" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-serif italic text-dv-accent text-[36px] mb-3">
              Our Creative Community
            </h2>
            <p className="text-[16px] text-dv-muted">
              See the joy and passion that fills our studio every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative rounded-[20px] overflow-hidden aspect-[4/3] flex items-center justify-center" style={{ background: "#ede8e0" }}>
              <div className="flex flex-col items-center gap-2 text-center px-6">
                <Palette className="w-10 h-10" style={{ color: "#c9b89a" }} />
                <p className="text-[14px]" style={{ color: "#a09080" }}>Community art session photo</p>
              </div>
            </div>
            <div className="relative rounded-[20px] overflow-hidden aspect-[4/3] flex items-center justify-center" style={{ background: "#ede8e0" }}>
              <div className="flex flex-col items-center gap-2 text-center px-6">
                <Users className="w-10 h-10" style={{ color: "#c9b89a" }} />
                <p className="text-[14px]" style={{ color: "#a09080" }}>Artists collaborating photo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ JOIN US CTA ══ */}
      <section className="bg-white py-24">
        <div className="max-w-[640px] mx-auto px-4 text-center flex flex-col items-center gap-6">
          <h2 className="font-serif italic text-dv-accent text-[38px] sm:text-[44px] leading-tight">
            Join Us in Making a Difference
          </h2>
          <p className="text-[16px] text-dv-muted leading-relaxed">
            Whether you purchase art, attend an event, or simply spread the
            word, you&apos;re helping create opportunities for talented artists
            to thrive. Together, we can build a more inclusive and
            compassionate world.
          </p>
          <Link
            href="/shop"
            className="bg-dv-accent text-white text-[15px] font-medium px-10 h-12 rounded-full flex items-center hover:opacity-90 transition-opacity"
          >
            Shop Artworks
          </Link>
        </div>
      </section>

    </div>
  );
}
