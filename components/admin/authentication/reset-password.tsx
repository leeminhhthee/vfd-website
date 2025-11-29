"use client";

import { useState } from "react";
import { CodeConfirmPassword } from "./code-confirm-password";
import { ResetPasswordForm } from "./reset-password-form";

interface ResetPasswordProps {
  email: string;
  onBack?: () => void;
}

export function ResetPassword({ email, onBack }: ResetPasswordProps) {
  const [step, setStep] = useState<"code" | "reset">("code");

  if (step === "code") {
    return (
      <CodeConfirmPassword
        email={email}
        onSuccess={() => setStep("reset")}
        onBack={onBack}
      />
    );
  }

  return (
    <ResetPasswordForm
      email={email}
      onSuccess={async (password: string) => {
        window.location.href = "/admin";
      }}
      onBack={() => setStep("code")}
    />
  );
}
