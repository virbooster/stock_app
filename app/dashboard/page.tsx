import DashboardLayout from "@/components/DashboardLayout";
import { ExportButtons } from "@/components/ExportButtons";
import { archiveProduct } from "@/app/actions/products";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage(props: { searchParams: Promise<{ search?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.search || "";
  
  const products = db.prepare("SELECT * FROM Product WHERE isDeleted = 0 AND name LIKE ?").all(`%${query}%`) as any[];

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/products/add" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Nuevo Producto</Link>
          <ExportButtons data={products} type="stock" />
        </div>
      </div>
      
      <form className="mb-6">
        <input name="search" defaultValue={query} placeholder="Buscar producto..." className="p-2 border rounded w-full max-w-sm" />
      </form>

      <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100">
                <td className="p-3">{product.id}</td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.description}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3 flex gap-2">
                  <Link href={`/dashboard/products/edit/${product.id}`} className="text-blue-600 hover:underline">Editar</Link>
                  <Link href={`/dashboard/products/history/${product.id}`} className="text-purple-600 hover:underline">Historial</Link>
                  <form action={async () => { "use server"; await archiveProduct(product.id); }}>
                    <button type="submit" className="text-red-600 hover:underline">Archivar</button>
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
