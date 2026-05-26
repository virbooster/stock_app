"use client";
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { unarchiveProduct } from "@/app/actions/products";

export default function ArchivedClient({ initialProducts }: { initialProducts: any[] }) {
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Productos Archivados</h1>
      
      <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-2 text-sm cursor-pointer" onClick={() => requestSort('id')}>ID <ArrowUpDown size={14} className="inline" /></th>
              <th className="p-2 text-sm cursor-pointer" onClick={() => requestSort('name')}>Nombre <ArrowUpDown size={14} className="inline" /></th>
              <th className="p-2 text-sm cursor-pointer" onClick={() => requestSort('stock')}>Stock <ArrowUpDown size={14} className="inline" /></th>
              <th className="p-2 text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-100">
                <td className="p-2 text-sm">{product.id}</td>
                <td className="p-2 text-sm">{product.name}</td>
                <td className="p-2 text-sm">{product.stock}</td>
                <td className="p-2 flex gap-2 items-center">
                  <Link href={`/dashboard/products/history/${product.id}`} className="text-purple-600 hover:underline text-sm">Ver Historial</Link>
                  <form action={async () => { await unarchiveProduct(product.id); }} className="flex items-center">
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
