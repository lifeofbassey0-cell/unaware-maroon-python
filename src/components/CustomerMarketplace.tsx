import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CheckCircle,
  Flame,
  HandCoins,
  MagnifyingGlass,
  MapPin,
  Minus,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash,
  Truck,
  Users,
  X,
} from "@phosphor-icons/react";
import type {
  CartItem,
  CategorySlug,
  CustomerProfile,
  FlashDeal,
  JointBuyPool,
  Order,
  PackagingUnit,
  Product,
} from "@/types";
import {
  CATEGORIES,
  FLASH_DEALS,
  HERO_IMAGE,
  ZONES,
  formatNaira,
  timeAgo,
} from "@/data/mockData";

interface Props {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  pools: JointBuyPool[];
  customer: CustomerProfile;
  onAddToCart: (item: CartItem) => void;
  onRemoveFromCart: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onToggleJointBuy: (id: string) => void;
  onPlaceOrder: (note: string, payment: Order["paymentMethod"]) => void;
  onConfirmReceived: (id: string) => void;
  onSaveCustomer: (c: CustomerProfile) => void;
  cartOpen: boolean;
  setCartOpen: (b: boolean) => void;
  ordersOpen: boolean;
  setOrdersOpen: (b: boolean) => void;
  onboardingOpen: boolean;
  setOnboardingOpen: (b: boolean) => void;
}

