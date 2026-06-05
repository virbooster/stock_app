"use client";
import { useState, useMemo, useTransition } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { ArrowUpDown, Trash2, Search, X, RotateCcw, History } from "lucide-react";
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
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-3">
        <h1 className="text-xl font-bold tracking-tight text-[var(--text-main)]">Productos Archivados</h1>
        <ExportButtons data={sortedProducts} type="archivados" />
      </div>
      
      <div className="card px-4 py-2 mb-3 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={15} />
          <input 
            value={search}
            onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}}
            placeholder="Buscar en archivos..." 
            className="w-full pl-10 pr-10 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded-md text-sm focus:ring-1 focus:ring-[var(--primary)] outline-none" 
          />
          {search && (
            <button onClick={() => {setSearch(""); setCurrentPage(1);}} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-app)] border-b border-[var(--border)]">
                <th className="py-2 px-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] cursor-pointer" onClick={() => requestSort('id')}>
                  <div className="flex items-center gap-1.5">ID <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-2 px-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] cursor-pointer" onClick={() => requestSort('name')}>
                  <div className="flex items-center gap-1.5">Producto <ArrowUpDown size={12} /></div>
                </th>
                <th className="py-2 px-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Descripción</th>
                <th className="py-2 px-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-right">Stock</th>
                <th className="py-2 px-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <tr key={product.id} className="hover:bg-[var(--bg-app)] transition-colors group">
                    <td className="py-2 px-4 text-sm text-[var(--text-muted)]">#{product.id}</td>
                    <td className="py-2 px-4 text-sm font-semibold text-[var(--text-main)]">{product.name}</td>
                    <td className="py-2 px-4 text-sm text-[var(--text-muted)] max-w-xs truncate">{product.description || "-"}</td>
                    <td className="py-2 px-4 text-sm font-bold text-right text-[var(--text-muted)]">{product.stock}</td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/dashboard/products/history/${product.id}`} className="text-[var(--text-muted)] hover:text-purple-600" title="Ver Historial"><History size={16} /></Link>
                        <form action={async () => { await unarchiveProduct(product.id); }} className="inline">
                          <button type="submit" className="text-[var(--text-muted)] hover:text-green-600" title="Desarchivar"><RotateCcw size={16} /></button>
                        </form>
                        <button onClick={() => setProductToDelete(product)} className="text-[var(--text-muted)] hover:text-[var(--accent-danger)]" title="Eliminar"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-sm text-[var(--text-muted)] italic">
                    Sin resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="py-2 px-4 border-t border-[var(--border)] bg-[var(--bg-app)]/50">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
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
                className="px-4 py-2 text-sm font-medium bg-[var(--accent-danger)] text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-colors shadow-sm"
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
