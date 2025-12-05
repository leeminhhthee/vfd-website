
const formatDateSafe = (dateString: string) => {
  if (!dateString) return "";
  
  // Xử lý trường hợp chuỗi có microseconds (6 số lẻ) gây lỗi trên Safari/Mobile
  // Ví dụ: 2025-12-04T20:01:18.189729 -> cắt về 2025-12-04T20:01:18.189
  let cleanDateString = dateString;
  if (dateString.includes(".") && dateString.length > 23) {
     // Giữ lại tối đa 3 số sau dấu chấm (milliseconds)
     // Regex này tìm phần giây thập phân và cắt bớt
     cleanDateString = dateString.replace(/(\.\d{3})\d+/, "$1"); 
  }

  const date = new Date(cleanDateString);
  
  // Kiểm tra nếu date không hợp lệ
  if (isNaN(date.getTime())) return "Lỗi ngày";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit", // Bỏ comment nếu muốn hiện cả giờ
    minute: "2-digit"
  });
};

export default formatDateSafe;