import { db } from "@/lib/db"; // ✅ Use db, not prisma
import { Together } from "together-ai";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

function normalizePreferences(pref: any) {
  return {
    location: pref.preferredLocation,
    budgetMin: pref.minBudget,
    budgetMax: pref.maxBudget,
    ageMin: pref.minAge,
    ageMax: pref.maxAge,
    occupation: pref.occupation,
    smoking: pref.smoking,
    drinking: pref.drinking,
    cooking: pref.cooking,
    genderPreference: pref.genderPreference,
    communicationStyle: pref.communicationStyle,
    socialEnergyLevel: pref.socialEnergyLevel,

  };
}

export async function findMatches(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { preferences: true },
  });

  if (!user || !user.preferences) {
    throw new Error("User or preferences not found");
  }

  const interactions = await db.match.findMany({
    where: {
      OR: [
        { userId },
        { matchId: userId },
      ],
    },
    select: {
      userId: true,
      matchId: true,
    },
  });

  const excludeIds = new Set<string>();
  for (const interaction of interactions) {
    const otherUserId = interaction.userId === userId ? interaction.matchId : interaction.userId;
    excludeIds.add(otherUserId);
  }

  const otherUsers = await db.user.findMany({
    where: {
      id: {
        not: userId,
        notIn: Array.from(excludeIds),
      },
    },
    include: { preferences: true },
  });

  const myPref = normalizePreferences(user.preferences);

  const matches = otherUsers.filter((u) => {
    if (!u.preferences) return false;
    const pref = normalizePreferences(u.preferences);

    let score = 0;
    if (pref.location === myPref.location) score++;
    if (pref.budgetMin <= myPref.budgetMax && pref.budgetMax >= myPref.budgetMin) score++;
    if (pref.occupation === myPref.occupation) score++;
    if (pref.smoking === myPref.smoking) score++;
    if (myPref.genderPreference === "No Preference" || u.sex === myPref.genderPreference) score++;
    if (pref.communicationStyle === myPref.communicationStyle) score++;
    if (pref.socialEnergyLevel === myPref.socialEnergyLevel) score++;
    if (pref.ageMin <= myPref.ageMax && pref.ageMax >= myPref.ageMin) score++;
    if (pref.drinking === myPref.drinking) score++;
    if (
      pref.cooking === myPref.cooking ||
      myPref.cooking === "Flexible" ||
      pref.cooking === "Flexible"
    ) score++;

    return score >= 6;
  });

  const matchNames = matches.map((m) => m.name).join(", ");
  const aiDescription = await getAiMatchDescription(myPref, matchNames);

  return { matches, aiDescription };
}

export async function getMatchDetails(matchId: string) {
  const match = await db.user.findUnique({
    where: { id: matchId },
    include: { preferences: true },
  });

  return match;
}

async function getAiMatchDescription(preferences: any, matchNames: string) {
  try {
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `This is a roommate-matching system. The user is looking for matches with these preferences:
- Location: ${preferences.location}
- Budget: ${preferences.budgetMin} to ${preferences.budgetMax}
- Occupation: ${preferences.occupation}
- Smoking: ${preferences.smoking ? "Yes" : "No"}
- Drinking: ${preferences.drinking ? "Yes" : "No"}
- Cooking: ${preferences.cooking}
- Communication Style: ${preferences.communicationStyle}
- Social Energy Level: ${preferences.socialEnergyLevel}


Based on the data, the following users are good matches: ${matchNames}. Reply with a professional and simple message like:
"Here are the possible matches for you."`,
        },
      ],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    });

    return response.choices?.[0]?.message?.content || "Here are the possible matches for you.";
  } catch (error) {
    console.error("AI Matchmaking Error:", error);
    return "Here are the possible matches for you.";
  }
}
