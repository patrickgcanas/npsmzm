import "@/app/globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata = {
  title: "MZM Wealth | Client Experience",
  description:
    "Plataforma da pesquisa de satisfação da MZM Wealth com links dinâmicos, coleta de respostas e dashboard executivo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
