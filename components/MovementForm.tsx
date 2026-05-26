"use client";
import { addMovement } from "@/app/actions/movements";
import { useActionState } from "react";

export default function MovementForm({ products }: { products: any[] }) {
  const [state, action] = useActionState(async (prevState: any, formData: FormData) => {
    try {
        await addMovement(
        Number(formData.get("productId")),
        Number(formData.get("quantity")),
        formData.get("type") as "IN" | "OUT",
        formData.get("reason") as string
      );
      return { success: true, message: "Movimiento registrado con éxito" };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  }, { success: null, message: "" });

  return (
    <form action={action} className="bg-white p-4 shadow-sm rounded-lg border border-gray-200 w-full max-w-sm">
      {state.message && (
        <div className={`p-2 mb-3 rounded text-sm ${state.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {state.message}
        </div>
      )}
      <select name="productId" required className="w-full p-1.5 mb-3 border rounded border-gray-300 text-sm">
        <option value="">Seleccionar Producto</option>
        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <input name="quantity" type="number" min="1" placeholder="Cantidad" required className="w-full p-1.5 mb-3 border rounded border-gray-300 text-sm" />
      <select name="type" required className="w-full p-1.5 mb-3 border rounded border-gray-300 text-sm">
        <option value="IN">Entrada</option>
        <option value="OUT">Salida</option>
      </select>
      <input name="reason" placeholder="Motivo" required className="w-full p-1.5 mb-4 border rounded border-gray-300 text-sm" />
      <button type="submit" className="w-full p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm">Registrar Movimiento</button>
    </form>
  );

}
