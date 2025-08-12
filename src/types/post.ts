export interface Post {
  id: string;
  postRank: string;
  postType: string;
  thumbnailUrl: string;
  realEstateType: string;
  title: string;
  content?: string; // Optional vì API có thể không trả về
  status: string;
  createdAt: string;
  price: number;
  direction: string;
  square: number;
  length?: number;
  width?: number;
  streetWidth?: number | null;
  legal?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floors?: number | null;
  yearBuilt?: string;
  diningRoom: boolean;
  kitchen: boolean;
  rooftop: boolean;
  carPark: boolean;
  owner?: boolean;
  imageUrls?: string[] | null;
}

export interface PostSummary {
  id: string;
  postRank: string;
  postType: string;
  thumbnailUrl: string;
  realEstateType: string;
  title: string;
  status: string;
  createdAt: string;
  price: number;
  direction: string;
  square: number;
  streetWidth?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floors?: number | null;
  diningRoom: boolean;
  kitchen: boolean;
  rooftop: boolean;
  carPark: boolean;
  imageUrls?: string[] | null;
}

export interface CreatePostData {
  postRank: string;
  postType: string;
  thumbnailUrl: string;
  realEstateType: string;
  title: string;
  content: string;
  price?: number | null;
  direction?: string | null;
  square?: number | null;
  length?: number | null;
  width?: number | null;
  streetWidth?: number | null;
  legal?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floors?: number | null;
  yearBuilt?: string | null;
  diningRoom: boolean;
  kitchen: boolean;
  rooftop: boolean;
  carPark: boolean;
  owner: boolean;
  imageUrls: string[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  images?: string[];
}

// API Response wrapper
export interface ApiResponse<T> {
  code: number;
  message: string;
  status: string;
  data: T;
}

export interface PostListData {
  items: PostSummary[];
  page: number;
  total: number;
  totalPage: number;
  hasMore: boolean;
}

export type PostListResponse = ApiResponse<PostListData>;

export type SinglePostResponse = ApiResponse<Post>;
