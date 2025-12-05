"use client";

import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegistrationStatus } from "@/data/constants/constants";
import { registrationInteractor } from "@/data/datasource/registration/interactor/registration.interactor";
import { tournamentInteractor } from "@/data/datasource/tournament/interactor/tournament.interactor";
import { RegistrationItem } from "@/data/model/registration.model";
import { TournamentItem } from "@/data/model/tournament.model";
import { uploadFile } from "@/lib/utils";
import { useLoading } from "@/providers/loading-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircle, Check, Upload } from "lucide-react";
import type React from "react";
import { useState } from "react";

export default function TournamentRegistration() {
  const { showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = useState<Partial<RegistrationItem>>({});
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState("");

  const { data: tournaments = [] } = useQuery<TournamentItem[]>({
    queryKey: ["upcoming-tournaments"],
    queryFn: tournamentInteractor.getUpcomingTournaments,
  });

  const createRegistrationMutation = useMutation({
    mutationFn: (data: Partial<RegistrationItem>) =>
      registrationInteractor.createRegistration(data),
    onSuccess: () => {
      setShowSuccessDialog(true);

      // Reset form
      setFormData({});
      setFile(null);
      setUploadedFileName(null);
    },
    onError: () => {
      setServerErrorMessage(
        "Đã xảy ra lỗi khi gửi đơn đăng ký. Vui lòng thử lại sau."
      );
      setShowErrorDialog(true);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "players" ? parseInt(value) || 0 : value,
    }));
  };

  const validateAndSetFile = (selectedFile: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Vui lòng chọn file PDF hoặc DOCX");
      return;
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      alert("File không được vượt quá 20MB");
      return;
    }
    setFile(selectedFile);
    setUploadedFileName(selectedFile.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) validateAndSetFile(files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Vui lòng tải lên tài liệu tham gia.");
      return;
    }

    showLoading();
    try {
      const uploadResult = await uploadFile(file);

      const payload: Partial<RegistrationItem> = {
        ...formData,
        documentUrl: uploadResult.link,
        status: RegistrationStatus.PENDING,
        date: new Date().toISOString(),
      };

      createRegistrationMutation.mutate(payload);
    } catch (error) {
      setServerErrorMessage("Lỗi khi tải lên tệp đính kèm.");
      setShowErrorDialog(true);
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="space-y-8">
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Đăng ký thành công!
            </DialogTitle>
            <DialogDescription className="text-center pt-4">
              Đơn đăng ký của bạn đã được gửi. Chúng tôi sẽ liên hệ với bạn
              trong vòng 24 giờ.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- POPUP LỖI SERVER --- */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Lỗi đăng ký
            </DialogTitle>
            <DialogDescription className="text-center pt-4 text-red-600 font-medium">
              {serverErrorMessage}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setShowErrorDialog(false)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Alert */}
      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-700 font-medium">
            Những trường có dấu <span className="text-red-600">*</span> là bắt
            buộc
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Các thông tin này sẽ được sử dụng để liên hệ và xác nhận đơn đăng ký
            của bạn
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Thông tin giải đấu */}
        <Card className="p-6 border-2 border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold text-sm">
              1
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Thông tin giải đấu
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Chọn giải đấu <span className="text-red-600">*</span>
              </label>
              <select
                name="tournament"
                value={formData.tournament || ""}
                onChange={handleChange}
                required // Browser sẽ tự chặn nếu chưa chọn
                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-foreground"
              >
                <option value="">-- Chọn giải đấu --</option>
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Tên đơn vị <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization || ""}
                onChange={handleChange}
                required // Browser sẽ tự chặn
                placeholder="Ví dụ: Câu lạc bộ bóng chuyền Hà Nội"
                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </Card>

        {/* Section 2: Thông tin đội */}
        <Card className="p-6 border-2 border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold text-sm">
              2
            </div>
            <h2 className="text-xl font-bold text-foreground">Thông tin đội</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Tên đội <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName || ""}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên đội"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Số lượng VĐV <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="players"
                  value={formData.players || ""}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Số lượng"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Trưởng đoàn <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="leader"
                  value={formData.leader || ""}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên trưởng đoàn"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Huấn luyện viên <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="coach"
                  value={formData.coach || ""}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên huấn luyện viên"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Section 3: Thông tin người đăng ký */}
        <Card className="p-6 border-2 border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold text-sm">
              3
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Thông tin người đăng ký
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Tên người liên hệ <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName || ""}
                onChange={handleChange}
                required
                placeholder="Nhập tên của bạn"
                className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  required
                  placeholder="Nhập email"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Số điện thoại <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  required
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 bg-background text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Section 4: Upload tài liệu */}
        <Card className="p-6 border-2 border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full font-bold text-sm">
              4
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Tài liệu tham gia
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-center w-full">
              <label
                className={`w-full px-4 py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors flex flex-col items-center justify-center gap-2
                  ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-primary/30 bg-primary/5 hover:border-primary/50"
                  }
                `}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload
                  className={`w-8 h-8 ${
                    isDragging ? "text-primary" : "text-primary/70"
                  }`}
                />
                <span className="text-sm font-semibold text-foreground">
                  {uploadedFileName
                    ? uploadedFileName
                    : isDragging
                    ? "Thả file vào đây"
                    : "Bấm để chọn hoặc kéo thả file"}
                </span>
                <span className="text-xs text-muted-foreground">
                  PDF hoặc DOCX (Tối đa 20MB)
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                />
              </label>
            </div>
            {uploadedFileName && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-emerald-700">
                  File đã được chọn:{" "}
                  <span className="font-semibold">{uploadedFileName}</span>
                </span>
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg disabled:opacity-50 cursor-pointer"
            disabled={createRegistrationMutation.isPending}
          >
            {createRegistrationMutation.isPending
              ? "Đang gửi..."
              : "Gửi đơn đăng ký"}
          </button>
        </div>
      </form>
    </div>
  );
}
