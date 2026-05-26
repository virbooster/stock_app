"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const stock = Number(formData.get("stock"));
  db.prepare("INSERT INTO Product (name, description, stock, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)").run(name, description, stock);
  redirect("/dashboard");
}

export async function editProduct(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const stock = Number(formData.get("stock"));
  db.prepare("UPDATE Product SET name = ?, description = ?, stock = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?").run(name, description, stock, id);
  redirect("/dashboard");
}

export async function deleteProduct(id: number) {
  db.prepare("DELETE FROM Product WHERE id = ?").run(id);
  redirect("/dashboard");
}
