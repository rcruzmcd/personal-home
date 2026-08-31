import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function DecisionBox({
  decision,
}: {
  decision: { title: string; description: string; tradeoffs: string }
}) {
  return (
    <Alert variant="key-decision">
      <AlertTitle asChild className="text-h4 text-purple">
        <h3>{decision.title}</h3>
      </AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>{decision.description}</p>
        <p className="text-small text-muted">
          <span className="font-medium text-foreground">Tradeoffs: </span>
          {decision.tradeoffs}
        </p>
      </AlertDescription>
    </Alert>
  )
}
