import { getScheduleStatusLabel, ScheduleStatus } from '@/data/constants/constants';
import { Modal } from 'antd';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface UploadResult {
  link: string;
  size: number;
}

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

/**
 * Upload file lên API local (để đẩy qua Cloudinary)
 * @param file File ảnh cần upload
 * @param apiUrl Đường dẫn API upload (mặc định là /api/upload)
 * @returns Promise trả về object chứa link và size
 */
export async function uploadFile(file: File, apiUrl: string = "/api/upload"): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(apiUrl, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Upload thất bại");
  }

  const data = await res.json();

  // API route của bạn trả về { link: "..." }
  return {
    link: data.link,
    size: data.size
  };
}

/**
 * Format kích thước file từ bytes sang KB, MB, GB
 * @param bytes 
 * @returns 
 */

export const formatFileSize = (kb?: number) => {
  if (!kb) return 0;
  const MB = kb / 1024;
  return Number(MB.toFixed(2));
};


/**
 * Format date để hiển thị trong input type="date"
 * @param date 
 * @returns 
 */
export const formatDateForInput = (date?: Date | string | null) => {
  if (!date) return "";
  const d = new Date(date);
  // Kiểm tra nếu date không hợp lệ
  if (isNaN(d.getTime())) return "";
  // Lấy ra YYYY-MM-DD theo giờ quốc tế hoặc local tùy logic dự án
  // Cách an toàn nhất để lấy YYYY-MM-DD từ Date object:
  return d.toISOString().split("T")[0];
};

/**
 * Helper tính trạng thái dựa trên ngày bắt đầu và kết thúc
 * @param startDate 
 * @param endDate 
 * @returns
 */
export const getStatus = (startDate: Date | string, endDate: Date | string) => {
  const now = new Date();
  const start = new Date(startDate);
  // Set end date to end of day to be inclusive
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  if (now < start) return getScheduleStatusLabel(ScheduleStatus.COMING);
  if (now > end) return getScheduleStatusLabel(ScheduleStatus.ENDED);
  return getScheduleStatusLabel(ScheduleStatus.ONGOING);
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case ScheduleStatus.COMING:
      return "blue";
    case ScheduleStatus.ONGOING:
      return "green";
    case ScheduleStatus.ENDED:
      return "default";
    case ScheduleStatus.POSTPONED:
      return "orange";
    default:
      return "default";
  }
};

export function formatCurrencyVND(amount: number): string {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

/**
 * Check if phone number is valid Vietnam phone number
 * Must be 10 digits and start with 0
 * @param phone 
 * @returns 
 */
export const isValidVietnamPhoneNumber = (phone: string) => {
  const phoneRegex = /^(0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5|8|9]|9[0-4|6-9])[0-9]{7}$/;
  return phoneRegex.test(phone);
};

/**
 * Check if email is valid
 * @param email 
 * @returns 
 */
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Extract plain text from HTML string
 * Removes all HTML tags including images and returns only text content
 * @param html HTML string to extract text from
 * @returns Plain text without HTML tags
 */
export const extractPlainText = (html: string): string => {
  if (typeof window === "undefined") return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};