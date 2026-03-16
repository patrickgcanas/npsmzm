"use client";

import { useMemo, useState } from "react";
import { csatQuestions, getEmptySurveyPayload, journeyOptions } from "@/lib/survey";

export function SurveyForm({ clientName, advisor, token, hasResponse = false, preview = false }) {
  const [form, setForm] = useState(getEmptySurveyPayload());
  const [status, setStatus] = useState(hasResponse ? "submitted" : "idle");
  const [error, setError] = useState("");

  const contextPills = useMemo(() => {
    if (preview) {
      return ["Modelo interno", "Sem envio ativo"];
    }

    return [clientName ? `Cliente: ${clientName}` : "", advisor ? `Advisor: ${advisor}` : ""].filter(Boolean);
  }, [advisor, clientName, preview]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!token) {
      return;
    }

    setStatus("pending");
    setError("");

    try {
      const payload = {
        npsScore: Number(form.npsScore),
        journeyStage: form.journeyStage,
        strengths: form.strengths.trim(),
        improvements: form.improvements.trim(),
        otherComments: form.otherComments.trim(),
        csatAnswers: Object.fromEntries(
          csatQuestions.map((question) => [question.id, Number(form[question.id])])
        ),
      };

      const response = await fetch(`/api/responses/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Não foi possível registrar a resposta.");
      }

      setStatus("submitted");
    } catch (submitError) {
      setStatus("idle");
      setError(submitError.message);
    }
  }

  if (status === "submitted") {
    return (
      <div className="success-state">
        <h2>Resposta recebida com sucesso.</h2>
        <p>
          Obrigado por compartilhar sua percepção. O time da MZM Wealth poderá usar esse retorno para elevar ainda
          mais a experiência consultiva.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="survey-context">
        {contextPills.map((pill) => (
          <span className="context-pill" key={pill}>
            {pill}
          </span>
        ))}
      </div>

      <form className="survey-form" onSubmit={handleSubmit}>
        <fieldset className="score-fieldset">
          <legend>1. De 0 a 10, o quanto você recomendaria a MZM Wealth a um amigo ou familiar?</legend>
          <div className="score-grid">
            {Array.from({ length: 11 }, (_, score) => (
              <label className="score-option" key={score}>
                <input
                  checked={String(form.npsScore) === String(score)}
                  name="npsScore"
                  onChange={(event) => updateField("npsScore", event.target.value)}
                  required={!preview}
                  type="radio"
                  value={score}
                />
                <span>{score}</span>
              </label>
            ))}
          </div>
          <div className="score-scale">
            <span>Pouco provável</span>
            <span>Muito provável</span>
          </div>
        </fieldset>

        <section className="csat-block" aria-labelledby="csat-title">
          <div className="csat-header">
            <h2 id="csat-title">Perguntas de satisfação (CSAT)</h2>
            <p>
              Para as perguntas 2 a 12, avalie seu nível de satisfação de 1 a 5, em que 1 = Muito insatisfeito(a) e
              5 = Muito satisfeito(a).
            </p>
          </div>

          <div className="csat-questions">
            {csatQuestions.map((question) => (
              <article className="csat-card" key={question.id}>
                <div className="question-meta">
                  <span className="question-number">{question.number}</span>
                  <span className="pillar-pill">
                    {question.pillar} · {question.pillarLabel}
                  </span>
                </div>
                <p className="question-prompt">{question.prompt}</p>
                <div className="csat-scale" role="radiogroup">
                  {Array.from({ length: 5 }, (_, index) => {
                    const value = String(index + 1);
                    return (
                      <label className="csat-option" key={value}>
                        <input
                          checked={form[question.id] === value}
                          name={question.id}
                          onChange={(event) => updateField(question.id, event.target.value)}
                          required={!preview}
                          type="radio"
                          value={value}
                        />
                        <span>{value}</span>
                      </label>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        <label>
          13. O que você mais valoriza na nossa relação e no nosso trabalho?
          <textarea
            name="strengths"
            onChange={(event) => updateField("strengths", event.target.value)}
            placeholder="Conte brevemente o que mais gera valor na sua experiência com a MZM Wealth."
            rows={4}
            value={form.strengths}
          />
        </label>

        <label>
          14. O que poderíamos melhorar ou fazer de forma diferente?
          <textarea
            name="improvements"
            onChange={(event) => updateField("improvements", event.target.value)}
            placeholder="Se houver algo que possa ser aprimorado, deixe sua sugestão."
            rows={4}
            value={form.improvements}
          />
        </label>

        <label>
          15. Há algo que você gostaria de comentar e que não foi abordado nesta pesquisa?
          <textarea
            name="otherComments"
            onChange={(event) => updateField("otherComments", event.target.value)}
            placeholder="Use este espaço para acrescentar qualquer percepção adicional."
            rows={4}
            value={form.otherComments}
          />
        </label>

        <label>
          Qual é o modelo da sua jornada conosco?
          <select
            name="journeyStage"
            onChange={(event) => updateField("journeyStage", event.target.value)}
            value={form.journeyStage}
          >
            {journeyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {preview ? (
          <div className="survey-preview-note">
            Este bloco mostra o modelo da pesquisa que o cliente irá receber. O envio da resposta fica disponível
            apenas no link individual compartilhado com cada cliente.
          </div>
        ) : (
          <div className="survey-submit-wrap">
            <button className="button button-primary button-full" disabled={status === "pending"} type="submit">
              {status === "pending" ? "Enviando..." : "Enviar resposta"}
            </button>
          </div>
        )}

        {error ? <p className="form-error">{error}</p> : null}
      </form>
    </>
  );
}
