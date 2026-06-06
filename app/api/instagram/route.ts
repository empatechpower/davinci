import { NextRequest, NextResponse } from "next/server";

const MEDIA_FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
const PROFILE_FIELDS = "username,media_count,followers_count,follows_count";

export async function GET(req: NextRequest) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const after = searchParams.get("after") ?? "";

  // Fetch media posts
  const mediaUrl = new URL("https://graph.instagram.com/me/media");
  mediaUrl.searchParams.set("fields", MEDIA_FIELDS);
  mediaUrl.searchParams.set("access_token", token);
  mediaUrl.searchParams.set("limit", "9");
  if (after) mediaUrl.searchParams.set("after", after);

  // Fetch profile info
  const profileUrl = new URL("https://graph.instagram.com/me");
  profileUrl.searchParams.set("fields", PROFILE_FIELDS);
  profileUrl.searchParams.set("access_token", token);

  const [mediaRes, profileRes] = await Promise.all([
    fetch(mediaUrl.toString()),
    fetch(profileUrl.toString()),
  ]);

  if (!mediaRes.ok) {
    const err = await mediaRes.text();
    console.error("[Instagram API] media error:", err);
    return NextResponse.json({ error: "instagram_error" }, { status: 502 });
  }

  const mediaData = await mediaRes.json();
  const profile = profileRes.ok ? await profileRes.json() : {};

  return NextResponse.json({
    posts: mediaData.data ?? [],
    nextCursor: mediaData.paging?.cursors?.after ?? null,
    hasMore: !!mediaData.paging?.next,
    profile,
  });
}
