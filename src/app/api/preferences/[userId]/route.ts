import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const preferences = await db.preferences.findUnique({
      where: { userId: params.userId },
    });

    if (!preferences) return NextResponse.json({ error: "Preferences not found" }, { status: 404 });

    return NextResponse.json(preferences, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { userId: string } }) {
  try {
    const body = await req.json();
    const updatedPreferences = await db.preferences.upsert({
      where: { userId: params.userId },
      update: body,
      create: { userId: params.userId, ...body },
    });

    return NextResponse.json(updatedPreferences, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  try {
    const body = await req.json();

    const updateData: Record<string, any> = {};
    if (body.communicationStyle) updateData.communicationStyle = body.communicationStyle;
    if (body.socialEnergyLevel) updateData.socialEnergyLevel = body.socialEnergyLevel;
    if (body.minAge) updateData.minAge = body.minAge;
    if (body.maxAge) updateData.maxAge = body.maxAge;
    if (body.genderPreference) updateData.genderPreference = body.genderPreference;
    if (body.occupation) updateData.occupation = body.occupation;
    if (body.preferredLocation) updateData.preferredLocation = body.preferredLocation;
    if (body.hasPets !== undefined) updateData.hasPets = body.hasPets;
    if (body.petType) updateData.petType = body.petType;
    if (body.minBudget) updateData.minBudget = body.minBudget;
    if (body.maxBudget) updateData.maxBudget = body.maxBudget;
    if (body.accommodationType) updateData.accommodationType = body.accommodationType;
    if (body.sleepPattern) updateData.sleepPattern = body.sleepPattern;
    if (body.drinking !== undefined) updateData.drinking = body.drinking;
    if (body.smoking !== undefined) updateData.smoking = body.smoking;
    if (body.cooking) updateData.cooking = body.cooking;

    const updatedPreferences = await db.preferences.update({
      where: { userId: params.userId },
      data: updateData,
    });

    return NextResponse.json(updatedPreferences, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error', details: error }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { userId: string } }) {
  try {
    await db.preferences.delete({ where: { userId: params.userId } });
    return NextResponse.json({ message: "Preferences deleted" }, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 });
  }
}
