import { AdminPanel } from "@/components/admin/AdminPanel";

export default function AdminPage() {
  const expectedPin = process.env.ADMIN_PIN ?? "0000";

  return <AdminPanel expectedPin={expectedPin} />;
}
