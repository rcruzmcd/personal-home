"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseBudgetGrid } from "@/lib/validations/budget";

// Budgets are read by the dashboard widget and the inbox alerts as well as by
// the budgets page itself, so a save has to invalidate all three or those
// screens keep serving the previous month's picture.
function revalidateBudgetSurfaces() {
  revalidatePath("/budgets");
  revalidatePath("/");
  revalidatePath("/inbox");
  revalidatePath("/forecast");
}

/**
 * Saves the whole budgets grid in one submission.
 *
 * Unlike the sheet-based modules (recurring, income), this does NOT redirect on
 * success: the grid saves in place, so it returns null and lets
 * revalidatePath refresh the figures under the user.
 *
 * user_id is never set here — the column defaults to auth.uid() and RLS scopes
 * the write, the same contract every other action in this app relies on.
 */
export async function saveBudgets(_prevState: string | null, formData: FormData) {
  const parsed = parseBudgetGrid(formData);
  if (typeof parsed === "string") return parsed;

  const { limits, cleared } = parsed;
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();
  const userId = user.user?.id;
  // The upsert has to name user_id explicitly: the (user_id, category_id)
  // conflict target can only match an existing row if the incoming row carries
  // the same user_id, and a column default is not applied in time for that.
  if (!userId) return "You are signed out. Sign in and try again.";

  if (limits.length > 0) {
    const { error } = await supabase.from("budgets").upsert(
      limits.map((limit) => ({
        user_id: userId,
        category_id: limit.category_id,
        amount: limit.amount,
      })),
      { onConflict: "user_id,category_id" },
    );
    if (error) return error.message;
  }

  // A blank input is how the grid says "no limit here", so clearing one is a
  // delete rather than a zero — a $0 budget would report every purchase as an
  // overrun.
  if (cleared.length > 0) {
    const { error } = await supabase.from("budgets").delete().in("category_id", cleared);
    if (error) return error.message;
  }

  revalidateBudgetSurfaces();
  return null;
}
