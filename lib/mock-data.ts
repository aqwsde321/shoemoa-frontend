import type { Product, CartItem } from "./types";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Nike Air Max 270",
    brand: "Nike",
    price: 189000,
    color: "Black",
    thumbnailUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    description: "편안함과 스타일을 동시에 갖춘 나이키 에어맥스 270",
    createdAt: "2025-01-01",
  },
  {
    id: 2,
    name: "Adidas Ultraboost 22",
    brand: "Adidas",
    price: 219000,
    color: "White",
    thumbnailUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
    description: "뛰어난 쿠셔닝으로 완벽한 착화감",
    createdAt: "2025-01-02",
  },
  {
    id: 3,
    name: "New Balance 990v5",
    brand: "New Balance",
    price: 269000,
    color: "Gray",
    thumbnailUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=400&fit=crop",
    description: "클래식한 디자인의 뉴발란스 990",
    createdAt: "2025-01-03",
  },
  {
    id: 4,
    name: "Converse Chuck 70",
    brand: "Converse",
    price: 95000,
    color: "Black",
    thumbnailUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=400&fit=crop",
    description: "언제나 사랑받는 클래식 컨버스",
    createdAt: "2025-01-04",
  },
  {
    id: 5,
    name: "Vans Old Skool",
    brand: "Vans",
    price: 79000,
    color: "Black/White",
    thumbnailUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=400&fit=crop",
    description: "스케이트보더의 아이콘, 반스 올드스쿨",
    createdAt: "2025-01-05",
  },
  {
    id: 6,
    name: "Nike Dunk Low",
    brand: "Nike",
    price: 139000,
    color: "White/Black",
    thumbnailUrl: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&h=400&fit=crop",
    description: "트렌디한 스타일의 나이키 덩크 로우",
    createdAt: "2025-01-06",
  },
  {
    id: 7,
    name: "Jordan 1 Retro High",
    brand: "Jordan",
    price: 199000,
    color: "Red/Black",
    thumbnailUrl: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400&h=400&fit=crop",
    description: "농구의 전설, 에어 조던 1 레트로 하이",
    createdAt: "2025-01-07",
  },
  {
    id: 8,
    name: "Asics Gel-Kayano 29",
    brand: "Asics",
    price: 189000,
    color: "Blue",
    thumbnailUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
    description: "안정성과 편안함의 아식스 젤-카야노",
    createdAt: "2025-01-08",
  },
];

export const mockCartItems: CartItem[] = [
  {
    id: 1,
    productId: 1,
    product: mockProducts[0],
    quantity: 1,
    selectedSize: "270",
    selectedColor: "Black",
  },
  {
    id: 2,
    productId: 3,
    product: mockProducts[2],
    quantity: 2,
    selectedSize: "265",
    selectedColor: "Gray",
  },
];

export const AVAILABLE_SIZES = ["240", "245", "250", "255", "260", "265", "270", "275", "280", "285", "290"];

export const AVAILABLE_COLORS = ["Black", "White", "Gray", "Red", "Blue", "Black/White", "White/Black", "Red/Black"];
