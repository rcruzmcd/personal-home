import type { badgeVariants } from "@/components/ui/badge"
import type { VariantProps } from "class-variance-authority"
import type { ProjectStatus } from "@/lib/content/types"

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

const STATUS_BADGE_VARIANT: Record<ProjectStatus, BadgeVariant> = {
  active: "active",
  experiment: "experiment",
  completed: "completed",
  archived: "archived",
}


export function statusBadgeVariant(status: ProjectStatus): BadgeVariant {
  return STATUS_BADGE_VARIANT[status]
}
