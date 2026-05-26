"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const stock = Number(formData.get("stock"));
  
  const result = db.prepare("INSERT INTO Product (name, description, stock, updatedAt) VALUES (?, ?, ?, CURRENT_TIMESTAMP)").run(name, description, stock);
  const productId = Number(result.lastInsertRowid);
  
  // Registrar el alta en el historial
  db.prepare("INSERT INTO Movement (productId, type, quantity, reason) VALUES (?, ?, ?, ?)").run(productId, "IN", stock, "Alta de producto");
  
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

export async function archiveProduct(id: number) {
  db.prepare("UPDATE Product SET isDeleted = 1, updatedAt = CURRENT_TIMESTAMP WHERE id = ?").run(id);
  db.prepare("INSERT INTO Movement (productId, type, quantity, reason) VALUES (?, ?, ?, ?)").run(id, 'OUT', 0, 'Baja de producto');
  redirect("/dashboard");
}

export async function unarchiveProduct(id: number) {
  db.prepare("UPDATE Product SET isDeleted = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ?").run(id);
  db.prepare("INSERT INTO Movement (productId, type, quantity, reason) VALUES (?, ?, ?, ?)").run(id, 'IN', 0, 'Desarchivado de producto');
  redirect("/dashboard/archived");
}

export async function deleteProduct(id: number) {
  db.prepare("DELETE FROM Product WHERE id = ?").run(id);
  redirect("/dashboard");
}
