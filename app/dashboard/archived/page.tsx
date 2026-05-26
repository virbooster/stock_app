import DashboardLayout from "@/components/DashboardLayout";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function ArchivedPage() {
  const products = db.prepare("SELECT * FROM Product WHERE isDeleted = 1").all() as any[];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Productos Archivados</h1>
      
      <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100">
                <td className="p-3">{product.id}</td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">
                  <Link href={`/dashboard/products/history/${product.id}`} className="text-purple-600 hover:underline">Ver Historial</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
