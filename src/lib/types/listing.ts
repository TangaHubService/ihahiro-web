export type ProductNameKey =
  | "potatoes"
  | "beans"
  | "maize"
  | "bananas"
  | "tomatoes"
  | "cabbage"
  | "cassava"
  | "avocado"
  | "rice"
  | "sweetPotatoes"
  | "onions"
  | "carrots";

export type ListingCategory =
  | "grains"
  | "legumes"
  | "vegetables"
  | "fruits"
  | "tubers"
  | "other";

export interface Seller {
  id: string;
  displayName: string;
  locationLabel: string;
  rating: number;
  reviewCount: number;
  memberSinceLabel: string;
  phone: string;
  whatsapp: string;
  avatarUrl: string;
}

export interface ListingSellerPreview {
  id: string;
  displayName: string;
  avatarUrl: string;
}

export interface Listing {
  id: string;
  productKey: ProductNameKey;
  category: ListingCategory;
  quantityKg: number;
  pricePerKg: number;
  currency: "RWF";
  locationLabel: string;
  province: string;
  district: string;
  cell?: string;
  description: string;
  variety: string;
  qualityLabel: string;
  deliveryNote: string;
  postedAt: string;
  isNew: boolean;
  imageUrl: string;
  galleryUrls: string[];
  seller: ListingSellerPreview;
}

export type SortOption = "newest" | "price_asc" | "price_desc";

export interface ListingFilters {
  q: string;
  location: string;
  category: ListingCategory | "all";
  minPrice?: number;
  maxPrice?: number;
  sort: SortOption;
  page: number;
  pageSize: number;
}

export interface PaginatedListings {
  items: Listing[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
