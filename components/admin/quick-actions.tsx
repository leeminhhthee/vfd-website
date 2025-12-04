"use client";

import { FileCheck, FilePlus, Plus } from "lucide-react";
import Link from "next/link";
import React from "react";

type QuickAction = {
  label: string;
  icon: React.ElementType;
  href: string;
  color: string;
};

const actions: QuickAction[] = [
  {
    label: "Tạo giải đấu mới",
    icon: Plus,
    href: "/admin/tournaments",
    color: "text-blue-600 bg-blue-100",
  },
  {
    label: "Đăng tin mới",
    icon: FilePlus,
    href: "/admin/news",
    color: "text-green-600 bg-green-100",
  },
  {
    label: "Duyệt hồ sơ",
    icon: FileCheck,
    href: "/admin/registrations",
    color: "text-orange-600 bg-orange-100",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Tác vụ nhanh
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              href={action.href}
              key={action.label}
              className="flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-150"
            >
              <div className={`${action.color} p-2 rounded-lg mr-4`}>
                <Icon size={20} />
              </div>

              <span className="font-medium text-foreground">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
