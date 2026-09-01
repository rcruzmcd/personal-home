import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IncomeSourceForm } from "../income-source-form";
import { createIncomeSource } from "../actions";

export default function NewIncomeSourcePage() {
  return (
    <main className="flex-1 flex justify-center px-10 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add income source</CardTitle>
        </CardHeader>
        <CardContent>
          <IncomeSourceForm action={createIncomeSource} submitLabel="Add income source" />
        </CardContent>
      </Card>
    </main>
  );
}
