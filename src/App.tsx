import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import Navbar from "@/components/Navbar";
import CustomerMarketplace from "@/components/CustomerMarketplace";
import WholesalerPortal from "@/components/WholesalerPortal";
import AdminOperations from "@/components/AdminOperations";
import type {
  CartItem,
  CustomerProfile,
  JointBuyPool,
  Order,
  Product,
  Role,
  WholesalerProfile,
} from "@/types";
import {
  DEFAULT_CUSTOMER,
  PRODUCTS,
  SEED_ORDERS,
  SEED_POOLS,
  WHOLESALERS,
  formatNaira,
  load,
  resetAll,
  save,
} from "@/data/mockData";

export default function App() {
  const [role, setRole] = useState<Role>(() => load("role", "customer" as Role));
  const [products, setProducts] = useState<Product[]>(() => load("products", PRODUCTS));
  const [cart, setCart] = useState<CartItem[]>(() => load("cart", [] as CartItem[]));
  const [orders, setOrders] = useState<Order[]>(() => load("orders", SEED_ORDERS));
  const [pools, setPools] = useState<JointBuyPool[]>(() => load("pools", SEED_POOLS));
  const [customer, setCustomer] = useState<CustomerProfile>(() => load("customer", DEFAULT_CUSTOMER));
  const [wholesaler, setWholesaler] = useState<WholesalerProfile>(() => load("wholesaler", WHOLESALERS[0]));
  const [wholesalers, setWholesalers] = useState<WholesalerProfile[]>(() => load("wholesalers", WHOLESALERS));

  const [cartOpen, setCartOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  useEffect(() => save("role", role), [role]);
  useEffect(() => save("products", products), [products]);
  useEffect(() => save("cart", cart), [cart]);
  useEffect(() => save("orders", orders), [orders]);
  useEffect(() => save("pools", pools), [pools]);
  useEffect(() => save("customer", customer), [customer]);
  useEffect(() => save("wholesaler", wholesaler), [wholesaler]);
  useEffect(() => save("wholesalers", wholesalers), [wholesalers]);

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty * (i.jointBuy ? 0.8 : 1), 0), [cart]);
  const notifications = useMemo(() => orders.filter((o) => o.status === "pending").length, [orders]);

  const switchRole = (r: Role) => {
    setRole(r);
    const label = r === "customer" ? "Buying mode" : r === "wholesaler" ? "Wholesaler Hub" : "Admin Control";
    toast.success(`Switched to ${label}`);
  };

  const addToCart = (item: CartItem) => {
    setCart((c) => [...c, item]);
    toast.success(`${item.productTitle} added · ${formatNaira(item.price * item.qty)}`);
  };
  const removeFromCart = (id: string) => setCart((c) => c.filter((x) => x.id !== id));
  const updateQty = (id: string, qty: number) => setCart((c) => c.map((x) => (x.id === id ? { ...x, qty } : x)));
  const toggleJointBuy = (id: string) =>
    setCart((c) => c.map((x) => (x.id === id ? { ...x, jointBuy: !x.jointBuy } : x)));

  const placeOrder = (note: string, payment: Order["paymentMethod"]) => {
    if (cart.length === 0) {
      toast.error("Your basket is empty");
      return;
    }
    if (!customer.verified) {
      setOnboardingOpen(true);
      toast.error("Complete KYC before ordering");
      return;
    }
    const first = cart[0];
    const prod = products.find((x) => x.id === first.productId);
    const order: Order = {
      id: `o-${Date.now()}`,
      customerName: customer.name || "Guest Buyer",
      customerPhone: customer.phone,
      zone: customer.zone,
      lines: cart.map((c) => ({ productId: c.productId, productTitle: c.productTitle, unit: c.unit, price: c.price, qty: c.qty, jointBuy: c.jointBuy, zone: c.zone })),
      total: cartTotal,
      status: "pending",
      createdAt: Date.now(),
      deliveryNote: note,
      paymentMethod: payment,
      wholesalerId: prod?.wholesalerId || wholesaler.id,
    };
    setOrders((o) => [order, ...o]);

    setPools((ps) => {
      let next = [...ps];
      cart.filter((c) => c.jointBuy).forEach((c) => {
        const idx = next.findIndex((x) => x.productId === c.productId && x.zone === c.zone);
        if (idx >= 0) {
          next[idx] = { ...next[idx], pooledUnits: next[idx].pooledUnits + c.qty, participants: [...next[idx].participants, customer.name || "Buyer"] };
        } else {
          next = [
            ...next,
            { id: `j-${Date.now()}-${c.productId}`, productId: c.productId, productTitle: c.productTitle, unit: c.unit, zone: c.zone, targetUnits: 2, pooledUnits: c.qty, participants: [customer.name || "Buyer"], discountPct: 20, status: "open" },
          ];
        }
      });
      return next;
    });

    setCart([]);
    toast.success(`Pre-order placed · ${formatNaira(order.total)} · morning dispatch`);
  };

  const confirmReceived = (id: string) => {
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status: "delivered" } : x)));
    toast.success("Order confirmed received. Thank you!");
  };
  const dispatchOrder = (id: string) => {
    setOrders((o) => o.map((x) => (x.id === id ? { ...x, status: "dispatched" } : x)));
    toast.success("Order marked out for morning dispatch");
  };
  const saveCustomer = (c: CustomerProfile) => {
    setCustomer(c);
    toast.success("KYC verified · welcome to Kasuwane");
  };

  const addProduct = (prod: Product) => {
    setProducts((ps) => [prod, ...ps]);
    toast.success(`${prod.title} published to catalog`);
  };
  const updateProduct = (id: string, patch: Partial<Product>) => {
    setProducts((ps) => ps.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };
  const deleteProduct = (id: string) => setProducts((ps) => ps.filter((x) => x.id !== id));
  const saveWholesaler = (w: WholesalerProfile) => {
    setWholesaler(w);
    setWholesalers((ws) => ws.map((x) => (x.id === w.id ? w : x)));
    toast.success("Vendor profile updated");
  };
  const approveWholesaler = (id: string) => {
    setWholesalers((ws) => ws.map((x) => (x.id === id ? { ...x, approved: true } : x)));
    toast.success("Wholesaler approved and live");
  };
  const verifyPool = (id: string) => {
    setPools((ps) => ps.map((x) => (x.id === id ? { ...x, status: "dispatched" } : x)));
    toast.success("Joint-buy batch verified and dispatched");
  };

  const openNotifications = () => {
    setRole("admin");
    toast.info("Opening live operations feed");
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-zinc-900">
      <Toaster position="top-center" richColors closeButton />
      <Navbar
        role={role}
        onRole={switchRole}
        cartCount={cart.reduce((s, i) => s + i.qty, 0)}
        cartTotal={cartTotal}
        onOpenCart={() => setCartOpen(true)}
        onOpenOrders={() => setOrdersOpen(true)}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        verified={customer.verified}
        customerName={customer.name}
        notifications={notifications}
        onOpenNotifications={openNotifications}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          {role === "customer" && (
            <CustomerMarketplace
              products={products}
              cart={cart}
              orders={orders}
              pools={pools}
              customer={customer}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onUpdateQty={updateQty}
              onToggleJointBuy={toggleJointBuy}
              onPlaceOrder={placeOrder}
              onConfirmReceived={confirmReceived}
              onSaveCustomer={saveCustomer}
              cartOpen={cartOpen}
              setCartOpen={setCartOpen}
              ordersOpen={ordersOpen}
              setOrdersOpen={setOrdersOpen}
              onboardingOpen={onboardingOpen}
              setOnboardingOpen={setOnboardingOpen}
            />
          )}
          {role === "wholesaler" && (
            <WholesalerPortal
              wholesaler={wholesaler}
              products={products}
              orders={orders}
              onSaveProfile={saveWholesaler}
              onAddProduct={addProduct}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
              onDispatch={dispatchOrder}
            />
          )}
          {role === "admin" && (
            <AdminOperations
              orders={orders}
              products={products}
              pools={pools}
              wholesalers={wholesalers}
              onDispatch={dispatchOrder}
              onApproveWholesaler={approveWholesaler}
              onVerifyPool={verifyPool}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <footer className="border-t border-emerald-900/10 bg-[#052e16] px-4 py-6 text-center">
        <div className="text-sm font-black uppercase tracking-tight text-amber-300">Kasuwane</div>
        <div className="mt-1 text-[11px] text-emerald-100/60">The Morning Market · Fresh produce before sunrise · Nigeria</div>
        <button
          onClick={() => { resetAll(); toast("Demo data reset"); setTimeout(() => window.location.reload(), 600); }}
          className="mt-3 rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold text-emerald-100/70 transition hover:bg-white/10"
        >
          Reset demo data
        </button>
      </footer>
    </div>
  );
}
