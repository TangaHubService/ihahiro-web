import type {
  Listing,
  ListingFilters,
  PaginatedListings,
} from "@/lib/types/listing";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MOCK_LISTINGS_RAW: Omit<Listing, "seller">[] = [
  {
    id: "1",
    productKey: "potatoes",
    category: "tubers",
    quantityKg: 200,
    pricePerKg: 300,
    currency: "RWF",
    locationLabel: "Nyabugogo, Kigali",
    province: "Kigali",
    district: "Nyarugenge",
    cell: "Nyabugogo",
    description:
      "Fresh highland potatoes, sorted and bagged. Ideal for households and small retailers.",
    variety: "Gikondo",
    qualityLabel: "Good",
    deliveryNote: "Pickup or motorbike within Kigali.",
    postedAt: "2024-12-12",
    isNew: true,
    imageUrl:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80",
      "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&q=80",
    ],
  },
  {
    id: "2",
    productKey: "beans",
    category: "legumes",
    quantityKg: 120,
    pricePerKg: 450,
    currency: "RWF",
    locationLabel: "Musanze, Northern Province",
    province: "Northern Province",
    district: "Musanze",
    description: "Clean red beans, sun-dried and hand-sorted.",
    variety: "Local mix",
    qualityLabel: "Good",
    deliveryNote: "Bulk bags available.",
    postedAt: "2024-12-10",
    isNew: true,
    imageUrl:
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&q=80",
    ],
  },
  {
    id: "3",
    productKey: "maize",
    category: "grains",
    quantityKg: 500,
    pricePerKg: 250,
    currency: "RWF",
    locationLabel: "Huye, Southern Province",
    province: "Southern Province",
    district: "Huye",
    description: "Dry maize grain, stored in a clean silo.",
    variety: "Yellow",
    qualityLabel: "Good",
    deliveryNote: "Truck load possible.",
    postedAt: "2024-12-08",
    isNew: false,
    imageUrl:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80",
    ],
  },
  {
    id: "4",
    productKey: "bananas",
    category: "fruits",
    quantityKg: 150,
    pricePerKg: 350,
    currency: "RWF",
    locationLabel: "Rubavu, Western Province",
    province: "Western Province",
    district: "Rubavu",
    description: "Matoke bunches, harvested this week.",
    variety: "Matoke",
    qualityLabel: "Excellent",
    deliveryNote: "Early morning pickup.",
    postedAt: "2024-12-11",
    isNew: true,
    imageUrl:
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&q=80",
    ],
  },
  {
    id: "5",
    productKey: "tomatoes",
    category: "vegetables",
    quantityKg: 80,
    pricePerKg: 400,
    currency: "RWF",
    locationLabel: "Bugesera, Eastern Province",
    province: "Eastern Province",
    district: "Bugesera",
    description: "Vine-ripened tomatoes for markets and kitchens.",
    variety: "Roma",
    qualityLabel: "Good",
    deliveryNote: "Crates of 15kg.",
    postedAt: "2024-12-09",
    isNew: false,
    imageUrl:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
    ],
  },
  {
    id: "6",
    productKey: "cabbage",
    category: "vegetables",
    quantityKg: 60,
    pricePerKg: 200,
    currency: "RWF",
    locationLabel: "Muhanga, Southern Province",
    province: "Southern Province",
    district: "Muhanga",
    description: "Firm heads, minimal outer leaves trimmed.",
    variety: "Green",
    qualityLabel: "Good",
    deliveryNote: "Wholesale only.",
    postedAt: "2024-12-07",
    isNew: false,
    imageUrl:
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=800&q=80",
    ],
  },
  {
    id: "7",
    productKey: "cassava",
    category: "tubers",
    quantityKg: 300,
    pricePerKg: 180,
    currency: "RWF",
    locationLabel: "Kayonza, Eastern Province",
    province: "Eastern Province",
    district: "Kayonza",
    description: "Fresh cassava roots, peeled on request.",
    variety: "Local",
    qualityLabel: "Good",
    deliveryNote: "Farm gate pickup.",
    postedAt: "2024-12-06",
    isNew: false,
    imageUrl:
      "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80",
    ],
  },
  {
    id: "8",
    productKey: "avocado",
    category: "fruits",
    quantityKg: 40,
    pricePerKg: 600,
    currency: "RWF",
    locationLabel: "Rusizi, Western Province",
    province: "Western Province",
    district: "Rusizi",
    description: "Hass-type avocados, ready in 3–5 days.",
    variety: "Hass",
    qualityLabel: "Excellent",
    deliveryNote: "Small batches for hotels.",
    postedAt: "2024-12-05",
    isNew: true,
    imageUrl:
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80",
    ],
  },
  {
    id: "9",
    productKey: "rice",
    category: "grains",
    quantityKg: 1000,
    pricePerKg: 900,
    currency: "RWF",
    locationLabel: "Kirehe, Eastern Province",
    province: "Eastern Province",
    district: "Kirehe",
    description: "Milled rice, 50kg bags available.",
    variety: "Long grain",
    qualityLabel: "Good",
    deliveryNote: "Warehouse pickup.",
    postedAt: "2024-12-04",
    isNew: false,
    imageUrl:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
    ],
  },
  {
    id: "10",
    productKey: "sweetPotatoes",
    category: "tubers",
    quantityKg: 90,
    pricePerKg: 280,
    currency: "RWF",
    locationLabel: "Nyanza, Southern Province",
    province: "Southern Province",
    district: "Nyanza",
    description: "Orange sweet potatoes, great for schools and canteens.",
    variety: "Orange",
    qualityLabel: "Good",
    deliveryNote: "Flexible delivery.",
    postedAt: "2024-12-03",
    isNew: false,
    imageUrl:
      "https://images.unsplash.com/photo-1596097635121-14b63a7a1384?w=800&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1596097635121-14b63a7a1384?w=800&q=80",
    ],
  },
  {
    id: "11",
    productKey: "onions",
    category: "vegetables",
    quantityKg: 70,
    pricePerKg: 350,
    currency: "RWF",
    locationLabel: "Gasabo, Kigali",
    province: "Kigali",
    district: "Gasabo",
    description: "Red onions, cured and dry.",
    variety: "Red",
    qualityLabel: "Good",
    deliveryNote: "Market delivery Fridays.",
    postedAt: "2024-12-02",
    isNew: false,
    imageUrl:
      "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&q=80",
    ],
  },
  {
    id: "12",
    productKey: "carrots",
    category: "vegetables",
    quantityKg: 55,
    pricePerKg: 320,
    currency: "RWF",
    locationLabel: "Karongi, Western Province",
    province: "Western Province",
    district: "Karongi",
    description: "Washed carrots, uniform sizing.",
    variety: "Nantes",
    qualityLabel: "Excellent",
    deliveryNote: "Cold chain friendly packing.",
    postedAt: "2024-12-01",
    isNew: false,
    imageUrl:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80",
    galleryUrls: [
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&q=80",
    ],
  },
];

