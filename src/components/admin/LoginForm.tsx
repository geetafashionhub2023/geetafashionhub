"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/_actions/auth";
import { Field, FormMessage, SubmitButton, inputCls } from "@/components/admin/form";

export function LoginForm() {
  const [state, action] = useActionState(signIn, null);
  return (
    <form action={action} className="mt-6 space-y-4">
      <Field label="Email">
        <input name="email" type="email" autoComplete="username" required className={inputCls} />
      </Field>
      <Field label="Password">
        <input name="password" type="password" autoComplete="current-password" required minLength={6} className={inputCls} />
      </Field>
      <FormMessage state={state} />
      <SubmitButton className="w-full">Sign in</SubmitButton>
    </form>
  );
}
