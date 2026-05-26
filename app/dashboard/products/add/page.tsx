import DashboardLayout from "@/components/DashboardLayout";
import ProductForm from "@/components/ProductForm";

export default function AddProductPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Agregar Producto</h1>
      <ProductForm />
    </DashboardLayout>
  );
}
