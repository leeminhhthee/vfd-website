"use client";

import { trans } from "@/app/generated/AppLocalization";
import { ASSETS } from "@/app/generated/assets";
import { ForgotPasswordForm } from "@/components/admin/authentication/forgot-password-form";
import { LoginForm } from "@/components/admin/authentication/login-form";
import { ResetPassword } from "@/components/admin/authentication/reset-password";
import volleyballAnim from "@/public/assets/lottie/volleyball.json";
import Lottie from "lottie-react";
import Image from "next/image";

import { useState } from "react";

type AuthStep = "login" | "forgot" | "reset";

export default function AuthPage() {
  const [step, setStep] = useState<AuthStep>("login");
  const [resetEmail, setResetEmail] = useState("");

  return (
    <main className="min-h-screen bg-linear-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left side: Logo and volleyball image */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-6 p-12 bg-linear-to-br from-primary/5 to-accent/5 border-r border-border">
            {/* Logo */}
            <Image
              src={ASSETS.logo.vfd_logo_text}
              alt="Logo"
              width={256}
              height={384}
            />

            {/* Volleyball image */}
            <div className="w-full max-w-xs relative h-48 flex items-center justify-center overflow-hidden">
              <Lottie
                animationData={volleyballAnim}
                loop
                className="h-full w-full object-contain"
              />
            </div>

            {/* Text content */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-foreground">
                {trans.volleyFederDN}
              </h2>
              <p className="text-xs text-muted-foreground">
                {trans.systemAdminVfd}
              </p>
            </div>
          </div>

          {/* Right side: Login form */}
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-full">
              {/* Mobile header */}
              <div className="lg:hidden text-center mb-8">
                <Image
                  src={ASSETS.logo.vfd_logo_text}
                  className="mx-auto mb-4"
                  alt="Logo"
                  width={152}
                  height={228}
                />
                <h1 className="text-2xl font-bold text-foreground">
                  {trans.volleyballFederation}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {trans.danangCity}
                </p>
              </div>

              {/* Forms */}
              {step === "login" && (
                <LoginForm onForgotPassword={() => setStep("forgot")} />
              )}
              {step === "forgot" && (
                <ForgotPasswordForm
                  onBack={() => setStep("login")}
                  onSubmit={(email) => {
                    setResetEmail(email);
                    setStep("reset");
                  }}
                />
              )}
              {step === "reset" && (
                <ResetPassword
                  email={resetEmail}
                  onBack={() => setStep("login")}
                />
              )}

              {/* Footer */}
              <p className="text-center text-xs text-muted-foreground mt-6">
                {trans.copyRight}&copy;{trans.copyRightAuthor}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
