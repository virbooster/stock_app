import { db } from "@/lib/db";
import DashboardPage from "./client-page";

export default async function Page(props: { searchParams: Promise<{ search?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.search || "";
  
  const products = db.prepare("SELECT * FROM Product WHERE isDeleted = 0 AND name LIKE ?").all(`%${query}%`) as any[];

  return <DashboardPage initialProducts={products} query={query} />;
}
