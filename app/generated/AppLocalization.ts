/* Auto-generated. Do not edit manually. */

import vi from "../../i18n/locales/vi.json";
import en from "../../i18n/locales/en.json";

export type Lang = "vi" | "en";

let currentLang: Lang = "vi"; // default = Vietnamese

const translations: Record<Lang, Record<string, string>> = { vi, en };

export const setLanguage = (lang: Lang) => {
  currentLang = lang;
};

type TranslationKeys = keyof typeof vi;

export const trans = new Proxy(
  {},
  {
    get: (_, key: string) => translations[currentLang][key] || key,
  }
) as {
  /** Trang Chủ | Home */
  home: string;
  /** Tin Tức | News */
  news: string;
  /** Tài Liệu | Resources */
  resources: string;
  /** Lịch Thi Đấu - Kết Quả | Schedule & Results */
  scheduleAndResults: string;
  /** Photo | Photo */
  photo: string;
  /** Dự Án | Project */
  project: string;
  /** Giới Thiệu | Introduction */
  introduction: string;
  /** Về chúng tôi | About Us */
  aboutUs: string;
  /** Liên đoàn Bóng chuyền Đà Nẵng là tổ chức chuyên nghiệp quản lý và phát triển bóng chuyền tại Đà Nẵng. Với sứ mệnh thúc đẩy phong trào bóng chuyền địa phương, liên đoàn tổ chức các giải đấu, chương trình huấn luyện, và tuyển chọn tài năng trẻ, góp phần đưa bóng chuyền Đà Nẵng vươn tầm quốc gia và quốc tế | The Volleyball Federation of Da Nang is a professional organization dedicated to managing and developing volleyball in Da Nang. With a mission to promote local volleyball activities, the federation organizes tournaments, training programs, and talent scouting, contributing to elevating Da Nang volleyball to national and international levels. */
  textAboutUs: string;
  /** Liên Kết Nhanh | Quick Links */
  quickLinks: string;
  /** Lịch Thi Đấu | Schedule */
  schedule: string;
  /** Đăng Ký | Register */
  register: string;
  /** Liên Hệ | Contact */
  contact: string;
  /** 0914 279 073 | 0914 279 073 */
  contactPhone: string;
  /** ldbongchuyendn@gmail.com | ldbongchuyendn@gmail.com */
  contactEmail: string;
  /** 212 Văn Tiến Dũng, Phường Hòa Xuân, TP. Đà Nẵng | 212 Van Tien Dung, Hoa Xuan Ward, Da Nang City */
  contactAddress: string;
  /** Theo Dõi Chúng Tôi | Follow Us */
  followUs: string;
  /** Copyright  | Copyright  */
  copyRight: string;
  /**  2025 Liên đoàn Bóng chuyền TP Đà Nẵng |  2025 Volleyball Federation of Da Nang City */
  copyRightAuthor: string;
  /** Liên đoàn Bóng chuyền TP Đà Nẵng | Volleyball Federation of Da Nang City */
  volleyFederDN: string;
  /** Liên đoàn Bóng chuyền Thành Phố Đà Nẵng | Volleyball Federation of Da Nang City */
  volleyballFederationDanang: string;
  /** Chào mừng đến với website của chúng tôi | Welcome to our website */
  welcome: string;
  /** Đang tải... | Loading... */
  loading: string;
  /** Không thể tải tin tức | Unable to load news */
  newsLoadingError: string;
  /** Tin tức mới nhất | Latest News */
  latestNews: string;
  /** Cập nhật những thông tin mới nhất từ Liên đoàn | Stay updated with the latest news from the Federation */
  updateNewFromFederation: string;
  /** Đọc thêm → | Read more → */
  readMore: string;
  /** Xem tất cả | View all */
  viewAll: string;
  /** Chúng tôi xây dựng các chương trình trình với nhiều hình thức khác nhau và tập trung vào việc thúc đẩy hoạt động bóng chuyền, thể chất, xây dựng phát triển thể thao cộng đồng và kết nối xã hội và tạo cơ hội phát triển thể chất vì thành phố Đà Nẵng khỏe mạnh. | We develop programs in various formats focusing on promoting volleyball activities, physical fitness, community sports development, social connection, and creating opportunities for a healthier Da Nang city. */
  programDescription: string;
  /** Không thể tải dữ liệu | Unable to load data */
  unableToLoadData: string;
};
