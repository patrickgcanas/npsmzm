import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const responses = await prisma.surveyResponse.deleteMany();
    const invites = await prisma.surveyInvite.deleteMany();

    return NextResponse.json({
      ok: true,
      deleted: {
        responses: responses.count,
        invites: invites.count,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
