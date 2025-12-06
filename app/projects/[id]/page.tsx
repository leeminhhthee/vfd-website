"use client";

import UserLayout from "@/components/layouts/user-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProjectCategoryLabel } from "@/data/constants/constants";
import { projectInteractor } from "@/data/datasource/project/interactor/project.interactor";
import { useQuery } from "@tanstack/react-query";
import { notification, Spin } from "antd";
import { Calendar, Copy, DollarSign, MapPin, Tag, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = Number(params?.id);

  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ["project-detail", id],
    queryFn: () => projectInteractor.getProjectById(id),
    enabled: !!id,
  });

  const { data: recentProjects, isLoading: isRecentProjectsLoading } = useQuery(
    {
      queryKey: ["recent-projects", id],
      queryFn: () => projectInteractor.getProjectsByCategory(id),
      enabled: !!project?.category,
    }
  );

  // Helper format tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (isProjectLoading || isRecentProjectsLoading) {
    return (
      <UserLayout>
        <div className="w-full h-[50vh] flex items-center justify-center">
          <Spin size="large" />
          <span className="text-gray-500 font-medium text-sm ml-5">
            Đang tải thông tin dự án...
          </span>
        </div>
      </UserLayout>
    );
  }

  if (!project) {
    return (
      <UserLayout>
        <div className="w-full h-[60vh] flex flex-col items-center justify-center bg-slate-50 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Không tìm thấy dự án
          </h2>
          <Link href="/">
            <Button>Quay về trang chủ</Button>
          </Link>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="w-full bg-slate-50 min-h-screen pb-12">
        {/* Hero Banner */}
        <div className="relative h-[400px] lg:h-[500px] w-full group">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-full object-cover"
            fill
            priority
          />
          {/* Overlay gradient tối hơn để text dễ đọc */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-7xl mx-auto w-full">
            <div className="mb-4 inline-flex items-center gap-2 w-fit bg-blue-900 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
              <Tag size={14} className="text-white" />
              <span className="text-xs font-bold text-white uppercase tracking-wide">
                {getProjectCategoryLabel(project.category)}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight text-balance shadow-sm">
              {project.title}
            </h1>
            <p className="text-lg text-gray-200 max-w-3xl line-clamp-2 text-balance">
              {project.overview}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8  relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Right Column - Bank QR Info (Sticky) */}
            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="sticky top-24 space-y-6">
                <Card className="p-0 border-none shadow-xl rounded-xl overflow-hidden bg-white">
                  <div className="bg-primary/5 p-4 text-center border-b border-border/50">
                    <h3 className="font-bold text-lg text-primary">
                      Thông tin tài trợ
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Quét mã để ủng hộ trực tiếp
                    </p>
                  </div>

                  {/* QR Code & Bank Info Display */}
                  <div className="flex flex-col items-center gap-6 p-6">
                    {/* Hình ảnh QR */}
                    <Image
                      src={project.bankQrCode.imageUrl || "/placeholder.svg"}
                      alt="Bank QR Code"
                      className="rounded-lg object-contain -mt-6"
                      width={200}
                      height={200}
                    />

                    {/* Thông tin tài khoản chi tiết */}
                    <div className="w-full space-y-5 text-center">
                      {/* Tên Ngân hàng */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Ngân hàng
                        </p>
                        <p className="font-extrabold text-xl text-blue-700 uppercase">
                          {project.bankQrCode.bankName}
                        </p>
                      </div>

                      {/* Số tài khoản (Có nút copy) */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 relative group transition-colors hover:bg-gray-100 hover:border-gray-400">
                        <p className="text-xs text-muted-foreground mb-1">
                          Số tài khoản
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-2xl font-mono font-bold tracking-wider text-gray-800">
                            {project.bankQrCode.accountNumber}
                          </span>
                          <Button
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-primary hover:bg-white shadow-sm"
                            title="Sao chép số tài khoản"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                project.bankQrCode.accountNumber
                              );
                              notification.success({
                                message: "Đã sao chép số tài khoản",
                              });
                            }}
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      </div>

                      {/* Chủ tài khoản */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Chủ tài khoản
                        </p>
                        <p className="font-bold text-base uppercase text-gray-700">
                          {project.bankQrCode.fullName}
                        </p>
                      </div>

                      {/* Chủ tài khoản */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                          Chi nhánh
                        </p>
                        <p className="font-bold text-base uppercase text-gray-700">
                          {project.bankQrCode.branch}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-xs text-green-700 text-center flex flex-col gap-1">
                        <span>✓ Chuyển khoản trực tiếp & An toàn</span>
                        <span>✓ Cấp giấy chứng nhận tài trợ</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Left Column - Project Info */}
            <div className="lg:col-span-2 space-y-8 order-last lg:order-first">
              {/* Key Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-5 border shadow-sm hover:shadow-md transition-all rounded-xl flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">
                      Thời gian
                    </p>
                    <p className="font-semibold text-gray-900 mt-1">
                      {project.duration}
                    </p>
                  </div>
                </Card>
                <Card className="p-5 border shadow-sm hover:shadow-md transition-all rounded-xl flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">
                      Địa điểm
                    </p>
                    <p className="font-semibold text-gray-900 mt-1 line-clamp-2">
                      {project.location}
                    </p>
                  </div>
                </Card>
                <Card className="p-5 border shadow-sm hover:shadow-md transition-all rounded-xl flex flex-col items-center text-center sm:items-start sm:text-left">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">
                      Mục tiêu tài chính
                    </p>
                    <p className="font-semibold text-gray-900 mt-1 text-lg">
                      {formatCurrency(project.price)}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Description & Goals */}
              <Card className="p-8 border-none shadow-md rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900">
                  Giới thiệu dự án
                </h2>
                <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                  {project.overview}
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h3 className="font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                    <Zap
                      size={20}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    Mục tiêu chính
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.goals.map((goal, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Recent Projects - Updated UI */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Dự án liên quan
                  </h2>
                  <Link href="/projects">
                    <Button
                      variant="link"
                      className="text-primary cursor-pointer"
                    >
                      Xem tất cả
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentProjects?.slice(0, 4).map((project) => (
                    <div
                      key={project.id}
                      className="group bg-white rounded-xl overflow-hidden border border-border/60 hover:border-primary/50 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          fill
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/95 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-md shadow-sm text-gray-800">
                            {getProjectCategoryLabel(project.category)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <h4 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h4>

                        <div className="mt-auto space-y-3 pt-2">
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin
                              size={16}
                              className="mt-0.5 flex-shrink-0"
                            />
                            <span className="line-clamp-1">
                              {project.location}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200">
                            <span className="text-xs text-muted-foreground font-medium uppercase">
                              Kinh phí dự kiến
                            </span>
                            <span className="font-bold text-primary">
                              {formatCurrency(project.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
