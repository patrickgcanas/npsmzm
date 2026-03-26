import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { advisors } from "@/lib/survey";
import { randomBytes } from "crypto";

function generateToken() {
  return randomBytes(20).toString("hex");
}

export async function POST(request) {
  const { rows } = await request.json();

  if (!Array.isArray(rows) || !rows.length) {
    return NextResponse.json({ error: "Nenhuma linha recebida." }, { status: 400 });
  }

  const results = { created: 0, skipped: 0, errors: [] };

  for (const row of rows) {
    const clientName = row.nome?.trim();
    const clientEmail = row.email?.trim() || null;
    const clientCode = row.sigla?.trim() || null;
    const advisor = row.advisor?.trim();
    const relationshipNote = row.contexto?.trim() || null;

    if (!clientName || !advisor) {
      results.errors.push(`Linha ignorada: nome ou advisor ausente (${clientName || "?"}).`);
      results.skipped++;
      continue;
    }

    const normalize = (s) =>
      String(s ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    const matchedAdvisor = advisors.find((a) => normalize(a) === normalize(advisor));

    if (!matchedAdvisor) {
      results.errors.push(`Advisor inválido: "${advisor}" para cliente ${clientName}. Verifique o nome exato.`);
      results.skipped++;
      continue;
    }

    try {
      await prisma.surveyInvite.create({
        data: {
          token: generateToken(),
          clientName,
          clientEmail,
          clientCode,
          advisor: matchedAdvisor,
          relationshipNote,
        },
      });
      results.created++;
    } catch {
      results.errors.push(`Erro ao criar convite para ${clientName}.`);
      results.skipped++;
    }
  }

  return NextResponse.json(results);
}
