// src/app/api/admin/users/delete/route.ts

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    // ✅ 1. Delete notifications (sent or received)
    await db.notification.deleteMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
    });

    // ✅ 2. Delete messages (sent or received)
    await db.message.deleteMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
    });

    // ✅ 3. Delete matches (sent or received)
    await db.match.deleteMany({
      where: {
        OR: [
          { userId },
          { matchId: userId },
        ],
      },
    });

    // ✅ 4. Delete preferences
    await db.preferences.deleteMany({
      where: { userId },
    });

    // ✅ 5. Finally delete the user
    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE USER ERROR:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
