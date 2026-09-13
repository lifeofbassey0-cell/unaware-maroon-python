export type Role = "customer" | "wholesaler" | "admin";

export type CategorySlug =
  | "grains"
  | "tubers"
  | "oils-spices"
  | "livestock"
  | "frozen"
  | "bulk";

export interface Category {
  slug: CategorySlug;
  label: string;
}

export type PackagingUnit =
  | "Full Bag"
  | "Half Bag"
  | "Full Carton"
  | "Half Carton"
  | "25L Jerrycan"
  | "50L Jerrycan"
  | "Basket"
  | "Crate"
  | "Dozen";

export interface PackagingOption {
  unit: PackagingUnit;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  category: CategorySlug;
  description: string;
  origin: string;
  image: string;
  wholesalerId: string;
  packaging: PackagingOption[];
  rating: number;
  sold: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productTitle: string;
  unit: PackagingUnit;
  price: number;
  qty: number;
  image: string;
  jointBuy: boolean;
  zone: string;
}

export type OrderStatus =
  | "pending"
  | "dispatched"
  | "delivered"
  | "cancelled";

export interface OrderLine {
  productId: string;
  productTitle: string;
  unit: PackagingUnit;
  price: number;
  qty: number;
  jointBuy: boolean;
  zone: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  zone: string;
  lines: OrderLine[];
  total: number;
  status: OrderStatus;
  createdAt: number;
  deliveryNote: string;
  paymentMethod: "Cash on Delivery" | "Bank Transfer";
  wholesalerId: string;
}

export interface JointBuyPool {
  id: string;
  productId: string;
  productTitle: string;
  unit: PackagingUnit;
  zone: string;
  targetUnits: number;
  pooledUnits: number;
  participants: string[];
  discountPct: number;
  status: "open" | "matched" | "dispatched";
}

export interface WholesalerProfile {
  id: string;
  name: string;
  company: string;
  supplierId: string;
  marketHub: string;
  phone: string;
  approved: boolean;
  rating: number;
}

export interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
  storeName: string;
  address: string;
  landmark: string;
  zone: string;
  verified: boolean;
}

export interface FlashDeal {
  id: string;
  productId: string;
  productTitle: string;
  image: string;
  originalPrice: number;
  dealPrice: number;
  unit: PackagingUnit;
  stockTotal: number;
  stockLeft: number;
  endsAt: number;
}
