import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const result = await prisma.surveyInvite.deleteMany({
      where: {
        response: { is: null },
      },
    });

    return NextResponse.json({ deleted: result.count });
  } catch (error) {
    return NextResponse.json({ error: "Não foi possível limpar os registros." }, { status: 500 });
  }
}
