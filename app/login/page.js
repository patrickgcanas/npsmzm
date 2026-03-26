import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <Image alt="MZM Wealth" height={56} src="/logo-mzm.png" width={56} />
          <div>
            <span className="brand-name">MZM Wealth</span>
            <span className="brand-tag">Área administrativa</span>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
