import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import HistoryPage from "./client-page";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const productId = Number(params.id);
  
  const product = db.prepare("SELECT * FROM Product WHERE id = ?").get(productId) as any;
  if (!product) notFound();

  const movements = db.prepare("SELECT * FROM Movement WHERE productId = ? ORDER BY createdAt DESC").all(productId) as any[];

  return <HistoryPage product={product} movements={movements} />;
}
