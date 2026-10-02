/**
 * Netlify Scheduled Function: once a day, refresh the Instagram long-lived token
 * (tokens expire after 60 days) by calling the protected Next.js route.
 * Needs the CRON_SECRET environment variable. Netlify sets URL automatically.
 */
export default async function instagramRefresh() {
  const secret = process.env.CRON_SECRET;
  const site = process.env.URL;
  if (!secret || !site) {
    console.log("instagram-refresh: CRON_SECRET or URL not set, skipping");
    return new Response("skipped", { status: 200 });
  }
  const res = await fetch(`${site}/api/cron/instagram-refresh`, {
    headers: { authorization: `Bearer ${secret}` },
  });
  console.log("instagram-refresh:", res.status, await res.text());
  return new Response("ok", { status: 200 });
}

export const config = { schedule: "30 2 * * *" };
