"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowUpDown } from "lucide-react";
import { ExportButtons } from "@/components/ExportButtons";
import { archiveProduct, unarchiveProduct } from "@/app/actions/products";

import { Pagination } from "@/components/Pagination";

export default function HistoryPage({ product, movements: initialMovements }: { product: any, movements: any[] }) {
  const [movements, setMovements] = useState(initialMovements);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setMovements([...movements].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return newOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }));
    setCurrentPage(1);
  };

  const filteredMovements = filterType === 'ALL' 
    ? movements 
    : movements.filter(m => m.type === filterType);

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMovements.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);

  // Preparamos los datos para exportar filtrados
  const exportData = filteredMovements.map(m => ({
    Fecha: new Date(m.createdAt).toLocaleString(),
    Tipo: m.type,
    Cantidad: m.quantity,
    Motivo: m.reason
  }));

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Historial de {product.name}</h1>
        <div className="flex gap-2">
          {product.isDeleted === 0 ? (
            <form action={async () => { await archiveProduct(product.id); }}>
              <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">Archivar</button>
            </form>
          ) : (
            <form action={async () => { await unarchiveProduct(product.id); }}>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Desarchivar</button>
            </form>
          )}
          <ExportButtons data={exportData} type={product.name} />
        </div>
      </div>
      
      <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-2 text-sm cursor-pointer flex items-center" onClick={toggleSort}>
                Fecha <ArrowUpDown size={14} className="ml-1" />
              </th>
              <th className="p-2 text-sm">
                <select 
                  className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer text-sm"
                  value={filterType} 
                  onChange={(e) => {setFilterType(e.target.value); setCurrentPage(1);}}
                >
                  <option value="ALL">Tipo</option>
                  <option value="IN">IN</option>
                  <option value="OUT">OUT</option>
                  <option value="EDIT">EDIT</option>
                </select>
              </th>
              <th className="p-2 text-sm">Cantidad</th>
              <th className="p-2 text-sm">Motivo</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((m) => (
              <tr key={m.id} className="border-b border-gray-100">
                <td className="p-2 text-sm">{new Date(m.createdAt).toLocaleString()}</td>
                <td className="p-2 text-sm">
                  <span className={`px-2 py-0.5 rounded text-sm ${m.type === 'IN' ? 'bg-green-100 text-green-800' : m.type === 'EDIT' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                    {m.type}
                  </span>
                </td>
                <td className="p-2 text-sm">{m.quantity}</td>
                <td className="p-2 text-sm">{m.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </DashboardLayout>
  );
}

