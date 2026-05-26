import { db } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const products = db.prepare("SELECT * FROM Product WHERE isDeleted = 0").all() as any[];

  return <DashboardClient initialProducts={products} />;
}
