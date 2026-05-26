"use client";

import { addProduct, editProduct } from "@/app/actions/products";

export default function ProductForm({ product }: { product?: any }) {
  return (
    <form action={product ? editProduct : addProduct} className="bg-white p-6 shadow-sm rounded-lg border border-gray-200 w-full max-w-lg">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input 
        name="name" 
        defaultValue={product?.name} 
        placeholder="Nombre del producto" 
        required 
        className="w-full p-2 mb-4 border rounded border-gray-300" 
      />
      <textarea
        name="description"
        defaultValue={product?.description}
        placeholder="Descripción del producto"
        className="w-full p-2 mb-4 border rounded border-gray-300"
      />
      <input 
        name="stock" 
        type="number" 
        defaultValue={product?.stock ?? 0} 
        placeholder="Stock inicial" 
        required 
        className="w-full p-2 mb-4 border rounded border-gray-300" 
      />
      <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
        {product ? "Guardar Cambios" : "Agregar Producto"}
      </button>
    </form>
  );
}
