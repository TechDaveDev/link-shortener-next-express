export interface ShortLink {
  id: number;
  url: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
  shortUrl: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LinksApiResponse {
  data: ShortLink[];
  pagination: PaginationInfo;
}

export interface Stats {
  totalLinks: number;
  totalClicks: number;
}