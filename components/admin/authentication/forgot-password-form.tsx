"use client";

import { trans } from "@/app/generated/AppLocalization";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authenticationInteractor } from "@/data/datasource/authentication/interactor/authentication.interactor";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSubmit: (email: string) => void;
}

export function ForgotPasswordForm({
  onBack,
  onSubmit,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Simulate API call
      await authenticationInteractor.forgetPassword(email);
      setSubmitted(true);

      setTimeout(() => onSubmit(email), 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(trans.errorOccurred);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle>{trans.emailConfirmationSent}</CardTitle>
        <CardDescription className="text-sm">
          {trans.emailConfirmationSentDescription} {email}.
          {trans.pleaseCheckYourInbox}
        </CardDescription>
        <p className="text-xs text-muted-foreground pt-2">
          {trans.redirectToConfirmationScreen}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors"
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <CardTitle className="text-xl">{trans.forgotPassword}</CardTitle>
          <CardDescription className="mt-1">
            {trans.enterEmailToReset}
          </CardDescription>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="forgot-email"
          className="text-sm font-medium text-foreground block mb-2"
        >
          {trans.email}
        </label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="admin@danang-volleyball.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-accent"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {trans.processing}
          </>
        ) : (
          <>{trans.sendConfirmationEmail}</>
        )}
      </Button>
    </form>
  );
}
