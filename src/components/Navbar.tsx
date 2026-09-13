import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ClockCountdown,
  IdentificationCard,
  ShoppingBag,
  Storefront,
  UserGear,
  Users,
} from "@phosphor-icons/react";
import type { Role } from "@/types";
import { formatNaira } from "@/data/mockData";

interface NavbarProps {
  role: Role;
  onRole: (r: Role) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenOnboarding: () => void;
  verified: boolean;
  customerName: string;
  notifications: number;
  onOpenNotifications: () => void;
}

const ROLES: { key: Role; label: string; icon: typeof Users }[] = [
  { key: "customer", label: "Buy", icon: ShoppingBag },
  { key: "wholesaler", label: "Sell", icon: Storefront },
  { key: "admin", label: "Operate", icon: UserGear },
];

function useNextMorningCountdown(): string {
  const [left, setLeft] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const target = new Date(now);
      target.setHours(6, 0, 0, 0);
      if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);
      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}

export default function Navbar(p: NavbarProps) {
  const countdown = useNextMorningCountdown();

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-[#052e16]/95 backdrop-blur-md">
      <div className="bg-gradient-to-r from-[#F59E0B] via-[#EA580C] to-[#DC2626] text-[11px] sm:text-xs font-semibold text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-1.5">
          <ClockCountdown size={14} weight="fill" className="shrink-0" />
          <span className="truncate">
            Next-morning 06:00 dispatch in{" "}
            <span className="font-mono tabular-nums tracking-tight">{countdown}</span>
          </span>
        </div>
      </div>

      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-3 sm:px-6">
        <div className="flex items-center gap-2 min-w-0">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F59E0B] text-[#052e16] shadow-lg shadow-amber-500/30">
            <Storefront size={20} weight="fill" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-black uppercase tracking-tight text-white sm:text-base">
              Kasuwane
            </div>
            <div className="hidden text-[10px] font-medium text-amber-300/90 sm:block">
              The Morning Market
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={p.onOpenNotifications}
            className="relative grid h-9 w-9 place-items-center rounded-full text-emerald-100 transition hover:bg-white/10 active:scale-95"
            aria-label="Notifications"
          >
            <Bell size={18} weight="fill" />
            {p.notifications > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#DC2626] px-1 text-[9px] font-bold text-white">
                {p.notifications}
              </span>
            )}
          </button>

          {p.role === "customer" && (
            <>
              <button
                onClick={p.onOpenOrders}
                className="hidden h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-emerald-100 transition hover:bg-white/10 active:scale-95 sm:flex"
              >
                <Users size={16} />
                My Orders
              </button>
              <button
                onClick={p.onOpenOnboarding}
                className={`hidden h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition active:scale-95 sm:flex ${
                  p.verified
                    ? "bg-emerald-800/60 text-amber-200"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <IdentificationCard size={16} />
                {p.verified ? p.customerName.split(" ")[0] || "Verified" : "Verify KYC"}
              </button>
              <button
                onClick={p.onOpenCart}
                className="relative flex h-9 items-center gap-1.5 rounded-full bg-[#F59E0B] px-3 text-xs font-bold text-[#052e16] shadow-lg shadow-amber-500/30 transition hover:bg-[#FBBF24] active:scale-95"
              >
                <ShoppingBag size={16} weight="fill" />
                <span className="font-mono tabular-nums">{p.cartCount}</span>
                <span className="hidden font-mono tabular-nums sm:inline">
                  {formatNaira(p.cartTotal)}
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 pb-2 sm:px-6">
        <div className="flex items-center gap-1 rounded-full bg-white/10 p-1">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const active = p.role === r.key;
            return (
              <button
                key={r.key}
                onClick={() => p.onRole(r.key)}
                className="relative flex-1 rounded-full px-2 py-1.5 text-xs font-semibold transition active:scale-95"
              >
                {active && (
                  <motion.div
                    layoutId="role-pill"
                    className="absolute inset-0 rounded-full bg-[#F59E0B] shadow-md shadow-amber-500/40"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative flex items-center justify-center gap-1.5 ${
                    active ? "text-[#052e16]" : "text-emerald-100"
                  }`}
                >
                  <Icon size={14} weight={active ? "fill" : "regular"} />
                  <span className="truncate">{r.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