function useCountdown(target: number): string {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const t = () => setLeft(Math.max(0, target - Date.now()));
    t();
    const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, [target]);
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function FlashCard({ deal, onAdd }: { deal: FlashDeal; onAdd: () => void }) {
  const cd = useCountdown(deal.endsAt);
  const pct = Math.round(((deal.stockTotal - deal.stockLeft) / deal.stockTotal) * 100);
  return (
    <div className="w-72 shrink-0 overflow-hidden rounded-2xl border border-amber-500/30 bg-white shadow-lg shadow-amber-500/10">
      <div className="relative h-28">
        <img src={deal.image} alt={deal.productTitle} className="h-full w-full object-cover" />
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[#DC2626] px-2 py-0.5 text-[10px] font-bold text-white">
          <Flame size={12} weight="fill" /> FLASH
        </div>
        <div className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums text-amber-300">
          {cd}
        </div>
      </div>
      <div className="p-3">
        <div className="truncate text-sm font-bold text-zinc-900">{deal.productTitle}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-mono text-lg font-black tabular-nums text-[#0F4C3A]">
            {formatNaira(deal.dealPrice)}
          </span>
          <span className="font-mono text-xs tabular-nums text-zinc-400 line-through">
            {formatNaira(deal.originalPrice)}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full rounded-full bg-gradient-to-r from-[#EA580C] to-[#DC2626]" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
          <span>{deal.unit}</span>
          <span>{deal.stockLeft} left</span>
        </div>
        <button
          onClick={onAdd}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#F59E0B] py-2 text-xs font-bold text-[#052e16] transition hover:bg-[#FBBF24] active:scale-[0.98]"
        >
          <Tag size={14} weight="fill" /> Grab Deal
        </button>
      </div>
    </div>
  );
}

function ProductCard({ product, customer, onAdd }: { product: Product; customer: CustomerProfile; onAdd: (i: CartItem) => void }) {
  const [unit, setUnit] = useState<PackagingUnit>(product.packaging[0].unit);
  const [qty, setQty] = useState(1);
  const [jb, setJb] = useState(false);
  const pkg = product.packaging.find((x) => x.unit === unit)!;
  const lineTotal = pkg.price * qty;
  const add = () =>
    onAdd({
      id: `${product.id}-${unit}-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      unit,
      price: pkg.price,
      qty,
      image: product.image,
      jointBuy: jb,
      zone: customer.zone,
    });
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-36">
        <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
        <span className="absolute left-2 top-2 rounded-full bg-[#052e16]/90 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
          {product.origin}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="text-sm font-bold leading-tight text-zinc-900">{product.title}</div>
        <div className="mt-0.5 line-clamp-2 text-[11px] text-zinc-500">{product.description}</div>
        <div className="mt-2 flex flex-wrap gap-1">
          {product.packaging.map((x) => (
            <button
              key={x.unit}
              onClick={() => setUnit(x.unit)}
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold transition ${
                unit === x.unit
                  ? "border-[#0F4C3A] bg-[#0F4C3A] text-white"
                  : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-[#0F4C3A]/40"
              }`}
            >
              {x.unit}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div className="font-mono text-base font-black tabular-nums text-[#0F4C3A]">
            {formatNaira(pkg.price)}
          </div>
          <div className="text-[10px] text-zinc-400">{pkg.stock} in stock</div>
        </div>
        <label className="mt-2 flex items-center gap-2 rounded-lg bg-amber-50 px-2 py-1.5 text-[10px] font-semibold text-amber-800">
          <input type="checkbox" checked={jb} onChange={(e) => setJb(e.target.checked)} className="h-3.5 w-3.5 accent-[#EA580C]" />
          <HandCoins size={14} weight="fill" className="text-[#EA580C]" />
          Joint-Buy pool · save up to 25%
        </label>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-zinc-200">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-8 w-8 place-items-center text-zinc-600 active:scale-90">
              <Minus size={14} />
            </button>
            <span className="w-6 text-center font-mono text-sm tabular-nums">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="grid h-8 w-8 place-items-center text-zinc-600 active:scale-90">
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={add}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0F4C3A] py-2 text-xs font-bold text-white transition hover:bg-[#135D47] active:scale-[0.98]"
          >
            <Plus size={14} weight="bold" /> Add · {formatNaira(lineTotal)}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function OnboardingModal({ open, customer, onClose, onSave }: { open: boolean; customer: CustomerProfile; onClose: () => void; onSave: (c: CustomerProfile) => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CustomerProfile>(customer);
  const [otp, setOtp] = useState("");
  useEffect(() => { if (open) { setStep(customer.verified ? 3 : 1); setForm(customer); } }, [open, customer]);
  const set = (k: keyof CustomerProfile) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const sendOtp = () => setStep(2);
  const verify = () => { if (otp.length === 4) setStep(3); };
  const finish = () => { onSave({ ...form, verified: true }); onClose(); };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-end bg-black/50 p-0 sm:place-items-center sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-base font-black text-[#052e16]">Buyer Onboarding</div>
                <div className="text-xs text-zinc-500">Mock OTP + Light KYC · Step {step}/3</div>
              </div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 active:scale-90"><X size={16} /></button>
            </div>
            {step === 1 && (
              <div className="space-y-3">
                <input placeholder="Full name" value={form.name} onChange={set("name")} className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F4C3A]" />
                <input placeholder="Phone (e.g. 0810...)" value={form.phone} onChange={set("phone")} className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F4C3A]" />
                <input placeholder="Email" value={form.email} onChange={set("email")} className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F4C3A]" />
                <button onClick={sendOtp} disabled={!form.name || !form.phone} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] py-3 text-sm font-bold text-white disabled:opacity-40 active:scale-[0.98]">
                  <Phone size={16} weight="fill" /> Send Mock OTP
                </button>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-3">
                <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">Demo code sent to {form.phone}. Enter <b>1234</b>.</div>
                <input placeholder="4-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))} className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-center font-mono text-lg tracking-[0.5em] outline-none focus:border-[#0F4C3A]" />
                <button onClick={verify} disabled={otp.length < 4} className="w-full rounded-xl bg-[#F59E0B] py-3 text-sm font-bold text-[#052e16] disabled:opacity-40 active:scale-[0.98]">Verify OTP</button>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-3">
                <input placeholder="Store / Business name" value={form.storeName} onChange={set("storeName")} className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F4C3A]" />
                <input placeholder="Address" value={form.address} onChange={set("address")} className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F4C3A]" />
                <input placeholder="Landmark / Market area" value={form.landmark} onChange={set("landmark")} className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F4C3A]" />
                <select value={form.zone} onChange={(e) => setForm((f) => ({ ...f, zone: e.target.value }))} className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-[#0F4C3A]">
                  {ZONES.map((z) => <option key={z}>{z}</option>)}
                </select>
                <button onClick={finish} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] py-3 text-sm font-bold text-white active:scale-[0.98]">
                  <ShieldCheck size={16} weight="fill" /> Complete KYC
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CartDrawer({ open, cart, onClose, onRemove, onQty, onToggleJB, onCheckout }: { open: boolean; cart: CartItem[]; onClose: () => void; onRemove: (id: string) => void; onQty: (id: string, q: number) => void; onToggleJB: (id: string) => void; onCheckout: (note: string, pay: Order["paymentMethod"]) => void }) {
  const [note, setNote] = useState("");
  const [pay, setPay] = useState<Order["paymentMethod"]>("Cash on Delivery");
  const total = cart.reduce((s, i) => s + i.price * i.qty * (i.jointBuy ? 0.8 : 1), 0);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-zinc-50 shadow-2xl" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}>
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-black text-[#052e16]"><ShoppingBag size={18} weight="fill" /> Your Basket</div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 active:scale-90"><X size={16} /></button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {cart.length === 0 && <div className="grid h-full place-items-center text-sm text-zinc-400">Basket is empty</div>}
              {cart.map((i) => (
                <div key={i.id} className="flex gap-3 rounded-xl border border-zinc-200 bg-white p-2.5">
                  <img src={i.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold text-zinc-900">{i.productTitle}</div>
                    <div className="text-[10px] text-zinc-500">{i.unit} · {formatNaira(i.price)}</div>
                    <label className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#EA580C]">
                      <input type="checkbox" checked={i.jointBuy} onChange={() => onToggleJB(i.id)} className="h-3 w-3 accent-[#EA580C]" />
                      <HandCoins size={12} weight="fill" /> Joint-Buy (-20%)
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <button onClick={() => onQty(i.id, Math.max(1, i.qty - 1))} className="grid h-6 w-6 place-items-center rounded-md bg-zinc-100 active:scale-90"><Minus size={12} /></button>
                      <span className="w-5 text-center font-mono text-xs tabular-nums">{i.qty}</span>
                      <button onClick={() => onQty(i.id, i.qty + 1)} className="grid h-6 w-6 place-items-center rounded-md bg-zinc-100 active:scale-90"><Plus size={12} /></button>
                      <button onClick={() => onRemove(i.id)} className="ml-auto grid h-6 w-6 place-items-center rounded-md text-red-500 active:scale-90"><Trash size={13} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="space-y-2 border-t border-zinc-200 bg-white p-4">
                <input placeholder="Neighborhood delivery note" value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#0F4C3A]" />
                <div className="flex gap-2">
                  {(["Cash on Delivery", "Bank Transfer"] as const).map((m) => (
                    <button key={m} onClick={() => setPay(m)} className={`flex-1 rounded-xl border px-2 py-2 text-[11px] font-semibold transition ${pay === m ? "border-[#0F4C3A] bg-[#0F4C3A] text-white" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>{m}</button>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-zinc-500">Next-morning delivery</span>
                  <span className="font-mono text-lg font-black tabular-nums text-[#0F4C3A]">{formatNaira(total)}</span>
                </div>
                <button onClick={() => onCheckout(note, pay)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F59E0B] py-3 text-sm font-black text-[#052e16] active:scale-[0.98]">
                  <Truck size={16} weight="fill" /> Place Pre-Order
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function OrdersDrawer({ open, orders, onClose, onConfirm }: { open: boolean; orders: Order[]; onClose: () => void; onConfirm: (id: string) => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed left-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-zinc-50 shadow-2xl" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}>
            <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-black text-[#052e16]"><Package size={18} weight="fill" /> Order Tracking</div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-zinc-100 active:scale-90"><X size={16} /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              {orders.length === 0 && <div className="grid h-full place-items-center text-sm text-zinc-400">No orders yet</div>}
              {orders.map((o) => {
                const stages = ["pending", "dispatched", "delivered"];
                const idx = stages.indexOf(o.status === "cancelled" ? "pending" : o.status);
                return (
                  <div key={o.id} className="rounded-xl border border-zinc-200 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-zinc-900">#{o.id.slice(-6).toUpperCase()}</div>
                      <span className="text-[10px] text-zinc-400">{timeAgo(o.createdAt)}</span>
                    </div>
                    <div className="mt-1 text-[10px] text-zinc-500">{o.lines.length} items · {formatNaira(o.total)} · {o.zone}</div>
                    <div className="mt-3 flex items-center">
                      {["Pending", "Dispatch", "Delivered"].map((label, k) => (
                        <div key={label} className="flex flex-1 items-center">
                          <div className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${k <= idx ? "bg-[#0F4C3A] text-white" : "bg-zinc-200 text-zinc-500"}`}>{k < idx ? <Check size={12} weight="bold" /> : k + 1}</div>
                          {k < 2 && <div className={`h-0.5 flex-1 ${k < idx ? "bg-[#0F4C3A]" : "bg-zinc-200"}`} />}
                        </div>
                      ))}
                    </div>
                    {o.status === "delivered" ? (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald-700"><CheckCircle size={14} weight="fill" /> Delivered</div>
                    ) : o.status === "pending" || o.status === "dispatched" ? (
                      <button onClick={() => onConfirm(o.id)} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-50 py-2 text-[11px] font-bold text-[#0F4C3A] active:scale-[0.98]">
                        <Check size={14} weight="bold" /> Confirm Order Received
                      </button>
                    ) : (
                      <div className="mt-2 text-[11px] font-semibold text-red-500">Cancelled</div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function CustomerMarketplace(p: Props) {
  const [cat, setCat] = useState<CategorySlug | "all">("all");
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => p.products.filter((x) => (cat === "all" || x.category === cat) && (x.title.toLowerCase().includes(q.toLowerCase()) || x.description.toLowerCase().includes(q.toLowerCase()))),
    [p.products, cat, q]
  );
  const cartTotal = p.cart.reduce((s, i) => s + i.price * i.qty * (i.jointBuy ? 0.8 : 1), 0);

  return (
    <div className="pb-16">
      <div className="relative mx-auto max-w-7xl px-3 pt-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-900/20 bg-[#052e16]">
          <img src={HERO_IMAGE} alt="Morning market" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#052e16] via-[#052e16]/70 to-transparent" />
          <div className="relative p-6 sm:p-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-300">
              <Flame size={13} weight="fill" /> Morning Fresh · 06:00 Dispatch
            </div>
            <h1 className="mt-3 max-w-lg text-3xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl">
              Wholesale produce, delivered before sunrise.
            </h1>
            <p className="mt-3 max-w-md text-sm text-emerald-100/80">
              Buy bulk grains, tubers and oils direct from verified Nigerian market hubs.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })} className="flex items-center gap-1.5 rounded-xl bg-[#F59E0B] px-4 py-2.5 text-sm font-black text-[#052e16] active:scale-95">
                Shop Market <ArrowRight size={16} weight="bold" />
              </button>
              {!p.customer.verified && (
                <button onClick={() => p.setOnboardingOpen(true)} className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur active:scale-95">
                  <ShieldCheck size={16} weight="fill" /> Verify KYC
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 pt-6 sm:px-6">
        <div className="mb-3 flex items-center gap-2">
          <Flame size={18} weight="fill" className="text-[#DC2626]" />
          <h2 className="text-sm font-black uppercase tracking-tight text-zinc-900">Flash Morning Deals</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none]">
          {FLASH_DEALS.map((d) => (
            <FlashCard key={d.id} deal={d} onAdd={() => p.onAddToCart({ id: `${d.productId}-deal-${Date.now()}`, productId: d.productId, productTitle: d.productTitle, unit: d.unit, price: d.dealPrice, qty: 1, image: d.image, jointBuy: false, zone: p.customer.zone })} />
          ))}
        </div>
      </div>

      <div id="catalog" className="mx-auto max-w-7xl scroll-mt-24 px-3 pt-6 sm:px-6">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <MagnifyingGlass size={18} className="text-zinc-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rice, yam, palm oil..." className="w-full max-w-xs rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#0F4C3A]" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500">
            <MapPin size={14} className="text-[#EA580C]" /> {p.customer.zone}
          </div>
        </div>
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          <button onClick={() => setCat("all")} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${cat === "all" ? "bg-[#0F4C3A] text-white" : "bg-white text-zinc-600 ring-1 ring-zinc-200"}`}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c.slug} onClick={() => setCat(c.slug)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${cat === c.slug ? "bg-[#0F4C3A] text-white" : "bg-white text-zinc-600 ring-1 ring-zinc-200"}`}>{c.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((prod) => <ProductCard key={prod.id} product={prod} customer={p.customer} onAdd={p.onAddToCart} />)}
        </div>
        {filtered.length === 0 && <div className="py-16 text-center text-sm text-zinc-400">No produce matches your search.</div>}
      </div>

      <OnboardingModal open={p.onboardingOpen} customer={p.customer} onClose={() => p.setOnboardingOpen(false)} onSave={p.onSaveCustomer} />
      <CartDrawer open={p.cartOpen} cart={p.cart} onClose={() => p.setCartOpen(false)} onRemove={p.onRemoveFromCart} onQty={p.onUpdateQty} onToggleJB={p.onToggleJointBuy} onCheckout={(note, pay) => { p.onPlaceOrder(note, pay); p.setCartOpen(false); }} />
      <OrdersDrawer open={p.ordersOpen} orders={p.orders} onClose={() => p.setOrdersOpen(false)} onConfirm={p.onConfirmReceived} />
    </div>
  );
}
