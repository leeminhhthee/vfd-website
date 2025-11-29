import { Modal } from 'antd';
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function confirmUnsavedChanges(onOk: () => void) {
  Modal.confirm({
    title: "Bạn có chắc chắn muốn thoát?",
    content: "Những thay đổi chưa được lưu sẽ bị mất.",
    okText: "Thoát",
    okType: "danger",
    cancelText: "Tiếp tục chỉnh sửa",
    onOk,
  });
}
