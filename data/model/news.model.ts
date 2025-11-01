export interface NewsItem {
  id: number;
  title: string;
  type: string;
  content: string;
  status: string;
  author_id: number;
  image_url: string;
  created_at: string;
  updated_at?: string | null;
}
