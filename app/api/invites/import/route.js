import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { advisors } from "@/lib/survey";
import { randomBytes } from "crypto";

function generateToken() {
  return randomBytes(20).toString("hex");
}

function normalize(s) {
  return String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

// Aceita ISO, DD/MM/YYYY e MM/DD/YYYY
function parseDate(str) {
  if (!str) return null;
  const s = String(str).trim();
  const br = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (br) {
    const d = new Date(`${br[3]}-${br[2].padStart(2, "0")}-${br[1].padStart(2, "0")}`);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
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
    const contractDate = parseDate(row.contractDate);

    if (!clientName || !advisor) {
      results.errors.push(`Linha ignorada: nome ou advisor ausente (${clientName || "?"}).`);
      results.skipped++;
      continue;
    }

    // Tenta match exato primeiro, depois match por palavras (tolera nomes completos do Salesforce)
    const matchedAdvisor =
      advisors.find((a) => normalize(a) === normalize(advisor)) ||
      advisors.find((a) => normalize(a).split(" ").every((w) => normalize(advisor).includes(w)));

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
          contractDate,
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
