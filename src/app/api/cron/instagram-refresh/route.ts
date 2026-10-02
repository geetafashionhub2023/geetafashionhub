import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { refreshInstagramToken } from "@/lib/instagram";

// Called daily by the Netlify scheduled function (netlify/functions/instagram-refresh.mts)
// to keep the 60-day Instagram token alive.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const given = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (!secret || given.length !== expected.length || !timingSafeEqual(Buffer.from(given), Buffer.from(expected))) {
    return new Response("Unauthorized", { status: 401 });
  }
  const result = await refreshInstagramToken();
  if (result.ok) revalidateTag("instagram", "max");
  return Response.json(result, { status: result.ok ? 200 : 500 });
}
