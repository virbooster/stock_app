"use client";
import { useState, useMemo, useTransition } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { ExportButtons } from "@/components/ExportButtons";
import { unarchiveProduct, deletePermanently } from "@/app/actions/products";
import { Pagination } from "@/components/Pagination";

export default function ArchivedClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [isPending, startTransition] = useTransition();
  const [productToDelete, setProductToDelete] = useState<any>(null);

  const filteredProducts = useMemo(() => {
    const searchLower = search.toLowerCase();
    return products.filter(p => 
      p.id.toString().includes(searchLower) ||
      p.name.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower) ||
      p.stock.toString().includes(searchLower)
    );
  }, [products, search]);

  const sortedProducts = useMemo(() => {
    let sortableItems = [...filteredProducts];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredProducts, sortConfig]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const handleDelete = () => {
    if (!productToDelete) return;
    
    startTransition(async () => {
      await deletePermanently(productToDelete.id);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Productos Archivados</h1>
        <ExportButtons data={sortedProducts} type="archivados" />
      </div>
      
      <form className="mb-6 relative w-full max-w-sm">
        <input 
          value={search}
          onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}}
          placeholder="Buscar producto..." 
          className="p-2 border rounded w-full text-sm" 
        />
        {search && <button type="button" onClick={() => {setSearch(""); setCurrentPage(1);}} className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-800 text-sm">✕</button>}
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
            {currentItems.map((product) => (
              <tr key={product.id} className="border-b border-gray-100">
                <td className="p-2 text-sm">{product.id}</td>
                <td className="p-2 text-sm">{product.name}</td>
                <td className="p-2 text-sm">{product.description}</td>
                <td className="p-2 text-sm">{product.stock}</td>
                <td className="p-2 flex gap-3 items-center">
                  <Link href={`/dashboard/products/history/${product.id}`} className="text-purple-600 hover:underline text-sm">Ver Historial</Link>
                  <form action={async () => { await unarchiveProduct(product.id); }} className="flex items-center">
                    <button type="submit" className="text-green-600 hover:underline text-sm">Desarchivar</button>
                  </form>
                  <button 
                    onClick={() => setProductToDelete(product)}
                    title="esto va a borrar el producto definitivamente de la base de datos"
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm group relative"
                  >
                    <Trash2 size={16} />
                    <span className="hover:underline">Eliminar definitivamente</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* Confirmation Modal */}
      {productToDelete && (
        <div 
          className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => !isPending && setProductToDelete(null)}
        >
          <div 
            className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2 text-gray-800">¿Está seguro que desea eliminar este producto?</h3>
            <p className="text-sm text-gray-600 mb-6">Esta acción borrará el producto <span className="font-semibold text-gray-800">"{productToDelete.name}"</span> y todo su historial de forma permanente. No se puede deshacer.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                disabled={isPending}
              >
                No, cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
                disabled={isPending}
              >
                {isPending ? "Eliminando..." : "Sí, eliminar definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
