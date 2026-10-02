"use client";

import { useActionState, useState } from "react";
import { addInstagramPost, saveInstagramSettings } from "@/app/admin/_actions/instagram";
import type { ActionState } from "@/app/admin/_actions/shared";
import { Field, FormMessage, SubmitButton, Toggle, inputCls } from "@/components/admin/form";
import { SingleImageField } from "@/components/admin/ImageFields";

export function InstagramSettingsForm({ mode, limit, hasToken, isAdmin }: { mode: string; limit: number; hasToken: boolean; isAdmin: boolean }) {
  const [state, action] = useActionState(saveInstagramSettings, null);
  if (!isAdmin) return <p className="text-sm text-muted">Only admins can change the Instagram integration.</p>;
  return (
    <form action={action} className="space-y-4">
      <fieldset className="grid gap-3 sm:grid-cols-3">
        <legend className="mb-1.5 text-sm font-semibold">Source of posts</legend>
        {[
          { v: "api", t: "Instagram API", d: "Latest posts automatically (needs a token)" },
          { v: "manual", t: "Curated", d: "Posts you add below" },
          { v: "off", t: "Off", d: "Only show a “Follow us” button" },
        ].map((o) => (
          <label key={o.v} className="cursor-pointer rounded-xl border border-line bg-white p-3.5 has-[:checked]:border-maroon has-[:checked]:bg-maroon/5">
            <input type="radio" name="instagram_mode" value={o.v} defaultChecked={mode === o.v} className="accent-maroon" />
            <span className="ml-2 text-sm font-semibold">{o.t}</span>
            <span className="mt-1 block text-xs text-muted">{o.d}</span>
          </label>
        ))}
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <Field label="Posts to show" name="instagram_post_limit" state={state}>
          <input type="number" name="instagram_post_limit" min={3} max={24} defaultValue={limit} className={inputCls} />
        </Field>
        <Field label="Long-lived access token" name="access_token" state={state}
          hint={hasToken ? "A token is saved (hidden for security). Paste a new one only to replace it." : "From Meta for Developers → your app → Instagram API with Instagram Login → Generate token."}>
          <input type="password" name="access_token" autoComplete="off" placeholder={hasToken ? "•••••••• saved" : "IGAA…"} className={inputCls} />
        </Field>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton>Save</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}

export function AddInstagramPostForm() {
  const [resetKey, setResetKey] = useState(0);
  const [state, action] = useActionState(async (prev: ActionState, data: FormData) => {
    const result = await addInstagramPost(prev, data);
    if (result?.ok) setResetKey((k) => k + 1); // clear the form after a successful add
    return result;
  }, null);
  return (
    <form action={action} key={resetKey} className="space-y-4">
      <Field label="Instagram post link" name="permalink" state={state} hint="Open the post → ⋯ → Copy link">
        <input type="url" name="permalink" required placeholder="https://www.instagram.com/p/…" className={inputCls} />
      </Field>
      <Field label="Cover image" name="image_url" state={state} hint="Upload the photo from the post (your own content).">
        <SingleImageField name="image_url" initial={null} folder="instagram" aspect="aspect-square" />
      </Field>
      <Field label="Caption (optional)" name="caption" state={state}>
        <input name="caption" maxLength={300} className={inputCls} />
      </Field>
      <Toggle name="is_video" label="This post is a video / reel" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton>Add post</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
