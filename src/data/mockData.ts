import type {
  Category,
  CustomerProfile,
  FlashDeal,
  JointBuyPool,
  Order,
  Product,
  WholesalerProfile,
} from "@/types";

const IMG = {
  hero: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/hero-market-ea266d30-1789323634214.webp",
  rice: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-rice-dbe99fb2-1789323634080.webp",
  beans: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-beans-1c5f9e31-1789323633433.webp",
  yam: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-yam-847f4f68-1789323632784.webp",
  cassava: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-cassava-7a53bb5e-1789323632869.webp",
  palmoil: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-palmoil-932fa6e8-1789323636609.webp",
  peppers: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-peppers-9654d5bf-1789323636876.webp",
  ginger: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-ginger-35ee6cb9-1789323637778.webp",
  garri: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-garri-3e7efd12-1789323638530.webp",
  egusi: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-egusi-9ab1dd08-1789323637507.webp",
  chicken: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-chicken-8065fdd2-1789323640309.webp",
  fish: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-fish-81e2cdcf-1789323641558.webp",
  tomatoes: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-tomatoes-a4af7ccf-1789323641317.webp",
  groundnut: "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-groundnut-8ce50e54-1789323641731.webp",
};

export const HERO_IMAGE = IMG.hero;

export const CATEGORIES: Category[] = [
  { slug: "grains", label: "Grains & Cereals" },
  { slug: "tubers", label: "Tubers & Roots" },
  { slug: "oils-spices", label: "Oils & Spices" },
  { slug: "livestock", label: "Livestock" },
  { slug: "frozen", label: "Frozen & Fish" },
  { slug: "bulk", label: "Bulk Items" },
];

export const ZONES = [
  "Ikeja Zone",
  "Yaba Zone",
  "Lekki Zone",
  "Mile 12 Zone",
  "Bodija Zone",
  "Dawanau Zone",
];

export const WHOLESALERS: WholesalerProfile[] = [
  { id: "w1", name: "Alhaji Musa Bello", company: "Kano Grains Ltd", supplierId: "KGL-2291", marketHub: "Dawanau Market, Kano", phone: "0803 411 2291", approved: true, rating: 4.8 },
  { id: "w2", name: "Chief Emeka Obi", company: "Benue Harvest Co", supplierId: "BHC-1180", marketHub: "Mile 12 Market, Lagos", phone: "0806 220 1180", approved: true, rating: 4.6 },
  { id: "w3", name: "Mrs. Aisha Yusuf", company: "Bodija Fresh Supply", supplierId: "BFS-7742", marketHub: "Bodija Market, Ibadan", phone: "0812 907 7742", approved: true, rating: 4.7 },
  { id: "w4", name: "Tunde Adeyemi", company: "Lagos Cold Chain", supplierId: "LCC-3310", marketHub: "Mile 12 Market, Lagos", phone: "0705 664 3310", approved: false, rating: 4.2 },
];

