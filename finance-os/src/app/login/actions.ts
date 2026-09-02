"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(_prevState: string | null, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return "Enter an email and password.";
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return error.message;
  }

  redirect("/");
}

// prevState/formData are required by useActionState's action signature but
// unused here — the demo credentials come from env vars, not the form.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function signInDemo(_prevState: string | null, _formData: FormData) {
  const email = process.env.DEMO_USER_EMAIL;
  const password = process.env.DEMO_USER_PASSWORD;

  if (!email || !password) {
    return "Demo login is not configured.";
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return error.message;
  }

  redirect("/");
}
