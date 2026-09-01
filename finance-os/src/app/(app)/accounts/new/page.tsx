import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AccountForm } from "../account-form";
import { createAccount } from "../actions";

export default function NewAccountPage() {
  return (
    <main className="flex-1 flex justify-center px-10 py-16">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Add account</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountForm action={createAccount} submitLabel="Add account" />
        </CardContent>
      </Card>
    </main>
  );
}
