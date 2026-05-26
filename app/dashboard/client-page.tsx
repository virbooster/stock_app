"use client";
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ExportButtons } from "@/components/ExportButtons";
import { archiveProduct } from "@/app/actions/products";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

export default function DashboardPage({ initialProducts, query }: { initialProducts: any[], query: string }) {
  const [products, setProducts] = useState(initialProducts);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const sortedProducts = useMemo(() => {
    let sortableItems = [...products];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [products, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/products/add" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Nuevo Producto</Link>
          <ExportButtons data={sortedProducts} type="stock" />
        </div>
      </div>
      
      <form className="mb-6 relative w-full max-w-sm">
        <input name="search" defaultValue={query} placeholder="Buscar producto..." className="p-2 border rounded w-full text-sm" />
        {query && <a href="/dashboard" className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-800 text-sm">✕</a>}
      </form>

      <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-2 text-sm cursor-pointer" onClick={() => requestSort('id')}>ID <ArrowUpDown size={14} className="inline" /></th>
              <th className="p-2 text-sm cursor-pointer" onClick={() => requestSort('name')}>Nombre <ArrowUpDown size={14} className="inline" /></th>
              <th className="p-2 text-sm">Descripción</th>
              <th className="p-2 text-sm cursor-pointer" onClick={() => requestSort('stock')}>Stock <ArrowUpDown size={14} className="inline" /></th>
              <th className="p-2 text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-100">
                <td className="p-2 text-sm">{product.id}</td>
                <td className="p-2 text-sm">{product.name}</td>
                <td className="p-2 text-sm">{product.description}</td>
                <td className="p-2 text-sm">{product.stock}</td>
                <td className="p-2 flex gap-2 items-center">
                  <Link href={`/dashboard/products/edit/${product.id}`} className="text-blue-600 hover:underline text-sm">Editar</Link>
                  <Link href={`/dashboard/products/history/${product.id}`} className="text-purple-600 hover:underline text-sm">Historial</Link>
                  <form action={async () => { "use server"; await archiveProduct(product.id); }} className="flex items-center">
                    <button type="submit" className="text-red-600 hover:underline text-sm">Archivar</button>
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
