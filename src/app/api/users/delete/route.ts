// src/app/api/users/delete/route.ts

import { db } from "@/lib/db";
import { auth } from "@/lib/actions";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Step 1: Delete notifications
    await db.notification.deleteMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
    });

    // Step 2: Delete messages
    await db.message.deleteMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
    });

    // Step 3: Delete matches
    await db.match.deleteMany({
      where: {
        OR: [
          { userId },
          { matchId: userId },
        ],
      },
    });

    // Step 4: Delete preferences
    await db.preferences.deleteMany({
      where: { userId },
    });

    // Step 5: Delete user
    await db.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ USER DELETE ERROR:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
