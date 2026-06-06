import { auth } from "./auth";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.email) return false;
  if (!ADMIN_EMAILS.length) return !!session.user; // fallback: any logged-in user
  return ADMIN_EMAILS.includes(session.user.email.toLowerCase());
}
