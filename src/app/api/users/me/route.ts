import { NextResponse } from "next/server";
import { auth } from "@/lib/actions"; 
import { db } from "@/lib/db"; 

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      profileImageUrl,
      name,
      bio,
      age,
      sex,
      occupation,
      preferredLocation,
      communicationStyle,
      socialEnergyLevel,
      ageRange,
      genderPreference,
      accommodationType,
      budget,
      pets,
      habits,
      cooking,
    } = body;

    const updatedUser = await db.user.update({
      where: { email: session.user.email },
      data: {
        image: profileImageUrl,
        name,
        bio,
        profileComplete: true,
        preferences: {
          upsert: {
            create: {
              preferredLocation,
              communicationStyle,
              socialEnergyLevel,
              minAge: ageRange.min,
              maxAge: ageRange.max,
              sex,
              genderPreference,
              occupation,
              hasPets: pets.hasPets,
              petType: pets.type,
              minBudget: budget.min,
              maxBudget: budget.max,
              accommodationType,
              sleepPattern: habits.sleepPattern,
              drinking: habits.drinking,
              smoking: habits.smoking,
              cooking,
            },
            update: {
              preferredLocation,
              communicationStyle,
              socialEnergyLevel,
              minAge: ageRange.min,
              maxAge: ageRange.max,
              sex,
              genderPreference,
              occupation,
              hasPets: pets.hasPets,
              petType: pets.type,
              minBudget: budget.min,
              maxBudget: budget.max,
              accommodationType,
              sleepPattern: habits.sleepPattern,
              drinking: habits.drinking,
              smoking: habits.smoking,
              cooking,
            },
          },
        },
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("PUT /api/users/me error:", error);
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        isPremium: true, // ✅ Make sure this is included
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });

  } catch (err) {
    console.error("GET /api/users/me error:", err);
    return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
  }
}

