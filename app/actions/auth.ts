"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (username === "Virginia" && password === "Virginia") {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Upsert equivalent
    const user = db.prepare("SELECT * FROM User WHERE username = ?").get(username) as any;
    
    let userId;
    if (!user) {
      const stmt = db.prepare("INSERT INTO User (username, password) VALUES (?, ?)");
      const info = stmt.run(username, hashedPassword);
      userId = info.lastInsertRowid;
    } else {
      userId = user.id;
    }

    (await cookies()).set("session", userId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    redirect("/dashboard");
  } else {
    redirect("/login?error=Invalid credentials");
  }
}

export async function logout() {
  (await cookies()).delete("session");
  redirect("/login");
}
