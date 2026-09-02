"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingOverlay } from "@/components/loading-overlay";
import { signIn, signInDemo } from "./actions";

export function LoginForm() {
  const [error, formAction, isPending] = useActionState(signIn, null);
  const [demoError, demoFormAction, isDemoPending] = useActionState(signInDemo, null);
  const pending = isPending || isDemoPending;

  return (
    <div className="relative flex flex-col gap-4">
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" disabled={pending}>
          {isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-small text-muted">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>

      <form action={demoFormAction}>
        <Button type="submit" variant="secondary" disabled={pending} className="w-full">
          {isDemoPending ? "Loading demo…" : "Try Demo"}
        </Button>
      </form>

      {(error || demoError) && (
        <Alert variant="callout">
          <AlertDescription>{error ?? demoError}</AlertDescription>
        </Alert>
      )}
      <LoadingOverlay show={pending} />
    </div>
  );
}
