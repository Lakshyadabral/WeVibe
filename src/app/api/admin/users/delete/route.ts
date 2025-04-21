// src/app/api/admin/users/delete/route.ts

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    // ✅ Step 1: Delete preferences first (if any)
    await db.preferences.deleteMany({
      where: { userId },
    });

    // ✅ Step 2: Then delete user
    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE USER ERROR:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
