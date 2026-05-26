import DashboardLayout from "@/components/DashboardLayout";
import ProductForm from "@/components/ProductForm";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = db.prepare("SELECT * FROM Product WHERE id = ?").get(Number(params.id)) as any;
  
  if (!product) notFound();

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Producto</h1>
      <ProductForm product={product} />
    </DashboardLayout>
  );
}
