export const dynamic = "force-dynamic";

export async function GET() {
  const key = process.env.INDEXNOW_KEY || "sociolab-indexnow-key";
  return new Response(key, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}