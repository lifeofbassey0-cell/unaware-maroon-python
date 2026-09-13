import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Check,
  CheckCircle,
  Coins,
  Flame,
  HandCoins,
  MapPin,
  Package,
  ShieldCheck,
  Storefront,
  TrendUp,
  Truck,
  Users,
  XCircle,
} from "@phosphor-icons/react";
import type { JointBuyPool, Order, Product, WholesalerProfile } from "@/types";
import { formatNaira, timeAgo } from "@/data/mockData";

interface Props {
  orders: Order[];
  products: Product[];
  pools: JointBuyPool[];
  wholesalers: WholesalerProfile[];
  onDispatch: (id: string) => void;
  onApproveWholesaler: (id: string) => void;
  onVerifyPool: (id: string) => void;
}

function KPI({ label, value, icon: Icon, tone, sub }: { label: string; value: string; icon: typeof Package; tone: string; sub?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
      <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full ${tone} opacity-10`} />
      <div className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon size={18} weight="fill" className="text-white" /></div>
      <div className="mt-3 font-mono text-2xl font-black tabular-nums tracking-tight text-[#052e16]">{value}</div>
      <div className="text-xs font-semibold text-zinc-500">{label}</div>
      {sub && <div className="mt-1 text-[10px] text-emerald-600">{sub}</div>}
    </div>
  );
}

const STATUS_TONE: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-700",
  dispatched: "bg-orange-100 text-orange-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOperations(p: Props) {
  const sales = useMemo(() => p.orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0), [p.orders]);
  const preOrders = p.orders.filter((o) => o.status === "pending").length;
  const activePools = p.pools.filter((x) => x.status !== "dispatched").length;
  const vendors = p.wholesalers.length;

  const zones = useMemo(() => {
    const map = new Map<string, JointBuyPool[]>();
    p.pools.forEach((pool) => {
      const arr = map.get(pool.zone) || [];
      arr.push(pool);
      map.set(pool.zone, arr);
    });
    return Array.from(map.entries());
  }, [p.pools]);

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 pb-16 sm:px-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#DC2626] text-white"><ShieldCheck size={20} weight="fill" /></div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-[#052e16]">Master Operations Center</h1>
          <div className="text-xs text-zinc-500">Platform Super-Admin · live supply-chain control</div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KPI label="Daily Sales Volume" value={formatNaira(sales)} icon={Coins} tone="bg-[#0F4C3A]" sub="+12% vs yesterday" />
        <KPI label="Morning Pre-Orders" value={String(preOrders)} icon={Flame} tone="bg-[#EA580C]" />
        <KPI label="Active Joint-Buys" value={String(activePools)} icon={HandCoins} tone="bg-[#F59E0B]" />
        <KPI label="Registered Wholesalers" value={String(vendors)} icon={Storefront} tone="bg-[#DC2626]" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#052e16]"><TrendUp size={16} weight="fill" className="text-[#EA580C]" /> Live Order Alerts</div>
            <div className="space-y-2">
              {p.orders.map((o) => (
                <motion.div key={o.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-xs font-bold text-zinc-800">{o.customerName}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase ${STATUS_TONE[o.status]}`}>{o.status}</span>
                    </div>
                    <div className="truncate text-[10px] text-zinc-500">{o.lines.map((l) => `${l.qty}x ${l.productTitle}`).join(", ")} · {o.zone}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-black tabular-nums text-[#0F4C3A]">{formatNaira(o.total)}</div>
                    <div className="text-[9px] text-zinc-400">{timeAgo(o.createdAt)}</div>
                  </div>
                  {o.status === "pending" && (
                    <button onClick={() => p.onDispatch(o.id)} className="flex items-center gap-1 rounded-lg bg-[#0F4C3A] px-2.5 py-1.5 text-[11px] font-bold text-white active:scale-95"><Truck size={13} weight="fill" /> Dispatch</button>
                  )}
                  {o.status === "dispatched" && <span className="flex items-center gap-1 text-[11px] font-bold text-orange-600"><Truck size={13} weight="fill" /> En route</span>}
                </motion.div>
              ))}
              {p.orders.length === 0 && <div className="py-6 text-center text-xs text-zinc-400">No orders in the stream.</div>}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#052e16]"><HandCoins size={16} weight="fill" className="text-[#EA580C]" /> Joint-Buy Pooling Aggregator</div>
            <div className="space-y-4">
              {zones.map(([zone, list]) => (
                <div key={zone}>
                  <div className="mb-1.5 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-zinc-400"><MapPin size={12} className="text-[#EA580C]" /> {zone}</div>
                  <div className="space-y-2">
                    {list.map((pool) => {
                      const pct = Math.min(100, Math.round((pool.pooledUnits / pool.targetUnits) * 100));
                      const matched = pool.pooledUnits >= pool.targetUnits;
                      return (
                        <div key={pool.id} className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-3">
                          <div className="flex items-center justify-between">
                            <div className="text-xs font-bold text-zinc-800">{pool.productTitle} · {pool.unit}</div>
                            <span className="rounded-full bg-[#EA580C] px-2 py-0.5 text-[10px] font-bold text-white">-{pool.discountPct}%</span>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white">
                              <div className={`h-full rounded-full ${matched ? "bg-emerald-500" : "bg-gradient-to-r from-[#F59E0B] to-[#EA580C]"}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="font-mono text-[10px] font-bold tabular-nums text-zinc-600">{pool.pooledUnits}/{pool.targetUnits} {pool.unit}</span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[10px] text-zinc-500"><Users size={12} /> {pool.participants.join(", ")}</div>
                            {pool.status === "dispatched" ? (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600"><CheckCircle size={13} weight="fill" /> Dispatched</span>
                            ) : matched ? (
                              <button onClick={() => p.onVerifyPool(pool.id)} className="flex items-center gap-1 rounded-lg bg-[#0F4C3A] px-2.5 py-1 text-[11px] font-bold text-white active:scale-95"><Check size={13} weight="bold" /> Verify Batch</button>
                            ) : (
                              <span className="text-[11px] font-semibold text-amber-600">Pooling…</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {zones.length === 0 && <div className="py-6 text-center text-xs text-zinc-400">No active pooling zones.</div>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#052e16]"><Storefront size={16} weight="fill" className="text-[#EA580C]" /> Wholesaler Control</div>
            <div className="space-y-2">
              {p.wholesalers.map((w) => (
                <div key={w.id} className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-zinc-800">{w.company}</div>
                      <div className="truncate text-[10px] text-zinc-500">{w.name} · {w.marketHub}</div>
                    </div>
                    {w.approved ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700"><CheckCircle size={12} weight="fill" /> Live</span>
                    ) : (
                      <button onClick={() => p.onApproveWholesaler(w.id)} className="flex items-center gap-1 rounded-full bg-[#0F4C3A] px-2.5 py-1 text-[10px] font-bold text-white active:scale-95"><ShieldCheck size={12} weight="fill" /> Approve</button>
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-zinc-400">
                    <span className="font-mono">{w.supplierId}</span>
                    <span className="flex items-center gap-0.5"><Flame size={11} className="text-[#F59E0B]" weight="fill" /> {w.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-sm font-black text-[#052e16]"><Package size={16} weight="fill" className="text-[#EA580C]" /> Catalog Oversight</div>
            <div className="text-[11px] text-zinc-500">Total SKUs live across all hubs.</div>
            <div className="mt-2 font-mono text-3xl font-black tabular-nums text-[#0F4C3A]">{p.products.length}</div>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><CheckCircle size={13} weight="fill" /> Cold-chain verified</div>
          </div>
        </div>
      </div>
    </div>
  );
}
