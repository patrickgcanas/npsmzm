"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao autenticar.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>
        E-mail
        <input
          autoComplete="email"
          autoFocus
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          type="email"
          value={email}
        />
      </label>

      <label>
        Senha
        <input
          autoComplete="current-password"
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha de acesso"
          required
          type="password"
          value={password}
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <button className="button button-primary button-full" disabled={loading} type="submit">
        {loading ? "Verificando..." : "Entrar"}
      </button>
    </form>
  );
}
