// src/app/page.tsx

import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { db } from "@/lib/db";

export default async function RootPage() {
  const session = await auth();

  if (!session || !session.user?.email) {
    redirect("/auth/sign-in");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: { profileComplete: true },
  });


  if (!user) {
    console.log("User not found. Redirecting to onboarding.");
    redirect("/onboarding");
  }

  if (!user.profileComplete) {
    console.log("User exists but profile not complete. Redirecting to onboarding.");
    redirect("/onboarding");
  }

  console.log("User exists and profile is complete. Redirecting to home.");
  redirect("/home");
}
