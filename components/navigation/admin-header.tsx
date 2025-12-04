"use client";
import { authenticationInteractor } from "@/data/datasource/authentication/interactor/authentication.interactor";
import { LogOut, Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, MenuProps, Modal } from "antd";
import { Menu as MenuIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");


  const handleLogout = async () => {
    try {
      await authenticationInteractor.logout();
    } catch (e) {
      // backend có thể đã hết token → vẫn logout frontend
      console.warn("Logout API failed, force logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("accessToken");

      router.replace("/login");
    }
  };

  const router = useRouter();

  const user = {
    name: "Admin",
    avatar: "",
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        router.push("/login");
      },
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      onClick: () => router.push("/admin/profile"),
    },
    {
      key: "settings",
      label: "Cài đặt tài khoản",
      icon: <SettingOutlined />,
      onClick: () => router.push("/admin/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-10">
      <div className="flex justify-between items-center h-16 px-6">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MenuIcon size={24} className="text-gray-600" />
        </button>

        <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-gray-700">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">Quản trị viên</div>
            </div>

            <Avatar
              size="large"
              src={user.avatar || undefined}
              icon={!user.avatar && <UserOutlined />}
              className="bg-blue-500"
            >
              {user.name?.charAt(0)?.toUpperCase()}
            </Avatar>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
