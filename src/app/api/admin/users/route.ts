import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/actions";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isPremium: true,
    },
  });

  return NextResponse.json(users);
}
