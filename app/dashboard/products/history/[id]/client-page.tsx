"use client";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowUpDown } from "lucide-react";
import { ExportButtons } from "@/components/ExportButtons";

export default function HistoryPage({ product, movements: initialMovements }: { product: any, movements: any[] }) {
  const [movements, setMovements] = useState(initialMovements);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const toggleSort = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setMovements([...movements].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return newOrder === 'asc' ? dateA - dateB : dateB - dateA;
    }));
  };

  // Preparamos los datos para exportar
  const exportData = movements.map(m => ({
    Fecha: new Date(m.createdAt).toLocaleString(),
    Tipo: m.type,
    Cantidad: m.quantity,
    Motivo: m.reason
  }));

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Historial de {product.name}</h1>
        <ExportButtons data={exportData} />
      </div>
      
      <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-3 cursor-pointer flex items-center" onClick={toggleSort}>
                Fecha <ArrowUpDown size={16} className="ml-1" />
              </th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Cantidad</th>
              <th className="p-3">Motivo</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} className="border-b border-gray-100">
                <td className="p-3">{new Date(m.createdAt).toLocaleString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${m.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {m.type}
                  </span>
                </td>
                <td className="p-3">{m.quantity}</td>
                <td className="p-3">{m.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