export const PRODUCTS: Product[] = [
  { id: "p1", title: "Abakaliki Parboiled Rice", category: "grains", description: "Stone-free, long-grain parboiled rice sourced from Ebonyi State. Perfect for jollof and party rice.", origin: "Ebonyi State", image: IMG.rice, wholesalerId: "w1", rating: 4.9, sold: 1240, packaging: [{ unit: "Full Bag", price: 82000, stock: 45 }, { unit: "Half Bag", price: 42500, stock: 80 }] },
  { id: "p2", title: "Kano White Honey Beans", category: "grains", description: "Clean, weevil-free white honey beans (omo-ife). High yield when cooked.", origin: "Kano State", image: IMG.beans, wholesalerId: "w1", rating: 4.7, sold: 860, packaging: [{ unit: "Full Bag", price: 64000, stock: 30 }, { unit: "Half Bag", price: 33500, stock: 60 }] },
  { id: "p3", title: "Benue Puna Yam Tubers", category: "tubers", description: "Extra-large, smooth-skinned puna yams from Benue food basket. Extra firm and long-lasting.", origin: "Benue State", image: IMG.yam, wholesalerId: "w2", rating: 4.8, sold: 2100, packaging: [{ unit: "Basket", price: 28000, stock: 55 }, { unit: "Crate", price: 15000, stock: 90 }] },
  { id: "p4", title: "Fresh Cassava Roots", category: "tubers", description: "Freshly harvested sweet cassava, ideal for garri, fufu and processing.", origin: "Oyo State", image: IMG.cassava, wholesalerId: "w3", rating: 4.5, sold: 640, packaging: [{ unit: "Basket", price: 9500, stock: 120 }, { unit: "Crate", price: 5200, stock: 200 }] },
  { id: "p5", title: "Premium Red Palm Oil", category: "oils-spices", description: "Unadulterated, thick deep-red palm oil from artisanal mills. Rich in Vitamin A.", origin: "Imo State", image: IMG.palmoil, wholesalerId: "w3", rating: 4.9, sold: 3300, packaging: [{ unit: "25L Jerrycan", price: 38000, stock: 40 }, { unit: "50L Jerrycan", price: 73000, stock: 22 }] },
  { id: "p6", title: "Scotch Bonnet Peppers (Ata Rodo)", category: "oils-spices", description: "Fiery fresh scotch bonnet peppers, hand-picked and sorted. High pungency.", origin: "Kaduna State", image: IMG.peppers, wholesalerId: "w2", rating: 4.6, sold: 1500, packaging: [{ unit: "Basket", price: 7800, stock: 150 }, { unit: "Crate", price: 16500, stock: 70 }] },
  { id: "p7", title: "Fresh Ginger Roots", category: "oils-spices", description: "Plump, aromatic ginger roots, perfect for extraction and spice blending.", origin: "Plateau State", image: IMG.ginger, wholesalerId: "w1", rating: 4.4, sold: 420, packaging: [{ unit: "Basket", price: 11000, stock: 60 }] },
  { id: "p8", title: "Ijebu Garri (Fine White)", category: "grains", description: "Crisp, fine-grade Ijebu garri, sand-free and well-fermented.", origin: "Ogun State", image: IMG.garri, wholesalerId: "w3", rating: 4.8, sold: 2750, packaging: [{ unit: "Full Bag", price: 34000, stock: 70 }, { unit: "Half Bag", price: 18000, stock: 130 }] },
  { id: "p9", title: "Egusi (Dried Melon Seeds)", category: "grains", description: "Premium shelled dried melon seeds for rich, hearty egusi soup.", origin: "Kano State", image: IMG.egusi, wholesalerId: "w1", rating: 4.7, sold: 980, packaging: [{ unit: "Basket", price: 22000, stock: 48 }, { unit: "Crate", price: 46000, stock: 25 }] },
  { id: "p10", title: "Frozen Whole Chicken", category: "frozen", description: "Clean, well-fed whole frozen chicken, ready to cook. Cold-chain assured.", origin: "Oyo State", image: IMG.chicken, wholesalerId: "w4", rating: 4.5, sold: 1820, packaging: [{ unit: "Crate", price: 26500, stock: 65 }, { unit: "Dozen", price: 14500, stock: 110 }] },
  { id: "p11", title: "Frozen Catfish (Okporoko)", category: "frozen", description: "Thick-cut fresh frozen catfish, cleaned and gutted. High demand for pepper soup.", origin: "Lagos State", image: IMG.fish, wholesalerId: "w4", rating: 4.6, sold: 1340, packaging: [{ unit: "Basket", price: 18500, stock: 50 }, { unit: "Crate", price: 39000, stock: 28 }] },
  { id: "p12", title: "Fresh Tomatoes Crate", category: "bulk", description: "Sorted Roma tomatoes at peak ripeness, ideal for paste and resale.", origin: "Kano State", image: IMG.tomatoes, wholesalerId: "w2", rating: 4.3, sold: 4100, packaging: [{ unit: "Crate", price: 12500, stock: 240 }] },
  { id: "p13", title: "Brown Groundnuts (Shelled)", category: "bulk", description: "Sweet, oil-rich shelled groundnuts for groundnut oil and confectionery.", origin: "Niger State", image: IMG.groundnut, wholesalerId: "w1", rating: 4.7, sold: 760, packaging: [{ unit: "Full Bag", price: 52000, stock: 35 }, { unit: "Half Bag", price: 27500, stock: 72 }] },
  { id: "p14", title: "Bulk Maize Grains", category: "bulk", description: "Dried yellow maize for feed milling and pap (ogi) production.", origin: "Kaduna State", image: IMG.beans, wholesalerId: "w2", rating: 4.4, sold: 540, packaging: [{ unit: "Full Bag", price: 41000, stock: 90 }] },
];

