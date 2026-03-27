import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const result = await prisma.surveyInvite.updateMany({
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ ok: true, hidden: result.count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
