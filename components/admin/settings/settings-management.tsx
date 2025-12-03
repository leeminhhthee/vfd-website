"use client";

import { aboutInteractor } from "@/data/datasource/about/interactor/about.interactor";
import { homeInteractor } from "@/data/datasource/home/interactor/home.interactor";
import { BankQrItem, BoardDirectorItem } from "@/data/model/about.model";
import { HeroItem } from "@/data/model/hero.model";
import { confirmUnsavedChanges } from "@/lib/utils";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
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
import { useState } from "react";
import BankQrEditorForm from "./bank-qr-form"; 
import DirectorEditorForm from "./director-editor-form";
import BannerEditorForm from "./banner-editor-form";
import Image from "next/image";

export default function SettingsManagement() {
  // --- States Director ---
  const [editingModeDirector, setEditingModeDirector] = useState(false);
  const [editingDirector, setEditingDirector] = useState<BoardDirectorItem | null>(null);

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

  const { data: bankQrs = [], isLoading: qrLoading } = useQuery({
    queryKey: ["bankQrs"],
    queryFn: aboutInteractor.getBankQrs, // Sửa thành getBankQrs (số nhiều)
  });

  const { data: banners = [], isLoading: bannersLoading } = useQuery({
    queryKey: ["heroes"],
    queryFn: homeInteractor.getFullHeroList,
  });

  // ---------------- MUTATIONS ----------------
  // ... (Mutations cho Director & Banner GIỮ NGUYÊN) ...
  const createDirectorMutation = useMutation({
    mutationFn: (data: Partial<BoardDirectorItem>) => aboutInteractor.createBoardDirector(data),
    onSuccess: () => { notification.success({ message: "Thành công" }); queryClient.invalidateQueries({ queryKey: ["directors"] }); handleCloseEditorDirector(); }
  });
  const updateDirectorMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BoardDirectorItem> }) => aboutInteractor.updateBoardDirector(id, data),
    onSuccess: () => { notification.success({ message: "Thành công" }); queryClient.invalidateQueries({ queryKey: ["directors"] }); handleCloseEditorDirector(); }
  });
  const deleteDirectorMutation = useMutation({
    mutationFn: (id: number) => aboutInteractor.deleteBoardDirector(id),
    onSuccess: () => { notification.success({ message: "Đã xóa" }); queryClient.invalidateQueries({ queryKey: ["directors"] }); }
  });

  const createBannerMutation = useMutation({
    mutationFn: (data: Partial<HeroItem>) => homeInteractor.createHero(data),
    onSuccess: () => { notification.success({ message: "Thành công" }); queryClient.invalidateQueries({ queryKey: ["heroes"] }); handleCloseEditorBanner(); }
  });
  const updateBannerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<HeroItem> }) => homeInteractor.updateHero(id, data),
    onSuccess: () => { notification.success({ message: "Thành công" }); queryClient.invalidateQueries({ queryKey: ["heroes"] }); handleCloseEditorBanner(); }
  });
  const deleteBannerMutation = useMutation({
    mutationFn: (id: number) => homeInteractor.deleteHero(id),
    onSuccess: () => { notification.success({ message: "Đã xóa" }); queryClient.invalidateQueries({ queryKey: ["heroes"] }); }
  });


  // --- Mutations QR ---
  const createQrMutation = useMutation({
    mutationFn: (data: Partial<BankQrItem>) => aboutInteractor.createBankQr(data),
    onSuccess: () => {
      notification.success({ message: "Thêm tài khoản thành công" });
      queryClient.invalidateQueries({ queryKey: ["bankQrs"] });
      handleCloseEditorQr();
    },
    onError: () => notification.error({ message: "Thêm thất bại" }),
  });

  const updateQrMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BankQrItem> }) => aboutInteractor.updateBankQr(id, data),
    onSuccess: () => {
      notification.success({ message: "Cập nhật thành công" });
      queryClient.invalidateQueries({ queryKey: ["bankQrs"] });
      handleCloseEditorQr();
    },
    onError: () => notification.error({ message: "Cập nhật thất bại" }),
  });

  const deleteQrMutation = useMutation({
    mutationFn: (id: number) => aboutInteractor.deleteBankQr(id),
    onSuccess: () => {
      notification.success({ message: "Đã xóa tài khoản" });
      queryClient.invalidateQueries({ queryKey: ["bankQrs"] });
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

  // Director & Banner Handlers (GIỮ NGUYÊN)
  const handleCloseEditorDirector = () => { setEditingModeDirector(false); setEditingDirector(null); setIsFormDirty(false); };
  const handleShowEditorDirector = (record?: BoardDirectorItem) => { setEditingDirector(record || null); setEditingModeDirector(true); setIsFormDirty(false); };
  
  const handleCloseEditorBanner = () => { setEditingModeBanner(false); setEditingBanner(null); setIsFormDirty(false); };
  const handleShowEditorBanner = (record?: HeroItem) => { setEditingBanner(record || null); setEditingModeBanner(true); setIsFormDirty(false); };

  // QR Handlers
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
      onOk: () => deleteQrMutation.mutate(id),
    });
  };

  // ---------------- COLUMNS ----------------
  // ... (Banner & Director Columns giữ nguyên) ...
  const bannerColumns: ColumnsType<HeroItem> = [
    { title: "Hình ảnh", dataIndex: "image", key: "image", width: 150, render: (url) => <Image src={url} height={60} width={100} style={{ objectFit: "cover", borderRadius: 4 }} alt="Banner" /> },
    { title: "Tiêu đề", dataIndex: "title", key: "title", render: (text) => <strong>{text || "(Không có tiêu đề)"}</strong> },
    { title: "Loại", key: "type", width: 120, render: (_, r) => r.isAutoGenerated ? <Tag color="purple">Giải đấu (Auto)</Tag> : <Tag color="blue">Thủ công</Tag> },
    { title: "Hành động", key: "action", align: "center", width: 120, render: (_, record) => {
        if (record.isAutoGenerated) return <Tooltip title="Banner tự động"><span className="text-gray-400 italic text-xs">Chỉ xem</span></Tooltip>;
        return (
          <Space size="middle">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleShowEditorBanner(record)} />
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => Modal.confirm({ title: "Xóa banner này?", okType: "danger", onOk: () => deleteBannerMutation.mutate(record.id) })} />
          </Space>
        );
      }
    },
  ];
  
  const directorColumns: ColumnsType<BoardDirectorItem> = [
    { title: "Hình ảnh", dataIndex: "imageUrl", key: "imageUrl", width: 120, align: "center", render: (url) => <Avatar src={url} size={50} shape="square" /> },
    { title: "Họ và tên", dataIndex: "name", key: "name", width: 200, render: (text) => <strong>{text}</strong> },
    { title: "Chức vụ", dataIndex: "role", key: "role" },
    { title: "Nhiệm kỳ", dataIndex: "term", key: "term", width: 200 },
    { title: "Hành động", key: "action", align: "center", width: 120, render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleShowEditorDirector(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => Modal.confirm({ title: "Xóa thành viên?", okType: 'danger', onOk: () => deleteDirectorMutation.mutate(record.id) })} />
        </Space>
      ),
    },
  ];

  const qrColumns: ColumnsType<BankQrItem> = [
    {
        title: "QR Code",
        dataIndex: "qrCodeUrl",
        key: "qrCodeUrl",
        width: 100,
        render: (url) => <Image src={url} width={60} height={60} style={{ objectFit: 'contain', border: '1px solid #f0f0f0', borderRadius: 4 }} alt="QR" />,
    },
    {
        title: "Ngân hàng",
        dataIndex: "bankName",
        key: "bankName",
        width: 150,
        render: (text, r) => (
            <div>
                <div className="font-bold">{text}</div>
                <div className="text-xs text-gray-500">{r.branchName}</div>
            </div>
        )
    },
    {
        title: "Thông tin tài khoản",
        key: "account",
        render: (_, r) => (
            <div>
                <div className="font-medium text-blue-600">{r.accountNumber}</div>
                <div className="text-xs uppercase text-gray-500">{r.accountName}</div>
            </div>
        )
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
            <h2 className="text-xl font-bold text-foreground">Tài khoản & QR Code Ngân hàng</h2>
            <p className="text-sm text-muted-foreground mt-1">Quản lý danh sách tài khoản nhận tài trợ.</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleShowEditorQr()}>
            Thêm tài khoản
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-border overflow-hidden">
           <Table
              columns={qrColumns}
              dataSource={bankQrs}
              rowKey="id"
              loading={qrLoading}
              pagination={false}
           />
        </div>
      </div>

      {/* --- 2. BANNER HERO --- */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground">Quản lý Banner Trang chủ</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Banner bao gồm các banner thủ công và banner tự động từ Giải đấu.
            </p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleShowEditorBanner()}>
            Thêm Banner
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <Table columns={bannerColumns} dataSource={banners} rowKey="id" loading={bannersLoading} pagination={false} />
        </div>
      </div>

      {/* --- 3. BAN GIÁM ĐỐC --- */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-foreground">Danh sách Ban giám đốc</h2>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleShowEditorDirector()}>
            Thêm thành viên
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <Table columns={directorColumns} dataSource={directors} rowKey="id" loading={directorsLoading} pagination={false} />
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
          onSave={(data) => {
            if (editingBanner?.id) updateBannerMutation.mutate({ id: editingBanner.id, data });
            else createBannerMutation.mutate(data);
          }}
          onCancel={() => handleDrawerClose(handleCloseEditorBanner)}
          isLoading={createBannerMutation.isPending || updateBannerMutation.isPending}
          hasUnsavedChanges={setIsFormDirty}
        />
      </Drawer>

      {/* Director Drawer */}
      <Drawer
        title={editingDirector ? "Cập nhật thông tin" : "Thêm thành viên Ban giám đốc"}
        placement="right"
        onClose={() => handleDrawerClose(handleCloseEditorDirector)}
        open={editingModeDirector}
        width={550}
        destroyOnClose
      >
        <DirectorEditorForm
          initialData={editingDirector ?? undefined}
          onSave={(data) => {
            if (editingDirector?.id) updateDirectorMutation.mutate({ id: editingDirector.id, data });
            else createDirectorMutation.mutate(data);
          }}
          onCancel={() => handleDrawerClose(handleCloseEditorDirector)}
          isLoading={createDirectorMutation.isPending || updateDirectorMutation.isPending}
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
           onSave={(data) => {
              if (editingQr?.id) updateQrMutation.mutate({ id: editingQr.id, data });
              else createQrMutation.mutate(data);
           }}
           onCancel={() => handleDrawerClose(handleCloseEditorQr)}
           isLoading={createQrMutation.isPending || updateQrMutation.isPending}
           hasUnsavedChanges={setIsFormDirty}
        />
      </Drawer>
    </div>
  );
}