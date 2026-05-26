import { db } from "@/lib/db";
import ArchivedClient from "./ArchivedClient";

export default async function ArchivedPage() {
  const products = db.prepare("SELECT * FROM Product WHERE isDeleted = 1").all() as any[];

  return <ArchivedClient initialProducts={products} />;
}
