import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  IdentificationCard,
  MapPin,
  Package,
  Pencil,
  Phone,
  Plus,
  Storefront,
  Tag,
  Trash,
  TrendUp,
  Truck,
  XCircle,
} from "@phosphor-icons/react";
import type {
  CategorySlug,
  Order,
  PackagingOption,
  PackagingUnit,
  Product,
  WholesalerProfile,
} from "@/types";
import { CATEGORIES, formatNaira } from "@/data/mockData";

const UNITS: PackagingUnit[] = ["Full Bag", "Half Bag", "Full Carton", "Half Carton", "25L Jerrycan", "50L Jerrycan", "Basket", "Crate", "Dozen"];
const IMG_POOL = [
  "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-rice-dbe99fb2-1789323634080.webp",
  "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-yam-847f4f68-1789323632784.webp",
  "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/1af14b78-a8a9-44a7-b75e-9a5b30999917/prod-palmoil-932fa6e8-1789323636609.webp",
];

interface Props {
  wholesaler: WholesalerProfile;
  products: Product[];
  orders: Order[];
  onSaveProfile: (w: WholesalerProfile) => void;
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (id: string, patch: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onDispatch: (id: string) => void;
}

function Stat({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Package; tone: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-sm">
      <div className={`grid h-8 w-8 place-items-center rounded-lg ${tone}`}><Icon size={16} weight="fill" className="text-white" /></div>
      <div className="mt-2 font-mono text-xl font-black tabular-nums text-[#052e16]">{value}</div>
      <div className="text-[11px] text-zinc-500">{label}</div>
    </div>
  );
}

function UploadForm({ onAdd, wholesalerId }: { onAdd: (p: Product) => void; wholesalerId: string }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [origin, setOrigin] = useState("");
  const [cat, setCat] = useState<CategorySlug>("grains");
  const [packs, setPacks] = useState<PackagingOption[]>([{ unit: "Full Bag", price: 50000, stock: 20 }]);
  const [img, setImg] = useState(IMG_POOL[0]);

  const setPack = (i: number, k: keyof PackagingOption, v: string) =>
    setPacks((ps) => ps.map((x, j) => (j === i ? { ...x, [k]: k === "unit" ? (v as PackagingUnit) : Number(v) } : x)));

  const submit = () => {
    if (!title) return;
    onAdd({
      id: `p-${Date.now()}`,
      title,
      description: desc || "Fresh wholesale produce.",
      origin: origin || "Nigeria",
      category: cat,
      image: img,
      wholesalerId,
      rating: 4.5,
      sold: 0,
      packaging: packs.filter((x) => x.price > 0),
    });
    setTitle(""); setDesc(""); setOrigin("");
  };

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#052e16]"><Plus size={16} weight="fill" className="text-[#EA580C]" /> Fast Inventory Upload</div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input placeholder="Product title" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#0F4C3A]" />
        <input placeholder="Origin state" value={origin} onChange={(e) => setOrigin(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#0F4C3A]" />
        <input placeholder="Short description" value={desc} onChange={(e) => setDesc(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#0F4C3A] sm:col-span-2" />
        <select value={cat} onChange={(e) => setCat(e.target.value as CategorySlug)} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#0F4C3A]">
          {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
        <select value={img} onChange={(e) => setImg(e.target.value)} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#0F4C3A]">
          {IMG_POOL.map((u, i) => <option key={u} value={u}>Stock photo {i + 1}</option>)}
        </select>
      </div>
      <div className="mt-3 text-[11px] font-bold uppercase tracking-wide text-zinc-400">Packaging & Pricing</div>
      <div className="mt-1 space-y-2">
        {packs.map((pk, i) => (
          <div key={i} className="flex items-center gap-2">
            <select value={pk.unit} onChange={(e) => setPack(i, "unit", e.target.value)} className="flex-1 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs outline-none focus:border-[#0F4C3A]">
              {UNITS.map((u) => <option key={u}>{u}</option>)}
            </select>
            <input type="number" placeholder="₦ Price" value={pk.price} onChange={(e) => setPack(i, "price", e.target.value)} className="w-24 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs outline-none focus:border-[#0F4C3A]" />
            <input type="number" placeholder="Stock" value={pk.stock} onChange={(e) => setPack(i, "stock", e.target.value)} className="w-20 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs outline-none focus:border-[#0F4C3A]" />
            <button onClick={() => setPacks((ps) => ps.filter((_, j) => j !== i))} className="grid h-7 w-7 place-items-center rounded-md text-red-500 active:scale-90" disabled={packs.length === 1}><Trash size={13} /></button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setPacks((ps) => [...ps, { unit: "Half Bag", price: 0, stock: 0 }])} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 active:scale-95">+ Add unit</button>
        <button onClick={submit} disabled={!title} className="ml-auto flex items-center gap-1.5 rounded-lg bg-[#0F4C3A] px-4 py-1.5 text-xs font-bold text-white disabled:opacity-40 active:scale-95"><Tag size={14} weight="fill" /> Publish Product</button>
      </div>
    </div>
  );
}

export default function WholesalerPortal(p: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(p.wholesaler);
  const myProducts = useMemo(() => p.products.filter((x) => x.wholesalerId === p.wholesaler.id), [p.products, p.wholesaler.id]);
  const myOrders = useMemo(() => p.orders.filter((o) => o.lines.some((l) => myProducts.some((mp) => mp.id === l.productId))), [p.orders, myProducts]);
  const revenue = myOrders.reduce((s, o) => s + o.total, 0);
  const pending = myOrders.filter((o) => o.status === "pending").length;

  const saveProfile = () => { p.onSaveProfile(draft); setEditing(false); };

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 pb-16 sm:px-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0F4C3A] text-amber-300"><Storefront size={20} weight="fill" /></div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-[#052e16]">Wholesaler Hub</h1>
          <div className="text-xs text-zinc-500">{p.wholesaler.company} · {p.wholesaler.marketHub}</div>
        </div>
        {p.wholesaler.approved ? (
          <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"><CheckCircle size={13} weight="fill" /> Verified Vendor</span>
        ) : (
          <span className="ml-auto flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700"><XCircle size={13} weight="fill" /> Pending Approval</span>
        )}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Products live" value={String(myProducts.length)} icon={Package} tone="bg-[#0F4C3A]" />
        <Stat label="Incoming orders" value={String(myOrders.length)} icon={Truck} tone="bg-[#EA580C]" />
        <Stat label="Awaiting dispatch" value={String(pending)} icon={Tag} tone="bg-[#F59E0B]" />
        <Stat label="Order value" value={formatNaira(revenue)} icon={TrendUp} tone="bg-[#DC2626]" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-black text-[#052e16]"><IdentificationCard size={16} weight="fill" className="text-[#EA580C]" /> Vendor Profile</div>
              <button onClick={() => { setDraft(p.wholesaler); setEditing((e) => !e); }} className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-[11px] font-semibold text-zinc-600 active:scale-95"><Pencil size={12} /> {editing ? "Cancel" : "Edit"}</button>
            </div>
            {!editing ? (
              <div className="space-y-2 text-sm">
                <Row label="Contact" value={p.wholesaler.name} />
                <Row label="Company" value={p.wholesaler.company} />
                <Row label="Supplier ID" value={p.wholesaler.supplierId} mono />
                <Row label="Market hub" value={p.wholesaler.marketHub} icon />
                <Row label="Phone" value={p.wholesaler.phone} phone />
              </div>
            ) : (
              <div className="space-y-2">
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Contact name" className="w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-sm outline-none focus:border-[#0F4C3A]" />
                <input value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} placeholder="Company" className="w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-sm outline-none focus:border-[#0F4C3A]" />
                <input value={draft.supplierId} onChange={(e) => setDraft({ ...draft, supplierId: e.target.value })} placeholder="Supplier ID" className="w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-sm outline-none focus:border-[#0F4C3A]" />
                <input value={draft.marketHub} onChange={(e) => setDraft({ ...draft, marketHub: e.target.value })} placeholder="Market hub" className="w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-sm outline-none focus:border-[#0F4C3A]" />
                <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} placeholder="Phone" className="w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-sm outline-none focus:border-[#0F4C3A]" />
                <button onClick={saveProfile} className="w-full rounded-lg bg-[#0F4C3A] py-2 text-sm font-bold text-white active:scale-95">Save Profile</button>
              </div>
            )}
          </div>
          <UploadForm onAdd={p.onAddProduct} wholesalerId={p.wholesaler.id} />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#052e16]"><Package size={16} weight="fill" className="text-[#EA580C]" /> Inventory Management</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase tracking-wide text-zinc-400">
                  <tr><th className="pb-2">Product</th><th className="pb-2">Price</th><th className="pb-2">Stock</th><th className="pb-2">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {myProducts.map((prod) => {
                    const pkg = prod.packaging[0];
                    const inStock = pkg.stock > 0;
                    return (
                      <tr key={prod.id}>
                        <td className="py-2 pr-2">
                          <div className="flex items-center gap-2">
                            <img src={prod.image} alt="" className="h-8 w-8 rounded-md object-cover" />
                            <div className="min-w-0"><div className="truncate font-bold text-zinc-800">{prod.title}</div><div className="text-[10px] text-zinc-400">{pkg.unit}</div></div>
                          </div>
                        </td>
                        <td className="py-2 pr-2"><input type="number" value={pkg.price} onChange={(e) => p.onUpdateProduct(prod.id, { packaging: prod.packaging.map((x, j) => (j === 0 ? { ...x, price: Number(e.target.value) } : x)) })} className="w-20 rounded-md border border-zinc-200 px-1.5 py-1 font-mono text-[11px] tabular-nums outline-none focus:border-[#0F4C3A]" /></td>
                        <td className="py-2 pr-2"><input type="number" value={pkg.stock} onChange={(e) => p.onUpdateProduct(prod.id, { packaging: prod.packaging.map((x, j) => (j === 0 ? { ...x, stock: Number(e.target.value) } : x)) })} className="w-16 rounded-md border border-zinc-200 px-1.5 py-1 font-mono text-[11px] tabular-nums outline-none focus:border-[#0F4C3A]" /></td>
                        <td className="py-2">
                          <button onClick={() => p.onUpdateProduct(prod.id, { packaging: prod.packaging.map((x, j) => (j === 0 ? { ...x, stock: inStock ? 0 : 25 } : x)) })} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${inStock ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{inStock ? "In Stock" : "Off"}</button>
                        </td>
                      </tr>
                    );
                  })}
                  {myProducts.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-zinc-400">No products yet. Use the upload form.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-black text-[#052e16]"><Truck size={16} weight="fill" className="text-[#EA580C]" /> Morning Dispatch Log</div>
              <button onClick={() => window.print()} className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 active:scale-95">Export manifest</button>
            </div>
            <div className="space-y-2">
              {myOrders.map((o) => (
                <motion.div key={o.id} layout className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-zinc-800">{o.customerName} · {o.zone}</div>
                    <div className="truncate text-[10px] text-zinc-500">{o.lines.map((l) => `${l.qty}x ${l.productTitle} (${l.unit})`).join(", ")}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-black tabular-nums text-[#0F4C3A]">{formatNaira(o.total)}</div>
                    <span className={`text-[10px] font-bold ${o.status === "pending" ? "text-amber-600" : o.status === "dispatched" ? "text-[#EA580C]" : "text-emerald-600"}`}>{o.status}</span>
                  </div>
                  {o.status === "pending" && (
                    <button onClick={() => p.onDispatch(o.id)} className="flex items-center gap-1 rounded-lg bg-[#0F4C3A] px-2.5 py-1.5 text-[11px] font-bold text-white active:scale-95"><Truck size={13} weight="fill" /> Dispatch</button>
                  )}
                </motion.div>
              ))}
              {myOrders.length === 0 && <div className="py-6 text-center text-xs text-zinc-400">No incoming pre-orders.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono, icon, phone }: { label: string; value: string; mono?: boolean; icon?: boolean; phone?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-xs text-zinc-400">{label}</span>
      {icon && <MapPin size={13} className="text-[#EA580C]" />}
      {phone && <Phone size={13} className="text-[#EA580C]" />}
      <span className={`text-sm text-zinc-800 ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}
