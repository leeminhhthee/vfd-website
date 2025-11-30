"use client";

import {
  GalleryCategory,
  GalleryCategoryLabels,
} from "@/data/constants/constants";
import { galleryInteractor } from "@/data/datasource/gallery/interactor/gallery.interactor";
import { GalleryAlbum } from "@/data/model/gallery.model";
import { confirmUnsavedChanges } from "@/lib/utils";
import {
  DeleteOutlined,
  EditOutlined,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Drawer,
  Empty,
  Input,
  Modal,
  notification,
  Skeleton,
  Space,
  Tag,
} from "antd";
import { X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import GallerysEditorForm from "./gallerys-editor-form";

const { Meta } = Card;

export default function GallerysManagement() {
  const [editingMode, setEditingMode] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormDirty, setIsFormDirty] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: albums = [],
    isLoading,
    error,
  } = useQuery<GalleryAlbum[]>({
    queryKey: ["galleries"],
    queryFn: galleryInteractor.getGalleryList,
  });

  const handleCloseEditor = () => {
    setEditingMode(false);
    setEditingAlbum(null);
    setIsFormDirty(false);
  };

  const handleDrawerClose = () => {
    if (isFormDirty) {
      confirmUnsavedChanges(() => {
        handleCloseEditor();
      });
    } else {
      handleCloseEditor();
    }
  };

  const createMutation = useMutation<
    GalleryAlbum,
    Error,
    Partial<GalleryAlbum>
  >({
    mutationFn: (data) => galleryInteractor.createGallery(data),
    onSuccess: () => {
      notification.success({ message: "Tạo album thành công" });
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      handleCloseEditor();
    },
    onError: () => notification.error({ message: "Tạo album thất bại" }),
  });

  const updateMutation = useMutation<
    GalleryAlbum,
    Error,
    { id: number; data: Partial<GalleryAlbum> }
  >({
    mutationFn: ({ id, data }) => galleryInteractor.updateGallery(id, data),
    onSuccess: () => {
      notification.success({ message: "Cập nhật thành công" });
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      handleCloseEditor();
    },
    onError: () => notification.error({ message: "Cập nhật thất bại" }),
  });

  const deleteMutation = useMutation<boolean, Error, number>({
    mutationFn: (id) => galleryInteractor.deleteGallery(id),
    onSuccess: () => {
      notification.success({ message: "Đã xóa album" });
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
    onError: () => notification.error({ message: "Xóa thất bại" }),
  });

  const filteredAlbums = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return albums.filter(
      (item) =>
        (item.title || "").toLowerCase().includes(term) ||
        (GalleryCategoryLabels[item.category as GalleryCategory] || "")
          .toLowerCase()
          .includes(term)
    );
  }, [albums, searchTerm]);

  const handleShowEditor = (record?: GalleryAlbum) => {
    setEditingAlbum(record || null);
    setEditingMode(true);
    setIsFormDirty(false);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa album này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => deleteMutation.mutate(id),
    });
  };

  if (error) {
    return (
      <Alert
        type="error"
        message="Lỗi tải dữ liệu"
        description={(error as Error).message}
        showIcon
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Space.Compact style={{ width: 320 }}>
            <Input
              placeholder="Tìm kiếm album..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
            <Button type="primary" onClick={() => setSearchTerm(searchTerm)}>
              Tìm
            </Button>
          </Space.Compact>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleShowEditor()}
        >
          Tạo Album
        </Button>
      </div>

      <div className="bg-transparent">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} active />
            ))}
          </div>
        ) : filteredAlbums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAlbums.map((album) => (
              <Card
                key={album.id}
                hoverable
                cover={
                  <div className="h-48 overflow-hidden relative group">
                    <Image
                      alt={album.title}
                      src={
                        album.images && album.images.length > 0
                          ? album.images[0]
                          : "/placeholder.svg"
                      }
                      fill
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <PictureOutlined />
                      {album.images?.length || 0}
                    </div>
                  </div>
                }
                actions={[
                  <EditOutlined
                    key="edit"
                    onClick={() => handleShowEditor(album)}
                  />,
                  <DeleteOutlined
                    key="delete"
                    style={{ color: "red" }}
                    onClick={() => handleDelete(album.id)}
                  />,
                ]}
              >
                <Meta
                  title={
                    <div className="flex justify-between items-center">
                      <span className="truncate" title={album.title}>
                        {album.title}
                      </span>
                    </div>
                  }
                  description={
                    <div className="space-y-1">
                      <div>
                        <Tag color="blue">
                          {GalleryCategoryLabels[
                            album.category as GalleryCategory
                          ] || album.category}
                        </Tag>
                      </div>
                      <div className="text-xs text-gray-400">
                        {album.createdAt
                          ? new Date(album.createdAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : "---"}
                      </div>
                    </div>
                  }
                />
              </Card>
            ))}
          </div>
        ) : (
          <Empty description="Không có album nào" />
        )}
      </div>

      <Drawer
        title={editingAlbum ? "Chỉnh sửa Album" : "Tạo Album mới"}
        placement="right"
        onClose={handleDrawerClose}
        open={editingMode}
        width={600}
        closeIcon={<X size={20} />}
        destroyOnClose
        maskClosable={true}
      >
        <GallerysEditorForm
          key={editingAlbum ? editingAlbum.id : "create-new"}
          initialData={editingAlbum ?? undefined}
          onSave={(data) => {
            if (editingAlbum?.id) {
              updateMutation.mutate({
                id: editingAlbum.id,
                data: data,
              });
            } else {
              createMutation.mutate(data);
            }
          }}
          onCancel={handleDrawerClose}
          isLoading={createMutation.isPending || updateMutation.isPending}
          hasUnsavedChanges={setIsFormDirty}
        />
      </Drawer>
    </div>
  );
}
