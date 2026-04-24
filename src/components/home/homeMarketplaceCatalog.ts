export type HomeCatalogKey =
  | 'potatoes'
  | 'beans'
  | 'maize'
  | 'bananas'
  | 'tomatoes'
  | 'cabbage'

export const HOME_PRODUCT_ORDER: HomeCatalogKey[] = [
  'potatoes',
  'beans',
  'maize',
  'bananas',
  'tomatoes',
  'cabbage',
]

export const HOME_LIVE_PRODUCT_ORDER: HomeCatalogKey[] = [
  'potatoes',
  'beans',
  'maize',
  'cabbage',
  'tomatoes',
]

type HomeProductVisualConfig = {
  image: string
  location: string
  price: number
  quantity: number
}

const HOME_PRODUCT_VISUALS: Record<HomeCatalogKey, HomeProductVisualConfig> = {
  potatoes: {
    image: '/home-products/potatoes.png',
    location: 'Musanze',
    price: 300,
    quantity: 200,
  },
  beans: {
    image: '/home-products/beans.png',
    location: 'Huye',
    price: 450,
    quantity: 50,
  },
  maize: {
    image: '/home-products/maize.png',
    location: 'Rubavu',
    price: 250,
    quantity: 120,
  },
  bananas: {
    image: '/home-products/bananas.png',
    location: 'Nyagatare',
    price: 350,
    quantity: 100,
  },
  tomatoes: {
    image: '/home-products/tomatoes.png',
    location: 'Kigali',
    price: 500,
    quantity: 60,
  },
  cabbage: {
    image: '/home-products/cabbage.png',
    location: 'Gicumbi',
    price: 200,
    quantity: 80,
  },
}

const PRODUCT_KEYWORDS: Record<HomeCatalogKey, string[]> = {
  potatoes: ['ibirayi', 'potato', 'potatoes', 'irish potato'],
  beans: ['ibishyimbo', 'bean', 'beans'],
  maize: ['ibigori', 'maize', 'corn'],
  bananas: ['imbananira', 'banana', 'bananas', 'plantain'],
  tomatoes: ['inyanya', 'tomato', 'tomatoes'],
  cabbage: ['amashu', 'cabbage', 'kale'],
}

function normalizeProductName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function getHomeProductKey(
  productName?: string,
  fallbackIndex = 0
): HomeCatalogKey {
  const normalized = productName ? normalizeProductName(productName) : ''

  if (normalized) {
    const match = HOME_PRODUCT_ORDER.find((key) =>
      PRODUCT_KEYWORDS[key].some((keyword) => normalized.includes(keyword))
    )

    if (match) {
      return match
    }
  }

  return HOME_PRODUCT_ORDER[fallbackIndex % HOME_PRODUCT_ORDER.length]
}

export function getHomeProductVisual(
  productName?: string,
  fallbackIndex = 0
) {
  const key = getHomeProductKey(productName, fallbackIndex)

  return {
    key,
    ...HOME_PRODUCT_VISUALS[key],
  }
}
