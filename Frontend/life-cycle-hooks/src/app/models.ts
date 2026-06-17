// Interface: Định nghĩa cấu trúc dữ liệu
export interface Activity {
  id: number;
  name: string;
  category: string;
  score: number;
}

// Generic: Khuôn mẫu dùng chung (T có thể là bất kỳ kiểu gì)
export interface ApiResponse<T> {
  data: T;
  message?: string;
}