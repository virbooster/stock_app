"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const stock = Number(formData.get("stock"));
  
  const result = db.prepare("INSERT INTO Product (name, description, stock, createdAt, updatedAt) VALUES (?, ?, ?, DATETIME('now', 'localtime'), DATETIME('now', 'localtime'))").run(name, description, stock);
  const productId = Number(result.lastInsertRowid);
  
  // Registrar el alta en el historial
  db.prepare("INSERT INTO Movement (productId, type, quantity, reason, createdAt) VALUES (?, ?, ?, ?, DATETIME('now', 'localtime'))").run(productId, "IN", stock, "Alta de producto");
  
  redirect("/dashboard");
}

export async function editProduct(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const stock = Number(formData.get("stock"));

  // Obtener valores actuales para comparar
  const oldProduct = db.prepare("SELECT * FROM Product WHERE id = ?").get(id) as any;

  // Detectar qué cambió
  let changes = [];
  if (oldProduct.name !== name) changes.push(`Nombre: '${oldProduct.name}' -> '${name}'`);
  if (oldProduct.description !== description) changes.push(`Desc: '${oldProduct.description}' -> '${description}'`);
  if (oldProduct.stock !== stock) changes.push(`Stock: ${oldProduct.stock} -> ${stock}`);

  if (changes.length > 0) {
    const reason = `Edición: ${changes.join('; ')}`;
    db.prepare("UPDATE Product SET name = ?, description = ?, stock = ?, updatedAt = DATETIME('now', 'localtime') WHERE id = ?").run(name, description, stock, id);
    db.prepare("INSERT INTO Movement (productId, type, quantity, reason, createdAt) VALUES (?, ?, ?, ?, DATETIME('now', 'localtime'))").run(id, 'EDIT', stock, reason);
  }
  
  redirect("/dashboard");
}

export async function archiveProduct(id: number) {
  const product = db.prepare("SELECT stock FROM Product WHERE id = ?").get(id) as any;
  db.prepare("UPDATE Product SET isDeleted = 1, updatedAt = DATETIME('now', 'localtime') WHERE id = ?").run(id);
  db.prepare("INSERT INTO Movement (productId, type, quantity, reason, createdAt) VALUES (?, ?, ?, ?, DATETIME('now', 'localtime'))").run(id, 'OUT', product.stock, 'Baja de producto (Archivado) - Stock guardado: ' + product.stock);
  redirect("/dashboard");
}

export async function unarchiveProduct(id: number) {
  const product = db.prepare("SELECT stock FROM Product WHERE id = ?").get(id) as any;
  db.prepare("UPDATE Product SET isDeleted = 0, updatedAt = DATETIME('now', 'localtime') WHERE id = ?").run(id);
  db.prepare("INSERT INTO Movement (productId, type, quantity, reason, createdAt) VALUES (?, ?, ?, ?, DATETIME('now', 'localtime'))").run(id, 'IN', product.stock, 'Desarchivado de producto - Stock recuperado: ' + product.stock);
  redirect("/dashboard/archived");
}

export async function deleteProduct(id: number) {
  db.prepare("DELETE FROM Product WHERE id = ?").run(id);
  redirect("/dashboard");
}
