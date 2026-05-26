import DashboardLayout from "@/components/DashboardLayout";
import MovementForm from "@/components/MovementForm";
import { db } from "@/lib/db";

export default async function MovementsPage() {
  const products = db.prepare("SELECT * FROM Product").all() as any[];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Registrar Movimiento</h1>
      <MovementForm products={products} />
    </DashboardLayout>
  );
}
