"use client";

import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

interface CodeConfirmPasswordProps {
  email: string;
  onSuccess: () => void;
  onBack?: () => void;
}

export function CodeConfirmPassword({
  email,
  onSuccess,
  onBack,
}: CodeConfirmPasswordProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (code === "000000") {
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else {
      setError("Mã xác nhận không đúng.");
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-primary" />
          </div>
        </div>
        <CardTitle>Xác Nhận Thành Công</CardTitle>
        <CardDescription>
          Đang chuyển sang trang đặt lại mật khẩu...
        </CardDescription>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8">
      <CardTitle className="text-xl">Xác Nhận Mã</CardTitle>
      <CardDescription className="mt-1">
        Nhập mã xác nhận đã gửi tới email <b>{email}</b>
      </CardDescription>
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <Input
        id="code"
        type="text"
        placeholder="Nhập mã 6 chữ số"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        disabled={isLoading}
        required
      />
      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-accent"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Đang xác nhận...
          </>
        ) : (
          "Xác Nhận"
        )}
      </Button>
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          className="w-full mt-2"
          onClick={onBack}
          disabled={isLoading}
        >
          Quay lại
        </Button>
      )}
    </form>
  );
}
