"use client";

import { Card } from "@/components/ui/card";
import { RegistrationStatus } from "@/data/constants/constants";
import { registrationInteractor } from "@/data/datasource/registration/interactor/registration.interactor";
import { tournamentInteractor } from "@/data/datasource/tournament/interactor/tournament.interactor";
import { RegistrationItem } from "@/data/model/registration.model";
import { TournamentItem } from "@/data/model/tournament.model";
import { uploadFile } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { notification } from "antd";
import { AlertCircle, Check, Upload } from "lucide-react";
import type React from "react";
import { useState } from "react";

export default function TournamentRegistration() {
  const [formData, setFormData] = useState<Partial<RegistrationItem>>({});

  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { data: tournaments = [] } = useQuery<TournamentItem[]>({
    queryKey: ["upcoming-tournaments"],
    queryFn: tournamentInteractor.getUpcomingTournaments,
  });

  const createRegistrationMutation = useMutation({
    mutationFn: (data: Partial<RegistrationItem>) =>
      registrationInteractor.createRegistration(data),
    onSuccess: () => {
      setSubmitted(true);
      setFormData({});
      setFile(null);
      setUploadedFileName(null);
      setTimeout(() => setSubmitted(false), 5000);
    },
    onError: () => {
      notification.error({ message: "Đăng ký thất bại. Vui lòng thử lại." });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Xử lý riêng cho trường số lượng (number)
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
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Vui lòng tải lên tài liệu tham gia.");
      return;
    }

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
      notification.error({ message: "Lỗi khi upload file." });
    }
  };

  return (
    <div className="space-y-8">
      {submitted && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg flex gap-3 animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-900">
              Đăng ký thành công!
            </p>
            <p className="text-sm text-emerald-700">
              Đơn đăng ký của bạn đã được gửi. Chúng tôi sẽ liên hệ với bạn
              trong vòng 24 giờ.
            </p>
          </div>
        </div>
      )}

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
                // 2. Thêm || "" để tránh lỗi uncontrolled input
                value={formData.tournament || ""}
                onChange={handleChange}
                required
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
                required
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
                  // Số 0 || "" sẽ trả về "", giúp input trống khi chưa nhập
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

        {/* Section 4: Upload tài liệu (Giữ nguyên vì file quản lý riêng) */}
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
                  PDF hoặc DOCX (Tối đa 10MB)
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
            className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg"
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
