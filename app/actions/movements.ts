"use server";

import { db } from "@/lib/db";

export async function addMovement(productId: number, quantity: number, type: "IN" | "OUT") {
  const product = db.prepare("SELECT * FROM Product WHERE id = ?").get(productId) as any;
  if (!product) throw new Error("Product not found");

  if (type === "OUT" && product.stock < quantity) {
    throw new Error("Insufficient stock");
  }

  const newStock = type === "IN" ? product.stock + quantity : product.stock - quantity;
  
  db.prepare("UPDATE Product SET stock = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?").run(newStock, productId);
}
