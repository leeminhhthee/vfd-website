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
  const [resetToken, setResetToken] = useState<string | null>(null);

  if (step === "code") {
    return (
      <CodeConfirmPassword
        email={email}
        onSuccess={(token) => {
          setResetToken(token);
          setStep("reset");
        }}
        onBack={onBack}
      />
    );
  }

  return (
    <ResetPasswordForm
      resetToken={resetToken!}
      onSuccess={() => {
        window.location.href = "/login";
      }}
      onBack={() => setStep("code")}
    />
  );
}
