import { NextResponse } from "next/server";

export async function GET() {
  const checks = {
    supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_CHAT_MODEL),
    googleDrive: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI)
  };

  return NextResponse.json({
    app: "pure-honest-rd",
    status: "setup",
    integrations: checks,
    note: "This endpoint reports configuration presence only and never returns secret values."
  });
}