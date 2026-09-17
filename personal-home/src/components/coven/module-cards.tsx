import { ScreenshotSlot } from "@/components/coven/screenshot-slot"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type CovenModuleEntry = {
  id: string
  title: string
  body: string
  caption: string
  /** Set once a screenshot exists in /public; until then the slot is reserved. */
  screenshot?: string
}

/**
 * One card per module: screenshot, name, two or three lines. The overview page
 * and both audience pages render the same component over different entries —
 * the modules themselves don't change between audiences, only their names and
 * the order they're argued in, which is the entries' job (see @/lib/coven).
 *
 * Each card carries an id so an audience page can deep-link a module section.
 */
export function ModuleCards({
  modules,
  pendingLabel,
}: {
  modules: readonly CovenModuleEntry[]
  pendingLabel: string
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {modules.map((module) => (
        <Card key={module.id} id={module.id} variant="standard" className="scroll-mt-24">
          <ScreenshotSlot
            src={module.screenshot}
            caption={module.caption}
            pendingLabel={pendingLabel}
            className="mb-4"
          />
          <CardHeader>
            <CardTitle asChild>
              <h3>{module.title}</h3>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{module.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
