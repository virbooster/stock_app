import DashboardLayout from "@/components/DashboardLayout";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function HistoryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const productId = Number(params.id);
  
  const product = db.prepare("SELECT * FROM Product WHERE id = ?").get(productId) as any;
  if (!product) notFound();

  const movements = db.prepare("SELECT * FROM Movement WHERE productId = ? ORDER BY createdAt DESC").all(productId) as any[];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Historial de {product.name}</h1>
      
      <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-3">Fecha</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Cantidad</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
