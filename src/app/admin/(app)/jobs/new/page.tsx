import { JobForm } from "@/components/JobForm";

export default function NewJobPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-neutral-900">รับงานใหม่</h1>
      <JobForm />
    </div>
  );
}
