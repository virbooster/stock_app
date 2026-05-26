import DashboardLayout from "@/components/DashboardLayout";
import { ExportButtons } from "@/components/ExportButtons";
import { archiveProduct } from "@/app/actions/products";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage(props: { searchParams: Promise<{ search?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.search || "";
  
  const products = db.prepare("SELECT * FROM Product WHERE isDeleted = 0 AND name LIKE ?").all(`%${query}%`) as any[];
...
                <td className="p-3 flex gap-2">
                  <Link href={`/dashboard/products/edit/${product.id}`} className="text-blue-600 hover:underline">Editar</Link>
                  <Link href={`/dashboard/products/history/${product.id}`} className="text-purple-600 hover:underline">Historial</Link>
                  <form action={async () => { "use server"; await archiveProduct(product.id); }}>
                    <button type="submit" className="text-red-600 hover:underline">Archivar</button>
                  </form>
                </td>
