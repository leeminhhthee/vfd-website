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
  /** Liên đoàn Bóng chuyền Đà Nẵng là tổ chức chuyên nghiệp quản lý và phát triển bóng chuyền tại Đà Nẵng. Với sứ mệnh thúc đẩy phong trào bóng chuyền địa phương, liên đoàn tổ chức các giải đấu, chương trình huấn luyện, và tuyển chọn tài năng trẻ, góp phần đưa bóng chuyền Đà Nẵng vươn tầm quốc gia và quốc tế. | The Volleyball Federation of Da Nang is a professional organization dedicated to managing and developing volleyball in Da Nang. With a mission to promote local volleyball activities, the federation organizes tournaments, training programs, and talent scouting, contributing to elevating Da Nang volleyball to national and international levels. */
  textAboutUs: string;
  /** Liên Kết Nhanh | Quick Links */
  quickLinks: string;
  /** Lịch Thi Đấu | Schedule */
  schedule: string;
  /** Đăng Ký | Register */
  register: string;
  /** Liên Hệ | Contact */
  contact: string;
  /** Các tài liệu, quy định và hướng dẫn từ Liên đoàn | Documents, regulations, and guidelines from the Federation */
  resourceText: string;
  /** Liên Hệ Với Chúng Tôi | Contact Us */
   contactUs: string;
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
  /** Thư viện ảnh | Photo Gallery */
  photoGallery: string;
  /** Không tìm thấy Album | Album not found */
  albumNotFound: string;
  /** Quay lại thư viện ảnh | Back to photo gallery */
  backToGallery: string;
  /** Xem thêm | See more */
  seeMore: string;
  /** Có lỗi xảy ra khi tải ảnh | An error occurred while loading images */
  loadingImageError: string;
  /** Hiện chưa có ảnh cho mục này. | No photos available for this section. */
  noPhotosAvailable: string;
  /** Xem thêm tất cả | See all */
  seeAll: string;
  /** Đội | Team */
  team: string;
  /** Giải đấu TP | City Tournament */
  cityTournament: string;
  /** Hoạt động khác | Other Activities */
  otherActivities: string;
  /** Chia sẻ | Share */
  share: string;
  /** Đối tác - Tài trợ | Partners - Sponsors */
  partnersSponsors: string;
  /** Cập nhật những thông tin mới nhất từ Liên đoàn Bóng chuyền TP Đà Nẵng | Stay updated with the latest news from the Volleyball Federation of Da Nang City */
  contentNewsTab: string;
  /** Không có tin tức liên quan | No related news */
  noRelatedNews: string;
  /** Nguồn | Source */
  source: string;
  /** ✓ Đã lưu | ✓ Bookmarked */
  bookMarked: string;
  /** Lưu bài viết | Save Article */
  saveArticle: string;
  /** Nổi bật | Featured */
  featured: string;
  /** Tin liên quan | Related News */
  relatedNews: string;
  /** Về Liên đoàn Bóng chuyền TP Đà Nẵng | About the Volleyball Federation of Da Nang City */
  aboutVFD: string;
  /** Liên đoàn Bóng chuyền TP Đà Nẵng là tổ chức chuyên quản lý, phát triển và nâng cao trình độ bóng chuyền tại thành phố Đà Nẵng. Chúng tôi cam kết tổ chức các giải đấu chuyên nghiệp, phát triển tài năng trẻ và nâng cao chất lượng bóng chuyền Việt Nam. | The Volleyball Federation of Da Nang City is a professional organization dedicated to managing, developing, and enhancing the level of volleyball in Da Nang City. We are committed to organizing professional tournaments, nurturing young talent, and improving the quality of Vietnamese volleyball. */
  textAboutVFD: string;
  /** Ban lãnh đạo Liên đoàn Bóng chuyền thành phố Đà Nẵng | Board of Directors of the Volleyball Federation of Da Nang City */
  boardDirectorsVFD: string;
  /** Ông/Bà | Mr./Ms. */
  mrMs: string;
  /** Our Value | Our Value */
  ourValue: string;
  /** GIÁ TRỊ CHÚNG TÔI HƯỚNG ĐẾN | THE VALUES WE AIM FOR */
  valueWeAimFor: string;
  /** Đối tượng tác động | Affected Objects */
  affectedObjects: string;
  /** Đã xảy ra lỗi khi tải dữ liệu | An error occurred while loading data */
  loadingError: string;
  /** Giải đấu | Tournament */
  tournament: string;
  /** Lịch thi đấu và kết quả các giải đấu | Schedule and results of tournaments */
  scheduleResultsOfTournament: string;
  /** Giải đấu sắp tới | Upcoming Tournaments */
  upcomingTournaments: string;
  /** Chưa có giải đấu nào sắp diễn ra | No upcoming tournaments available */
  noUpcomingTournaments: string;
  /** Xem chi tiết | View Details */
  viewDetails: string;
  /** Xem tất cả lịch thi đấu | View all schedules */
  viewAllSchedules: string;
  /** Không có lịch thi đấu nào | No schedules found */
  noSchedulesFound: string;
  /** Ngày bắt đầu | Start Date */
  startDate: string;
  /** Ngày kết thúc | End Date */
  endDate: string;
  /** Địa điểm | Location */
  location: string;
  /** Tài liệu liên quan | Related Documents */
  relatedDocuments: string;
  /** Đăng ký giải đấu | Register for Tournament */
  registerTournament: string;
  /** Giải đấu đã bắt đầu/kết thúc | Tournament has started/ended */
  tournamentStartedEnded: string;
  /** Đăng ký chưa mở | Registration not yet open */
  registrationNotOpen: string;
  /** Lịch thi đấu đã có (Ngừng đăng ký) | Tournament schedule is available (Registration closed) */
  scheduleImageAvailable: string;
  /** Kết quả giải đấu | Tournament Results */
  tournamentResults: string;
  /** STT | No. */
  index: string;
  /** Ngày - Giờ | Date - Time */
  dateTime: string;
  /** Tỉ số | Score */
  score: string;
  /** Không tìm thấy tin tức nào | No news found */
  noNewsFound: string;
  /** Giải đấu liên quan | Related Tournaments */
  relatedTournaments: string;
};
