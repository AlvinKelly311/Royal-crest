import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { FaWhatsapp, FaTiktok, FaInstagram } from "react-icons/fa6";
import { CATEGORIES, PRODUCTS } from "../data/products";
import SealRing from "./SealRing";

const WHATSAPP_NUMBER = "233594236150"; // confirm this number is registered on WhatsApp
const money = (n) => `GHS ${n.toFixed(2)}`;

const TONES = {
  yogur: "from-stone-100 to-amber-100",
  chills: "from-amber-50 to-orange-200",
  oven: "from-amber-100 to-yellow-300",
  boba: "from-stone-200 to-amber-200",
};

function Stepper({ qty, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-full border border-[#14110D] px-1 py-1">
      <button
        onClick={() => onChange(qty - 1)}
        className="grid h-8 w-8 place-items-center rounded-full hover:bg-[#14110D] hover:text-[#F6F1E7]"
        aria-label="Remove one"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="text-sm font-medium tabular-nums">{qty}</span>
      <button
        onClick={() => onChange(qty + 1)}
        className="grid h-8 w-8 place-items-center rounded-full hover:bg-[#14110D] hover:text-[#F6F1E7]"
        aria-label="Add one"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function ProductCard({ product, cart, setQty }) {
  const [vi, setVi] = useState(0); // selected size or pack
  const variant = product.variants[vi];
  const key = `${product.id}|${vi}`;
  const qty = cart[key] || 0;
  const inOrder = product.variants.reduce((n, _, i) => n + (cart[`${product.id}|${i}`] || 0), 0);

  return (
    <article className="group flex flex-col">
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-sm bg-gradient-to-b ${TONES[product.category]} transition-transform duration-500 group-hover:-translate-y-1`}
      >
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-serif text-7xl text-[#14110D]/15">
            {product.name[0]}
          </span>
        )}

        {/* gold seal showing how many of this product are in the order */}
        {inOrder > 0 && (
          <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[#B8892D] text-sm font-semibold text-black shadow">
            {inOrder}
          </span>
        )}
        {!product.available && (
          <span className="absolute inset-x-0 bottom-0 bg-[#14110D]/85 py-2 text-center text-xs tracking-widest text-[#F6F1E7]">
            SOLD OUT
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-xl">{product.name}</h3>
        <span className="whitespace-nowrap text-sm text-[#14110D]/70">{money(variant.price)}</span>
      </div>
      <p className="mt-1 text-sm text-[#14110D]/60">{product.desc}</p>

      {product.variants.length > 1 && (
        <div className="mt-3 flex gap-2">
          {product.variants.map((v, i) => (
            <button
              key={v.label}
              onClick={() => setVi(i)}
              className={`rounded-full border px-3 py-1 text-xs ${
                vi === i ? "border-[#14110D] bg-[#14110D] text-[#F6F1E7]" : "border-[#14110D]/30"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4">
        {!product.available ? (
          <button disabled className="w-full rounded-full border border-[#14110D]/20 py-2 text-sm text-[#14110D]/40">
            Unavailable
          </button>
        ) : qty === 0 ? (
          <button
            onClick={() => setQty(key, 1)}
            className="w-full rounded-full bg-[#14110D] py-2 text-sm text-[#F6F1E7] hover:bg-[#B8892D] hover:text-black"
          >
            Add to order
          </button>
        ) : (
          <Stepper qty={qty} onChange={(q) => setQty(key, q)} />
        )}
      </div>
    </article>
  );
}

// shown instead of products (no prices) for a category that has not started yet
function ComingSoon({ category }) {
  return (
    <div className="grid place-items-center border border-dashed border-[#14110D]/30 px-6 py-20 text-center">
      <p className="font-serif text-4xl">{category.name}</p>
      <p className="mt-3 text-sm tracking-[0.3em] text-[#B8892D]">COMING SOON</p>
    </div>
  );
}

export default function Shop() {
  const [active, setActive] = useState("all");
  const [cart, setCart] = useState({}); // { "productId|variantIndex": quantity }
  const [mode, setMode] = useState("pickup");
  const [pay, setPay] = useState("delivery");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const setQty = (key, qty) =>
    setCart((c) => {
      const next = { ...c };
      if (qty <= 0) delete next[key];
      else next[key] = qty;
      return next;
    });

  const activeCategory = CATEGORIES.find((c) => c.id === active);
  const visible = useMemo(
    () => (active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active]
  );

  const lines = Object.entries(cart).map(([key, qty]) => {
    const [id, vi] = key.split("|");
    const p = PRODUCTS.find((x) => x.id === id);
    const v = p.variants[Number(vi)];
    return { key, qty, name: p.name, label: v.label, price: v.price, showLabel: p.variants.length > 1 };
  });
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((n, l) => n + l.qty * l.price, 0);

  const message = [
    "Hello Royal Crest, I'd like to order:",
    ...lines.map((l) => `${l.qty} x ${l.name}${l.showLabel ? ` (${l.label})` : ""} - ${money(l.price * l.qty)}`),
    `Subtotal: ${money(total)}`,
    `${mode === "pickup" ? "Pickup" : "Delivery"}${mode === "delivery" && address ? `: ${address}` : ""}`,
    `Payment: ${pay === "online" ? "Pay online" : "Pay on delivery"}`,
    name ? `Name: ${name}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const orderUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <>
      {/* 1. light section: the menu */}
      <section id="shop" className="bg-[#F6F1E7] px-6 py-24 text-[#14110D] md:px-16 md:py-32">
        <p className="text-sm tracking-[0.3em] text-[#B8892D]">ROYAL CREST</p>
        <h2
          className="mt-4 max-w-3xl font-serif"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", lineHeight: 1 }}
        >
          Royal Crest Categories
        </h2>

        {/* category list: large type, active one underlined in gold */}
        <div className="mt-12 flex gap-x-8 gap-y-3 overflow-x-auto pb-2 md:flex-wrap md:overflow-visible">
          {[{ id: "all", name: "All" }, ...CATEGORIES].map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`whitespace-nowrap border-b-2 pb-1 font-serif text-2xl transition-colors md:text-3xl ${
                active === c.id
                  ? "border-[#B8892D] text-[#14110D]"
                  : "border-transparent text-[#14110D]/40 hover:text-[#14110D]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <p className="mt-3 h-5 text-sm text-[#14110D]/60">{activeCategory?.blurb ?? ""}</p>

        <div className="mt-12">
          {activeCategory?.comingSoon ? (
            <ComingSoon category={activeCategory} />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} cart={cart} setQty={setQty} />
                ))}
              </div>
              {active === "all" && (
                <div className="mt-16 grid gap-5 md:grid-cols-2">
                  {CATEGORIES.filter((c) => c.comingSoon).map((c) => (
                    <ComingSoon key={c.id} category={c} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 2. dark section: the turning seal */}
      <section className="bg-black px-6 py-24 text-center md:px-16 md:py-32">
        <SealRing />
        <h2
          className="mx-auto mt-10 max-w-2xl font-serif text-[#D9B45A]"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
        >
          The Mark of Prestige
        </h2>
        <Link to="/about" className="mt-6 inline-block text-sm tracking-[0.3em] text-[#D9B45A]/80 hover:text-[#D9B45A]">
          ABOUT ROYAL CREST
        </Link>
      </section>

      {/* 3. dark section: the order as a receipt */}
      <section id="order" className="bg-black px-6 pb-24 md:px-16 md:pb-32">
        <div className="mx-auto max-w-md bg-[#F6F1E7] p-8 text-[#14110D] shadow-2xl">
          <p className="text-center font-serif text-3xl">Your royal order</p>
          <p className="mt-1 text-center text-xs tracking-[0.3em] text-[#B8892D]">ROYAL CREST</p>

          <div className="my-6 border-t border-dashed border-[#14110D]/40" />

          {lines.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#14110D]/60">Nothing here yet. Add something from the menu.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {lines.map((l) => (
                <li key={l.key} className="flex justify-between gap-4">
                  <span>
                    {l.qty} × {l.name}
                    {l.showLabel && <span className="text-[#14110D]/60"> ({l.label})</span>}
                  </span>
                  <span className="tabular-nums">{money(l.qty * l.price)}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="my-6 border-t border-dashed border-[#14110D]/40" />
          <div className="flex justify-between font-serif text-xl">
            <span>Subtotal</span>
            <span className="tabular-nums">{money(total)}</span>
          </div>
          <p className="mt-1 text-xs text-[#14110D]/60">Any delivery fee is confirmed on WhatsApp.</p>

          <div className="mt-6 grid grid-cols-2 gap-2 text-sm">
            {[["pickup", "Pickup"], ["delivery", "Delivery"]].map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-full border py-2 ${
                  mode === m ? "border-[#14110D] bg-[#14110D] text-[#F6F1E7]" : "border-[#14110D]/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="mt-5 text-xs tracking-[0.2em] text-[#14110D]/60">PAYMENT</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            {[["online", "Pay online"], ["delivery", "Pay on delivery"]].map(([m, label]) => (
              <button
                key={m}
                onClick={() => setPay(m)}
                className={`rounded-full border py-2 ${
                  pay === m ? "border-[#14110D] bg-[#14110D] text-[#F6F1E7]" : "border-[#14110D]/30"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#14110D]/60">Bulk orders are paid for first.</p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-4 w-full border-b border-[#14110D]/30 bg-transparent py-2 text-sm outline-none focus:border-[#B8892D]"
          />
          {mode === "delivery" && (
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery address"
              className="mt-2 w-full border-b border-[#14110D]/30 bg-transparent py-2 text-sm outline-none focus:border-[#B8892D]"
            />
          )}

          <a
            href={count ? orderUrl : undefined}
            aria-disabled={!count}
            className={`mt-8 flex items-center justify-center gap-2 rounded-full py-3 font-medium ${
              count ? "bg-[#14110D] text-[#F6F1E7] hover:bg-[#B8892D] hover:text-black" : "bg-[#14110D]/20 text-[#14110D]/40"
            }`}
          >
            <FaWhatsapp className="h-5 w-5" />
            Order on WhatsApp
          </a>
        </div>

        <footer className="mx-auto mt-20 flex max-w-md items-center justify-center gap-6 text-[#D9B45A]">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} aria-label="WhatsApp"><FaWhatsapp className="h-6 w-6" /></a>
          <a href="https://www.tiktok.com/@royalcrest0" aria-label="TikTok"><FaTiktok className="h-6 w-6" /></a>
          {/* confirm the exact Instagram handle with the client before launch */}
          <a href="https://www.instagram.com/" aria-label="Instagram"><FaInstagram className="h-6 w-6" /></a>
        </footer>
      </section>

      {/* floating shortcut to the order card once something is added */}
      {count > 0 && (
        <a
          href="#order"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#D9B45A] px-5 py-3 text-sm font-medium text-black shadow-xl"
        >
          <ShoppingBag className="h-5 w-5" />
          {count} · {money(total)}
        </a>
      )}
    </>
  );
}
