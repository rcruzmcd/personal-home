import Image from "next/image"

import { cn } from "@/lib/utils"

/**
 * A reserved place for a product screenshot. No Coven screenshots exist in this
 * repo yet, so a slot with no `src` renders a framed placeholder carrying the
 * caption rather than a broken image or a gap — the page reads as finished
 * either way, and dropping a file into /public turns a slot into a real image
 * with one prop.
 *
 * `caption` doubles as the image's alt text. One string per slot per locale is
 * deliberate: a separate alt would be a second thing to translate and the first
 * thing to go stale.
 */
export function ScreenshotSlot({
  src,
  caption,
  pendingLabel,
  className,
}: {
  src?: string
  caption: string
  pendingLabel: string
  className?: string
}) {
  return (
    <figure className={cn("space-y-2", className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-surface">
        {src ? (
          <Image src={src} alt={caption} fill className="object-cover object-top" />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed border-border p-4"
          >
            <span className="text-label font-medium uppercase text-muted">
              {pendingLabel}
            </span>
          </div>
        )}
      </div>
      <figcaption className="text-small text-muted">{caption}</figcaption>
    </figure>
  )
}
