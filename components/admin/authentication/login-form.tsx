"use client";

import { trans } from "@/app/generated/AppLocalization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authenticationInteractor } from "@/data/datasource/authentication/interactor/authentication.interactor";
import axios from "axios";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

interface LoginFormProps {
  onForgotPassword: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await authenticationInteractor.login({ email, password });

      // ✅ accessToken: phụ thuộc rememberMe
      if (rememberMe) {
        localStorage.setItem("accessToken", response.accessToken);
      } else {
        sessionStorage.setItem("accessToken", response.accessToken);
      }

      // ✅ refreshToken: luôn nên lưu lâu dài
      localStorage.setItem("refreshToken", response.refreshToken);

      // ✅ user: có thể lưu lâu dài
      localStorage.setItem("user", JSON.stringify(response.user));


      if (response.user.admin) {
        router.push("/admin");
      } else {
        router.push("/"); // redirect user
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || trans.loginFailed);
      } else {
        setError(trans.errorOccurred);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground">{trans.login}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {trans.accessAdminDashboard}
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm flex items-start gap-3">
          <div className="mt-0.5">⚠️</div>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="text-sm font-semibold text-foreground block mb-2"
          >
            {trans.email}
          </label>
          <Input
            id="email"
            type="email"
            placeholder="admin@danang-volleyball.vn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            className="h-11"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-semibold text-foreground block mb-2"
          >
            {trans.password}
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="w-5 h-5 rounded border-2 border-border bg-background group-hover:border-primary transition-colors flex items-center justify-center">
            <input
              type="checkbox"
              className="sr-only"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            {rememberMe && <Check className="w-3 h-3 text-primary" />}
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            {trans.rememberMe}
          </span>
        </label>
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-primary hover:text-accent font-medium transition-colors cursor-pointer"
          disabled={isLoading}
        >
          {trans.forgotPassword}
        </button>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-primary hover:bg-accent text-primary-foreground font-semibold transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {trans.processing}
          </>
        ) : (
          trans.login
        )}
      </Button>
    </form>
  );
}