export const FLASH_DEALS: FlashDeal[] = [
  { id: "f1", productId: "p1", productTitle: "Abakaliki Parboiled Rice", image: IMG.rice, originalPrice: 82000, dealPrice: 69500, unit: "Full Bag", stockTotal: 50, stockLeft: 18, endsAt: Date.now() + 3 * 3600 * 1000 },
  { id: "f2", productId: "p5", productTitle: "Premium Red Palm Oil", image: IMG.palmoil, originalPrice: 38000, dealPrice: 31900, unit: "25L Jerrycan", stockTotal: 40, stockLeft: 9, endsAt: Date.now() + 2 * 3600 * 1000 },
  { id: "f3", productId: "p3", productTitle: "Benue Puna Yam Tubers", image: IMG.yam, originalPrice: 28000, dealPrice: 23500, unit: "Basket", stockTotal: 60, stockLeft: 31, endsAt: Date.now() + 4 * 3600 * 1000 },
];

const now = Date.now();
export const SEED_ORDERS: Order[] = [
  { id: "o1", customerName: "Ngozi Okafor", customerPhone: "0810 223 4455", zone: "Ikeja Zone", lines: [{ productId: "p1", productTitle: "Abakaliki Parboiled Rice", unit: "Full Bag", price: 82000, qty: 1, jointBuy: false, zone: "Ikeja Zone" }, { productId: "p5", productTitle: "Premium Red Palm Oil", unit: "25L Jerrycan", price: 38000, qty: 1, jointBuy: true, zone: "Ikeja Zone" }], total: 109000, status: "pending", createdAt: now - 3600 * 1000, deliveryNote: "Gate 2, close by 6am", paymentMethod: "Bank Transfer", wholesalerId: "w1" },
  { id: "o2", customerName: "Ibrahim Sani", customerPhone: "0706 889 1234", zone: "Mile 12 Zone", lines: [{ productId: "p3", productTitle: "Benue Puna Yam Tubers", unit: "Basket", price: 28000, qty: 2, jointBuy: false, zone: "Mile 12 Zone" }], total: 56000, status: "dispatched", createdAt: now - 7200 * 1000, deliveryNote: "Call on arrival", paymentMethod: "Cash on Delivery", wholesalerId: "w2" },
  { id: "o3", customerName: "Funke Ade", customerPhone: "0809 445 6677", zone: "Lekki Zone", lines: [{ productId: "p8", productTitle: "Ijebu Garri (Fine White)", unit: "Half Bag", price: 18000, qty: 1, jointBuy: true, zone: "Lekki Zone" }], total: 18000, status: "delivered", createdAt: now - 86400 * 1000, deliveryNote: "Leave with security", paymentMethod: "Bank Transfer", wholesalerId: "w3" },
];

export const SEED_POOLS: JointBuyPool[] = [
  { id: "j1", productId: "p1", productTitle: "Abakaliki Parboiled Rice", unit: "Full Bag", zone: "Ikeja Zone", targetUnits: 2, pooledUnits: 1.5, participants: ["Ngozi O.", "Bola A."], discountPct: 20, status: "open" },
  { id: "j2", productId: "p8", productTitle: "Ijebu Garri (Fine White)", unit: "Full Bag", zone: "Lekki Zone", targetUnits: 2, pooledUnits: 1, participants: ["Funke A.", "Chidi E.", "Tola M."], discountPct: 18, status: "open" },
  { id: "j3", productId: "p5", productTitle: "Premium Red Palm Oil", unit: "50L Jerrycan", zone: "Mile 12 Zone", targetUnits: 2, pooledUnits: 2, participants: ["Ayo B.", "Musa K."], discountPct: 22, status: "matched" },
];

export const DEFAULT_CUSTOMER: CustomerProfile = {
  name: "", phone: "", email: "", storeName: "", address: "", landmark: "", zone: "Ikeja Zone", verified: false,
};

const NS = "kasuwane_";
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}
export function resetAll(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(NS))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

export function formatNaira(n: number): string {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

export function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  return Math.floor(s / 86400) + "d ago";
}
