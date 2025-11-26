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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary mb-4">
                  <svg
                    className="w-8 h-8 text-primary-foreground"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
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
