"use client";

import { ASSETS } from "@/app/generated/assets";
import { aboutInteractor } from "@/data/datasource/about/interactor/about.interactor";
import { homeInteractor } from "@/data/datasource/home/interactor/home.interactor";
import { BankQrItem, BoardDirectorItem } from "@/data/model/about.model";
import { HeroItem } from "@/data/model/hero.model";
import { confirmUnsavedChanges } from "@/lib/utils";
import { useLoading } from "@/providers/loading-provider";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Drawer,
  Modal,
  notification,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { useState } from "react";
import BankQrEditorForm from "./bank-qr-form";
import BannerEditorForm from "./banner-editor-form";
import DirectorEditorForm from "./director-editor-form";

export default function SettingsManagement() {
  const { showLoading, hideLoading } = useLoading();

  // --- States Director ---
  const [editingModeDirector, setEditingModeDirector] = useState(false);
  const [editingDirector, setEditingDirector] =
    useState<BoardDirectorItem | null>(null);

  // --- States Banner ---
  const [editingModeBanner, setEditingModeBanner] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroItem | null>(null);

  // --- States QR ---
  const [editingModeQr, setEditingModeQr] = useState(false);
  const [editingQr, setEditingQr] = useState<BankQrItem | null>(null);

  const [isFormDirty, setIsFormDirty] = useState(false);
  const queryClient = useQueryClient();

  // ---------------- QUERIES ----------------
  const { data: directors = [], isLoading: directorsLoading } = useQuery({
    queryKey: ["directors"],
    queryFn: aboutInteractor.getBoardDirectors,
  });

  const { data: banks = [], isLoading: qrLoading } = useQuery({
    queryKey: ["banks"],
    queryFn: aboutInteractor.getBankQrs,
  });

  const { data: banners = [], isLoading: bannersLoading } = useQuery({
    queryKey: ["heroes"],
    queryFn: homeInteractor.getFullHeroList,
  });

  // ---------------- MUTATIONS ----------------
  const createDirectorMutation = useMutation({
    mutationFn: (data: Partial<BoardDirectorItem>) =>
      aboutInteractor.createBoardDirector(data),
    onSuccess: async () => {
      notification.success({ message: "Thành công" });
      await queryClient.invalidateQueries({ queryKey: ["directors"] });
      handleCloseEditorDirector();
    },
    onError: () => notification.error({ message: "Thêm thất bại" }),
  });

  const updateDirectorMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<BoardDirectorItem>;
    }) => aboutInteractor.updateBoardDirector(id, data),
    onSuccess: async () => {
      notification.success({ message: "Thành công" });
      await queryClient.invalidateQueries({ queryKey: ["directors"] });
      handleCloseEditorDirector();
    },
    onError: () => notification.error({ message: "Cập nhật thất bại" }),
  });

  const deleteDirectorMutation = useMutation({
    mutationFn: (id: number) => aboutInteractor.deleteBoardDirector(id),
    onSuccess: async () => {
      notification.success({ message: "Đã xóa" });
      await queryClient.invalidateQueries({ queryKey: ["directors"] });
    },
    onError: () => notification.error({ message: "Xóa thất bại" }),
  });

  const createBannerMutation = useMutation({
    mutationFn: (data: Partial<HeroItem>) => homeInteractor.createHero(data),
    onSuccess: async () => {
      notification.success({ message: "Thành công" });
      await queryClient.invalidateQueries({ queryKey: ["heroes"] });
      handleCloseEditorBanner();
    },
    onError: () => notification.error({ message: "Thêm thất bại" }),
  });

  const updateBannerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<HeroItem> }) =>
      homeInteractor.updateHero(id, data),
    onSuccess: async () => {
      notification.success({ message: "Thành công" });
      await queryClient.invalidateQueries({ queryKey: ["heroes"] });
      handleCloseEditorBanner();
    },
    onError: () => notification.error({ message: "Cập nhật thất bại" }),
  });

  const deleteBannerMutation = useMutation({
    mutationFn: (id: number) => homeInteractor.deleteHero(id),
    onSuccess: async () => {
      notification.success({ message: "Đã xóa" });
      await queryClient.invalidateQueries({ queryKey: ["heroes"] });
    },
    onError: () => notification.error({ message: "Xóa thất bại" }),
  });

  const createQrMutation = useMutation({
    mutationFn: (data: Partial<BankQrItem>) =>
      aboutInteractor.createBankQr(data),
    onSuccess: async () => {
      notification.success({ message: "Thêm tài khoản thành công" });
      await queryClient.invalidateQueries({ queryKey: ["banks"] });
      handleCloseEditorQr();
    },
    onError: () => notification.error({ message: "Thêm thất bại" }),
  });

  const updateQrMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BankQrItem> }) =>
      aboutInteractor.updateBankQr(id, data),
    onSuccess: async () => {
      notification.success({ message: "Cập nhật thành công" });
      await queryClient.invalidateQueries({ queryKey: ["banks"] });
      handleCloseEditorQr();
    },
    onError: () => notification.error({ message: "Cập nhật thất bại" }),
  });

  const deleteQrMutation = useMutation({
    mutationFn: (id: number) => aboutInteractor.deleteBankQr(id),
    onSuccess: async () => {
      notification.success({ message: "Đã xóa tài khoản" });
      await queryClient.invalidateQueries({ queryKey: ["banks"] });
    },
    onError: () => notification.error({ message: "Xóa thất bại" }),
  });

  // ---------------- HANDLERS ----------------
  const handleDrawerClose = (closeFn: () => void) => {
    if (isFormDirty) {
      confirmUnsavedChanges(closeFn);
    } else {
      closeFn();
    }
  };

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

  const handleCloseEditorQr = () => {
    setEditingModeQr(false);
    setEditingQr(null);
    setIsFormDirty(false);
  };

  const handleShowEditorQr = (record?: BankQrItem) => {
    setEditingQr(record || null);
    setEditingModeQr(true);
    setIsFormDirty(false);
  };

  const handleDeleteQr = (id: number) => {
    Modal.confirm({
      title: "Xóa tài khoản ngân hàng này?",
      okType: "danger",
      onOk: async () => {
        showLoading();
        try {
          await deleteQrMutation.mutateAsync(id);
        } finally {
          hideLoading();
        }
      },
    });
  };

  // ---------------- COLUMNS ----------------
  const bannerColumns: ColumnsType<HeroItem> = [
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 150,
      align: "center",
      render: (url) => (
        <div className="flex justify-center">
          <Image
            src={url || ASSETS.logo.vfd_logo}
            height={60}
            width={100}
            style={{ objectFit: "cover", borderRadius: 4 }}
            alt="Banner"
          />
        </div>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text || "--"}</strong>,
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
      fixed: "right",
      width: 120,
      render: (_, record) => {
        if (record.isAutoGenerated)
          return (
            <Tooltip title="Banner tự động">
              <span className="text-gray-400 italic text-xs">Chỉ xem</span>
            </Tooltip>
          );
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
                  onOk: async () => {
                    showLoading();
                    try {
                      await deleteBannerMutation.mutateAsync(record.id);
                    } finally {
                      hideLoading();
                    }
                  },
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
      width: 100,
      align: "center",
      render: (url) => (
        <Avatar src={url || ASSETS.logo.vfd_logo} size={50} shape="square" />
      ),
    },
    {
      title: "Thông tin cá nhân",
      key: "personal",
      width: 150,
      render: (_, record) => (
        <div>
          <div className="font-bold">{record.fullName}</div>
          {record.email && (
            <div className="text-xs text-gray-500">{record.email}</div>
          )}
          {record.phoneNumber && (
            <div className="text-xs text-gray-500">{record.phoneNumber}</div>
          )}
        </div>
      ),
    },
    {
      title: "Chức vụ",
      dataIndex: "role",
      key: "role",
      width: 250,
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
      fixed: "right",
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
            onClick={() =>
              Modal.confirm({
                title: "Xóa Lãnh đạo?",
                okType: "danger",
                onOk: async () => {
                  showLoading();
                  try {
                    await deleteDirectorMutation.mutateAsync(record.id);
                  } finally {
                    hideLoading();
                  }
                },
              })
            }
          />
        </Space>
      ),
    },
  ];

  const qrColumns: ColumnsType<BankQrItem> = [
    {
      title: "QR Code",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 150,
      align: "center",
      render: (url) => (
        <div className="flex justify-center">
          <Image
            src={url}
            width={60}
            height={60}
            style={{
              objectFit: "contain",
              border: "1px solid #f0f0f0",
              borderRadius: 4,
            }}
            alt="QR"
          />
        </div>
      ),
    },
    {
      title: "Ngân hàng",
      dataIndex: "bankName",
      key: "bankName",
      width: 300,
      render: (text, r) => (
        <div>
          <div className="font-bold">{text}</div>
          <div className="text-xs text-gray-500">{r.branch}</div>
        </div>
      ),
    },
    {
      title: "Thông tin tài khoản",
      key: "account",
      render: (_, r) => (
        <div>
          <div className="font-medium text-blue-600">{r.accountNumber}</div>
          <div className="text-xs uppercase text-gray-500">{r.fullName}</div>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleShowEditorQr(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteQr(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-12">
      {/* --- 1. QR CODE --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Tài khoản & QR Code Ngân hàng
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý danh sách tài khoản nhận tài trợ.
            </p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleShowEditorQr()}
          >
            Thêm tài khoản
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <Table
            columns={qrColumns}
            dataSource={banks}
            rowKey="id"
            loading={qrLoading}
            pagination={false}
            scroll={{ x: "max-content" }}
          />
        </div>
      </div>

      {/* --- 2. BANNER HERO --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Quản lý Banner Trang chủ
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Banner bao gồm các banner thủ công và banner tự động từ Giải đấu.
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
            scroll={{ x: "max-content" }}
          />
        </div>
      </div>

      {/* --- 3. BAN GIÁM ĐỐC --- */}
      <div className="space-y-4 pt-4">
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
            scroll={{ x: "max-content" }}
          />
        </div>
      </div>

      {/* --- DRAWERS --- */}

      {/* Banner Drawer */}
      <Drawer
        title={editingBanner ? "Cập nhật Banner" : "Thêm Banner Mới"}
        placement="right"
        onClose={() => handleDrawerClose(handleCloseEditorBanner)}
        open={editingModeBanner}
        width={550}
        destroyOnClose
      >
        <BannerEditorForm
          initialData={editingBanner ?? undefined}
          onSave={async (data) => {
            showLoading();
            try {
              if (editingBanner?.id) {
                await updateBannerMutation.mutateAsync({
                  id: editingBanner.id,
                  data,
                });
              } else {
                await createBannerMutation.mutateAsync(data);
              }
            } finally {
              hideLoading();
            }
          }}
          onCancel={() => handleDrawerClose(handleCloseEditorBanner)}
          isLoading={
            createBannerMutation.isPending || updateBannerMutation.isPending
          }
          hasUnsavedChanges={setIsFormDirty}
        />
      </Drawer>

      {/* Director Drawer */}
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
      >
        <DirectorEditorForm
          initialData={editingDirector ?? undefined}
          onSave={async (data) => {
            showLoading();
            try {
              if (editingDirector?.id) {
                await updateDirectorMutation.mutateAsync({
                  id: editingDirector.id,
                  data,
                });
              } else {
                await createDirectorMutation.mutateAsync(data);
              }
            } finally {
              hideLoading();
            }
          }}
          onCancel={() => handleDrawerClose(handleCloseEditorDirector)}
          isLoading={
            createDirectorMutation.isPending || updateDirectorMutation.isPending
          }
          hasUnsavedChanges={setIsFormDirty}
        />
      </Drawer>

      {/* QR Code Drawer */}
      <Drawer
        title={editingQr ? "Cập nhật tài khoản" : "Thêm tài khoản ngân hàng"}
        placement="right"
        onClose={() => handleDrawerClose(handleCloseEditorQr)}
        open={editingModeQr}
        width={550}
        destroyOnClose
      >
        <BankQrEditorForm
          initialData={editingQr ?? undefined}
          onSave={async (data) => {
            showLoading();
            try {
              if (editingQr?.id) {
                await updateQrMutation.mutateAsync({ id: editingQr.id, data });
              } else {
                await createQrMutation.mutateAsync(data);
              }
            } finally {
              hideLoading();
            }
          }}
          onCancel={() => handleDrawerClose(handleCloseEditorQr)}
          isLoading={createQrMutation.isPending || updateQrMutation.isPending}
          hasUnsavedChanges={setIsFormDirty}
        />
      </Drawer>
    </div>
  );
}
