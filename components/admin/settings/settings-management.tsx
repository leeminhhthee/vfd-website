"use client";

import { aboutInteractor } from "@/data/datasource/about/interactor/about.interactor";
import { homeInteractor } from "@/data/datasource/home/interactor/home.interactor"; // Import homeInteractor
import { BoardDirectorItem } from "@/data/model/about.model";
import { HeroItem } from "@/data/model/hero.model";
import { confirmUnsavedChanges, uploadFile } from "@/lib/utils";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Drawer,
  Image,
  Modal,
  notification,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { X } from "lucide-react";
import { useState } from "react";
import DirectorEditorForm from "./settings-editor-form";
import BannerEditorForm from "./banner-editor-form";

export default function SettingsManagement() {
  // --- States Director ---
  const [editingModeDirector, setEditingModeDirector] = useState(false);
  const [editingDirector, setEditingDirector] = useState<BoardDirectorItem | null>(null);

  // --- States Banner ---
  const [editingModeBanner, setEditingModeBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroItem | null>(null);

  // --- States QR ---
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string>("");
  const [isQrUploading, setIsQrUploading] = useState(false);

  const [isFormDirty, setIsFormDirty] = useState(false);
  const queryClient = useQueryClient();

  // ---------------- QUERIES ----------------
  const { data: directors = [], isLoading: directorsLoading } = useQuery({
    queryKey: ["directors"],
    queryFn: aboutInteractor.getBoardDirectors,
  });

  const { data: bankQrUrl, isLoading: qrLoading } = useQuery({
    queryKey: ["bankQr"],
    queryFn: aboutInteractor.getBankQrUrl,
  });

  // Query lấy danh sách Banner (Bao gồm cả Auto từ Tournament)
  const { data: banners = [], isLoading: bannersLoading } = useQuery({
    queryKey: ["heroes"],
    queryFn: homeInteractor.getFullHeroList,
  });

  // ---------------- MUTATIONS (DIRECTOR) ----------------
  const createDirectorMutation = useMutation({
    mutationFn: (data: Partial<BoardDirectorItem>) =>
      aboutInteractor.createBoardDirector(data),
    onSuccess: () => {
      notification.success({ message: "Thêm thành viên thành công" });
      queryClient.invalidateQueries({ queryKey: ["directors"] });
      handleCloseEditorDirector();
    },
    onError: () => notification.error({ message: "Thêm thất bại" }),
  });

  const updateDirectorMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BoardDirectorItem> }) =>
      aboutInteractor.updateBoardDirector(id, data),
    onSuccess: () => {
      notification.success({ message: "Cập nhật thành công" });
      queryClient.invalidateQueries({ queryKey: ["directors"] });
      handleCloseEditorDirector();
    },
    onError: () => notification.error({ message: "Cập nhật thất bại" }),
  });

  const deleteDirectorMutation = useMutation({
    mutationFn: (id: number) => aboutInteractor.deleteBoardDirector(id),
    onSuccess: () => {
      notification.success({ message: "Đã xóa thành viên" });
      queryClient.invalidateQueries({ queryKey: ["directors"] });
    },
    onError: () => notification.error({ message: "Xóa thất bại" }),
  });

  // ---------------- MUTATIONS (BANNER) ----------------
  const createBannerMutation = useMutation({
    mutationFn: (data: Partial<HeroItem>) => homeInteractor.createHero(data),
    onSuccess: () => {
      notification.success({ message: "Thêm banner thành công" });
      queryClient.invalidateQueries({ queryKey: ["heroes"] });
      handleCloseEditorBanner();
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<HeroItem> }) =>
      homeInteractor.updateHero(id, data),
    onSuccess: () => {
      notification.success({ message: "Cập nhật banner thành công" });
      queryClient.invalidateQueries({ queryKey: ["heroes"] });
      handleCloseEditorBanner();
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (id: number) => homeInteractor.deleteHero(id),
    onSuccess: () => {
      notification.success({ message: "Đã xóa banner" });
      queryClient.invalidateQueries({ queryKey: ["heroes"] });
    },
  });

  // ---------------- MUTATION (QR) ----------------
  const updateQrMutation = useMutation({
    mutationFn: (url: string) => aboutInteractor.updateBankQr(url),
    onSuccess: () => {
      notification.success({ message: "Cập nhật QR Code thành công" });
      queryClient.invalidateQueries({ queryKey: ["bankQr"] });
      setQrFile(null);
      setQrPreview("");
    },
    onError: () => notification.error({ message: "Cập nhật QR thất bại" }),
  });

  // ---------------- HANDLERS ----------------
  const handleDrawerClose = (closeFn: () => void) => {
    if (isFormDirty) {
      confirmUnsavedChanges(closeFn);
    } else {
      closeFn();
    }
  };

  // Director Handlers
  const handleCloseEditorDirector = () => {
    setEditingModeDirector(false);
    setEditingDirector(null);
    setIsFormDirty(false);
  };

  const handleShowEditorDirector = (record?: BoardDirectorItem) => {
    setEditingDirector(record || null);
    setEditingModeDirector(true);
    setIsFormDirty(false);
  };

  const handleDeleteDirector = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa?",
      okType: "danger",
      onOk: () => deleteDirectorMutation.mutate(id),
    });
  };

  // Banner Handlers
  const handleCloseEditorBanner = () => {
    setEditingModeBanner(false);
    setEditingBanner(null);
    setIsFormDirty(false);
  };

  const handleShowEditorBanner = (record?: HeroItem) => {
    setEditingBanner(record || null);
    setEditingModeBanner(true);
    setIsFormDirty(false);
  };

  // QR Handlers
  const handleQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };

  const handleCancelQrChange = () => {
    setQrFile(null);
    setQrPreview("");
  };

  const handleSaveQr = async () => {
    if (!qrFile) return;
    setIsQrUploading(true);
    try {
      const uploadResult = await uploadFile(qrFile);
      updateQrMutation.mutate(uploadResult.link);
    } catch (error) {
      notification.error({ message: "Lỗi upload ảnh" });
    } finally {
      setIsQrUploading(false);
    }
  };

  // ---------------- COLUMNS ----------------
  const bannerColumns: ColumnsType<HeroItem> = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 150,
      render: (url) => (
        <Image
          src={url}
          height={60}
          width={100}
          style={{ objectFit: "cover", borderRadius: 4 }}
          alt="Banner"
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text || "(Không có tiêu đề)"}</strong>,
    },
    {
      title: "Loại",
      key: "type",
      width: 120,
      render: (_, r) => 
        r.isAutoGenerated ? (
          <Tag color="purple">Giải đấu (Auto)</Tag>
        ) : (
          <Tag color="blue">Thủ công</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 100,
      render: (_, record) => {
        if (record.isAutoGenerated) {
          return (
            <Tooltip title="Banner này được tạo tự động từ Giải đấu. Vui lòng chỉnh sửa trong phần Quản lý Giải đấu.">
              <span className="text-gray-400 italic text-xs">Chỉ xem</span>
            </Tooltip>
          );
        }
        return (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleShowEditorBanner(record)}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                Modal.confirm({
                  title: "Xóa banner này?",
                  okType: "danger",
                  onOk: () => deleteBannerMutation.mutate(record.id),
                })
              }
            />
          </Space>
        );
      },
    },
  ];

  const directorColumns: ColumnsType<BoardDirectorItem> = [
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 80,
      render: (url) => <Avatar src={url} size={50} shape="square" />,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Nhiệm kỳ",
      dataIndex: "term",
      key: "term",
      width: 150,
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleShowEditorDirector(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteDirector(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-12">
      {/* --- 1. QR CODE --- */}
      <Card title="QR Code Ngân hàng" className="shadow-sm border border-border">
        <div className="flex gap-8 items-start">
          <div className="flex-shrink-0">
            <div className="mb-2 text-sm font-medium text-gray-500">
              Hình ảnh hiện tại
            </div>
            {qrLoading ? (
              <div className="w-48 h-48 bg-gray-100 animate-pulse rounded-lg" />
            ) : (
              <Image
                src={qrPreview || bankQrUrl || "/placeholder.svg"}
                alt="Bank QR"
                width={200}
                className="rounded-lg border border-border"
              />
            )}
          </div>

          <div className="flex-1 space-y-4 mt-7">
            <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-sm text-gray-500 mb-2">
                Tải lên mã QR mới để hiển thị trong các dự án kêu gọi tài trợ.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  id="qr-upload"
                  accept="image/*"
                  onChange={handleQrFileChange}
                  className="hidden"
                  disabled={isQrUploading}
                />
                <label htmlFor="qr-upload">
                  <Button
                    icon={<UploadOutlined />}
                    disabled={isQrUploading}
                    className="pointer-events-none"
                  >
                    Chọn hình ảnh
                  </Button>
                </label>
                {qrFile && (
                  <span className="text-sm text-blue-600 font-medium">
                    {qrFile.name}
                  </span>
                )}
              </div>
            </div>

            {qrFile && (
              <Space>
                <Button
                  type="primary"
                  onClick={handleSaveQr}
                  loading={isQrUploading || updateQrMutation.isPending}
                >
                  Lưu thay đổi
                </Button>
                <Button
                  onClick={handleCancelQrChange}
                  disabled={isQrUploading || updateQrMutation.isPending}
                >
                  Hủy
                </Button>
              </Space>
            )}
          </div>
        </div>
      </Card>

      {/* --- 2. BANNER HERO --- */}
      <div className="space-y-4 mt-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Quản lý Banner Trang chủ
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Banner bao gồm các banner thủ công và banner tự động từ Giải đấu (đang hiển thị trang chủ).
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleShowEditorBanner()}
          >
            Thêm Banner
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <Table
            columns={bannerColumns}
            dataSource={banners}
            rowKey="id"
            loading={bannersLoading}
            pagination={false}
          />
        </div>
      </div>

      {/* --- 3. BAN GIÁM ĐỐC --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-foreground">
            Danh sách Ban giám đốc
          </h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleShowEditorDirector()}
          >
            Thêm thành viên
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <Table
            columns={directorColumns}
            dataSource={directors}
            rowKey="id"
            loading={directorsLoading}
            pagination={false}
          />
        </div>
      </div>

      {/* --- DRAWERS --- */}
      <Drawer
        title={editingBanner ? "Cập nhật Banner" : "Thêm Banner Mới"}
        placement="right"
        onClose={() => handleDrawerClose(handleCloseEditorBanner)}
        open={editingModeBanner}
        width={550}
        destroyOnClose
        maskClosable={true}
      >
        <BannerEditorForm
          initialData={editingBanner ?? undefined}
          onSave={(data) => {
            if (editingBanner?.id)
              updateBannerMutation.mutate({ id: editingBanner.id, data });
            else createBannerMutation.mutate(data);
          }}
          onCancel={() => handleDrawerClose(handleCloseEditorBanner)}
          isLoading={
            createBannerMutation.isPending || updateBannerMutation.isPending
          }
          hasUnsavedChanges={setIsFormDirty}
        />
      </Drawer>

      <Drawer
        title={
          editingDirector
            ? "Cập nhật thông tin"
            : "Thêm thành viên Ban giám đốc"
        }
        placement="right"
        onClose={() => handleDrawerClose(handleCloseEditorDirector)}
        open={editingModeDirector}
        width={550}
        destroyOnClose
        maskClosable={true}
      >
        <DirectorEditorForm
          key={editingDirector ? editingDirector.id : "create-new"}
          initialData={editingDirector ?? undefined}
          onSave={(data) => {
            if (editingDirector?.id) {
              updateDirectorMutation.mutate({
                id: editingDirector.id,
                data: data,
              });
            } else {
              createDirectorMutation.mutate(data);
            }
          }}
          onCancel={() => handleDrawerClose(handleCloseEditorDirector)}
          isLoading={
            createDirectorMutation.isPending || updateDirectorMutation.isPending
          }
          hasUnsavedChanges={setIsFormDirty}
        />
      </Drawer>
    </div>
  );
}