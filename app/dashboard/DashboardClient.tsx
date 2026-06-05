"use client";
import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ExportButtons } from "@/components/ExportButtons";
import { archiveProduct } from "@/app/actions/products";
import Link from "next/link";
import { ArrowUpDown, Search, Plus, Edit2, History, Archive, X } from "lucide-react";
import { Pagination } from "@/components/Pagination";

export default function DashboardClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-3">
        <h1 className="text-xl font-bold tracking-tight text-[var(--text-main)]">Dashboard</h1>
        <div className="flex gap-2 items-center">
          <Link 
            href="/dashboard/products/add" 
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--primary)] text-white rounded-md hover:opacity-90 transition-all text-sm font-semibold shadow-sm"
          >
            <Plus size={16} /> Nuevo Producto
          </Link>
          <ExportButtons data={sortedProducts} type="stock" />
        </div>
      </div>
      
      <div className="card px-4 py-2 mb-3 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={15} />
          <input 
            value={search}
            onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}}
            placeholder="Buscar productos..." 
            className="w-full pl-10 pr-10 py-1.5 bg-[var(--bg-app)] border border-[var(--border)] rounded-md text-sm focus:ring-1 focus:ring-[var(--primary)] outline-none" 
          />
          {search && (
            <button onClick={() => {setSearch(""); setCurrentPage(1);}} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              <X size={14} />
            </button>
          )}
        </div>
        <p className="text-[var(--text-muted)] text-[11px] uppercase font-bold tracking-wider hidden sm:block">
          Total: {filteredProducts.length} productos
        </p>
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
                <th className="py-2 px-4 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] cursor-pointer text-right" onClick={() => requestSort('stock')}>
                  <div className="flex items-center justify-end gap-1.5">Stock <ArrowUpDown size={12} /></div>
                </th>
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
                    <td className="py-2 px-4 text-sm font-bold text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/dashboard/products/edit/${product.id}`} className="text-[var(--text-muted)] hover:text-[var(--primary)]" title="Editar"><Edit2 size={16} /></Link>
                        <Link href={`/dashboard/products/history/${product.id}`} className="text-[var(--text-muted)] hover:text-purple-600" title="Historial"><History size={16} /></Link>
                        <form action={async () => { await archiveProduct(product.id); }} className="inline">
                          <button type="submit" className="text-[var(--text-muted)] hover:text-[var(--accent-danger)]" title="Archivar"><Archive size={16} /></button>
                        </form>
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
    </DashboardLayout>
  );
}
