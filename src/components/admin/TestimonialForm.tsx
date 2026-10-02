"use client";

import { useActionState, useState } from "react";
import { addTestimonial } from "@/app/admin/_actions/testimonials";
import type { ActionState } from "@/app/admin/_actions/shared";
import { Field, FormMessage, SubmitButton, inputCls } from "@/components/admin/form";

export function TestimonialForm() {
  const [resetKey, setResetKey] = useState(0);
  const [state, action] = useActionState(async (prev: ActionState, data: FormData) => {
    const result = await addTestimonial(prev, data);
    if (result?.ok) setResetKey((k) => k + 1); // clear the form after a successful add
    return result;
  }, null);
  return (
    <form action={action} key={resetKey} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Customer name" name="name" state={state} hint="Ask the customer's permission before publishing.">
          <input name="name" required maxLength={80} className={inputCls} />
        </Field>
        <Field label="What they bought (optional)" name="context" state={state}>
          <input name="context" maxLength={80} placeholder="Bridal blouse" className={inputCls} />
        </Field>
      </div>
      <Field label="Their words" name="quote" state={state}>
        <textarea name="quote" required rows={3} maxLength={600} className={inputCls} />
      </Field>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton>Add testimonial</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
