"use client";

import {
  getMemberLevelLabel,
  MemberLevel,
  MemberRole,
  MemberRoleLabels,
  MemberStatus,
  MemberStatusLabels,
} from "@/data/constants/constants";
import { MemberItem } from "@/data/model/member.model";
import { Button, DatePicker, Input, Select, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface Props {
  initialData?: MemberItem;
  onSave: (data: Partial<MemberItem>) => void;
  onCancel: () => void;
  isLoading: boolean;
  hasUnsavedChanges?: (changed: boolean) => void;
}

const STATUS_OPTIONS = Object.values(MemberStatus).map((st) => ({
  value: st,
  label: MemberStatusLabels[st],
}));

const ROLE_OPTIONS = Object.values(MemberRole).map((role) => ({
  value: role,
  label: MemberRoleLabels[role],
}));

export default function MembersEditorForm({
  initialData,
  onSave,
  onCancel,
  isLoading,
  hasUnsavedChanges: notifyUnsavedChanges,
}: Props) {
  const [formData, setFormData] = useState<Partial<MemberItem>>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    education: initialData?.education || "",
    // Default role là MEMBER nếu chưa có
    role: initialData?.role || MemberRole.MEMBER,
    level: initialData?.level || MemberLevel.UNIVERSITY,
    status: initialData?.status || MemberStatus.ACTIVE,
    birthday: initialData?.birthday || undefined,
    joinedAt: initialData?.joinedAt || new Date(),
    accumulatedPoints: initialData?.accumulatedPoints || 0,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (notifyUnsavedChanges) notifyUnsavedChanges(hasUnsavedChanges);
  }, [hasUnsavedChanges, notifyUnsavedChanges]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const markAsChanged = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleSelectChange = (field: keyof MemberItem, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    markAsChanged();
  };

  const handleSave = async () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6">
      {/* Read-only Section */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase">
          Thông tin cá nhân (Chỉ xem)
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 mb-3">
            <label className="block text-sm font-medium text-foreground">
              Họ và tên
            </label>
            <Input
              size="large"
              value={formData.name}
              disabled={true}
              className="text-gray-700 font-medium"
            />
          </div>
          <div className="space-y-2 mb-3">
            <label className="block text-sm font-medium text-foreground">
              Ngày sinh
            </label>
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              value={formData.birthday ? dayjs(formData.birthday) : null}
              disabled={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 mb-3">
            <label className="block text-sm font-medium text-foreground">
              Email
            </label>
            <Input size="large" value={formData.email} disabled={true} />
          </div>
          <div className="space-y-2 mb-3">
            <label className="block text-sm font-medium text-foreground">
              Số điện thoại
            </label>
            <Input size="large" value={formData.phone} disabled={true} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 mb-3">
            <label className="block text-sm font-medium text-foreground">
              Địa chỉ
            </label>
            <Input size="large" value={formData.address} disabled={true} />
          </div>
          <div className="space-y-2 mb-3">
            <label className="block text-sm font-medium text-foreground">
              Ngày gia nhập
            </label>
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              value={formData.joinedAt ? dayjs(formData.joinedAt) : null}
              disabled={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 mb-3">
            <label className="block text-sm font-medium text-foreground">
              Trình độ chuyên môn
            </label>
            <div className="pt-2">
              <Tag color="blue">
                {getMemberLevelLabel(formData.level as MemberLevel)}
              </Tag>
            </div>
          </div>
          <div className="space-y-2 mb-3">
            <label className="block text-sm font-medium text-foreground">
              Trường đào tạo
            </label>
            <Input size="large" value={formData.education} disabled={true} />
          </div>
        </div>
      </div>

      {/* Editable Section */}
      <div className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
        <h3 className="text-sm font-bold text-blue-600 mb-4 uppercase">
          Thông tin quản lý (Được phép chỉnh sửa)
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2 mb-3">
            <label className="block text-sm font-medium text-foreground">
              Chức vụ <span className="text-red-500">*</span>
            </label>
            {/* Sử dụng Select thay vì Input */}
            <Select
              size="large"
              style={{ width: "100%" }}
              value={formData.role}
              onChange={(val) => handleSelectChange("role", val)}
              options={ROLE_OPTIONS}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2 mb-3">
            <label className="block text-sm font-medium text-foreground">
              Điểm tích lũy <span className="text-red-500">*</span>
            </label>
            <Input
              size="large"
              type="number"
              name="accumulatedPoints"
              value={formData.accumulatedPoints}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  accumulatedPoints: isNaN(val) ? 0 : val,
                }));
                markAsChanged();
              }}
              placeholder="0"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <label className="block text-sm font-medium text-foreground">
            Trạng thái hoạt động <span className="text-red-500">*</span>
          </label>
          <Select
            size="large"
            style={{ width: "100%" }}
            value={formData.status}
            onChange={(val) => handleSelectChange("status", val)}
            options={STATUS_OPTIONS}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-border">
        <Button onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="primary" onClick={handleSave} loading={isLoading}>
          Cập nhật thông tin
        </Button>
      </div>
    </div>
  );
}
