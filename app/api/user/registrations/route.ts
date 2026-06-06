import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";
import type { EventRegistration, Event } from "@/lib/db/types";

type Row = EventRegistration & Record<string, unknown>;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await query<Row>(
    `SELECT r.*,
            e.id AS ev_id, e.slug AS ev_slug, e.title AS ev_title,
            e.date AS ev_date, e.time AS ev_time, e.location AS ev_location,
            e.category AS ev_category, e.status AS ev_status,
            e.featured AS ev_featured, e.expected_attendees AS ev_expected_attendees,
            e.description AS ev_description, e.long_description AS ev_long_description,
            e.admission AS ev_admission, e.image_url AS ev_image_url,
            e.thumbnail_url AS ev_thumbnail_url, e.created_at AS ev_created_at
     FROM event_registrations r
     JOIN events e ON e.id = r.event_id
     WHERE r.user_id = $1
     ORDER BY r.registered_at DESC`,
    [session.user.id]
  );

  const shaped = rows.map((r) => ({
    ...r,
    events: {
      id: r["ev_id"],
      slug: r["ev_slug"],
      title: r["ev_title"],
      date: r["ev_date"],
      time: r["ev_time"],
      location: r["ev_location"],
      category: r["ev_category"],
      status: r["ev_status"],
      featured: r["ev_featured"],
      expected_attendees: r["ev_expected_attendees"],
      description: r["ev_description"],
      long_description: r["ev_long_description"],
      admission: r["ev_admission"],
      image_url: r["ev_image_url"],
      thumbnail_url: r["ev_thumbnail_url"],
      created_at: r["ev_created_at"],
    } as Event,
  }));

  return NextResponse.json(shaped);
}
