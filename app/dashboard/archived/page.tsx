import DashboardLayout from "@/components/DashboardLayout";
import { db } from "@/lib/db";
import Link from "next/link";
import { unarchiveProduct } from "@/app/actions/products";

export default async function ArchivedPage() {
  const products = db.prepare("SELECT * FROM Product WHERE isDeleted = 1").all() as any[];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Productos Archivados</h1>
      
      <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-2 text-sm">ID</th>
              <th className="p-2 text-sm">Nombre</th>
              <th className="p-2 text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100">
                <td className="p-2 text-sm">{product.id}</td>
                <td className="p-2 text-sm">{product.name}</td>
                <td className="p-2 flex gap-2 items-center">
                  <Link href={`/dashboard/products/history/${product.id}`} className="text-purple-600 hover:underline text-sm">Ver Historial</Link>
                  <form action={async () => { "use server"; await unarchiveProduct(product.id); }}>
                    <button type="submit" className="text-green-600 hover:underline text-sm">Desarchivar</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
