import { FormCardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="flex-1 flex justify-center px-10 py-16">
      <FormCardSkeleton rows={5} />
    </main>
  );
}