const MOCK_SELLERS: Record<string, import("@/lib/types/listing").Seller> = {
  s1: {
    id: "s1",
    displayName: "Mukamwiza Jean",
    locationLabel: "Kigali, Nyarugenge",
    rating: 4.8,
    reviewCount: 32,
    memberSinceLabel: "Jan 2023",
    phone: "+250788123456",
    whatsapp: "250788123456",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  s2: {
    id: "s2",
    displayName: "Uwase Diane",
    locationLabel: "Musanze, Northern Province",
    rating: 4.6,
    reviewCount: 18,
    memberSinceLabel: "Mar 2023",
    phone: "+250788234567",
    whatsapp: "250788234567",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  s3: {
    id: "s3",
    displayName: "Nkurunziza Eric",
    locationLabel: "Huye, Southern Province",
    rating: 4.9,
    reviewCount: 41,
    memberSinceLabel: "Jun 2022",
    phone: "+250788345678",
    whatsapp: "250788345678",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
};

function sellerForListing(id: string): import("@/lib/types/listing").Seller {
  const key = (Number(id) % 3) + 1;
  return MOCK_SELLERS[`s${key}`] ?? MOCK_SELLERS.s1;
}

function sellerPreviewForListing(id: string): Listing["seller"] {
  const s = sellerForListing(id);
  return {
    id: s.id,
    displayName: s.displayName,
    avatarUrl: s.avatarUrl,
  };
}

function attachSeller(listing: Omit<Listing, "seller">): Listing {
  return { ...listing, seller: sellerPreviewForListing(listing.id) };
}

const MOCK_LISTINGS: Listing[] = MOCK_LISTINGS_RAW.map(attachSeller);

export async function fetchListings(
  filters: ListingFilters,
): Promise<PaginatedListings> {
  await delay(220);
  let rows = [...MOCK_LISTINGS];

  const q = filters.q.trim().toLowerCase();
  if (q) {
    rows = rows.filter((row) => {
      const blob = `${row.productKey} ${row.locationLabel} ${row.description}`.toLowerCase();
      return blob.includes(q);
    });
  }

  const loc = filters.location.trim().toLowerCase();
  if (loc) {
    rows = rows.filter((row) => row.locationLabel.toLowerCase().includes(loc));
  }

  if (filters.category !== "all") {
    rows = rows.filter((row) => row.category === filters.category);
  }

  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  if (minPrice != null) {
    rows = rows.filter((row) => row.pricePerKg >= minPrice);
  }
  if (maxPrice != null) {
    rows = rows.filter((row) => row.pricePerKg <= maxPrice);
  }

  if (filters.sort === "price_asc") {
    rows.sort((a, b) => a.pricePerKg - b.pricePerKg);
  } else if (filters.sort === "price_desc") {
    rows.sort((a, b) => b.pricePerKg - a.pricePerKg);
  } else {
    rows.sort((a, b) => (a.postedAt < b.postedAt ? 1 : -1));
  }

  const total = rows.length;
  const start = (filters.page - 1) * filters.pageSize;
  const items = rows.slice(start, start + filters.pageSize);
  const hasMore = start + items.length < total;

  return {
    items,
    total,
    page: filters.page,
    pageSize: filters.pageSize,
    hasMore,
  };
}

export async function fetchListingById(id: string): Promise<Listing | null> {
  await delay(180);
  return MOCK_LISTINGS.find((l) => l.id === id) ?? null;
}

export async function fetchSellerForListing(
  listingId: string,
): Promise<import("@/lib/types/listing").Seller> {
  await delay(80);
  return sellerForListing(listingId);
}

export async function fetchRelatedListings(
  listingId: string,
  limit = 4,
): Promise<Listing[]> {
  await delay(120);
  const current = MOCK_LISTINGS.find((l) => l.id === listingId);
  const pool = MOCK_LISTINGS.filter((l) => l.id !== listingId);
  const same = current
    ? pool.filter((l) => l.category === current.category)
    : pool;
  const pick = same.length >= limit ? same : pool;
  return pick.slice(0, limit);
}
