// src/app/admin/page.tsx

import { db } from "@/lib/db";
import { auth } from "@/lib/actions";
import { redirect } from "next/navigation";
import DashboardStats from "./_components/DashboardStats";



export default async function AdminDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "Admin") {
    redirect("/auth/sign-in?message=signin_required");
  }

  try {
    const totalUsers = await db.user.count();
    const premiumUsers = await db.user.count({ where: { isPremium: true } });
    const totalMatchRequests = await db.match.count();
    const totalMessages = await db.message.count();

    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <DashboardStats
          stats={{
            totalUsers,
            premiumUsers,
            totalMatchRequests,
            totalMessages,
          }}
        />
      </main>
    );
  } catch (err) {
    console.error("Error in Admin Dashboard:", err);
    return <p>Failed to load admin dashboard data.</p>;
  }
}

