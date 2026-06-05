"use server";

import { db } from "@/lib/db";

export async function addMovement(productId: number, quantity: number, type: "IN" | "OUT", reason: string) {
  const product = db.prepare("SELECT * FROM Product WHERE id = ?").get(productId) as any;
  if (!product) throw new Error("Product not found");

  if (type === "OUT" && product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  const newStock = type === "IN" ? product.stock + quantity : product.stock - quantity;
  
  db.prepare("UPDATE Product SET stock = ?, updatedAt = DATETIME('now', 'localtime') WHERE id = ?").run(newStock, productId);
  
  // Registrar el movimiento en el historial
  db.prepare("INSERT INTO Movement (productId, type, quantity, reason, createdAt) VALUES (?, ?, ?, ?, DATETIME('now', 'localtime'))").run(productId, type, quantity, reason);
}
