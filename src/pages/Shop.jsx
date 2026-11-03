import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "../data/products";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const money = (n) => `GHS ${n.toFixed(2)}`;

const TONES = {
  yogur: "from-stone-100 to-amber-100",
  chills: "from-amber-50 to-orange-200",
  oven: "from-amber-100 to-yellow-300",
  boba: "from-stone-200 to-amber-200",
  bev: "from-amber-50 to-orange-200",
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

function ProductCard({ product, sel, setSel }) {
  const [vi, setVi] = useState(0); // selected size or pack
  const variant = product.variants[vi];
  const key = `${product.id}|${vi}`;
  const qty = sel[key] || 0;
  const picked = product.variants.reduce((n, _, i) => n + (sel[`${product.id}|${i}`] || 0), 0);

  return (
    <article className="group flex flex-col">
      <div
        className={`relative aspect-[4/5] overflow-hidden rounded-sm bg-gradient-to-b ${
          TONES[product.category] || TONES.yogur
        } transition-transform duration-500 group-hover:-translate-y-1`}
      >
        {product.image ? (
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-serif text-7xl text-[#14110D]/15">
            {product.name[0]}
          </span>
        )}
        {picked > 0 && (
          <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[#B8892D] text-sm font-semibold text-black shadow">
            {picked}
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
            onClick={() => setSel((s) => ({ ...s, [key]: 1 }))}
            className="w-full rounded-full bg-[#14110D] py-2 text-sm text-[#F6F1E7] hover:bg-[#B8892D] hover:text-black"
          >
            Choose
          </button>
        ) : (
          <Stepper
            qty={qty}
            onChange={(q) =>
              setSel((s) => {
                const next = { ...s };
                if (q <= 0) delete next[key];
                else next[key] = q;
                return next;
              })
            }
          />
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
  const [sel, setSel] = useState({}); // what the visitor has picked so far: { "productId|variantIndex": quantity }
  const { requireAuth } = useAuth();
  const { addMany } = useCart();
  const navigate = useNavigate();

  const activeCategory = CATEGORIES.find((c) => c.id === active);
  const visible = useMemo(
    () => (active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active]
  );

  const picked = Object.entries(sel).reduce(
    (acc, [key, qty]) => {
      const [id, vi] = key.split("|");
      const price = PRODUCTS.find((p) => p.id === id)?.variants[Number(vi)]?.price ?? 0;
      return { count: acc.count + qty, total: acc.total + qty * price };
    },
    { count: 0, total: 0 }
  );

  // Anyone can browse and pick. Adding to the cart needs an account, so the login panel slides in if needed.
  const addToCart = () =>
    requireAuth(() => {
      addMany(sel);
      setSel({});
      navigate("/cart");
    });

  return (
    <main className="min-h-screen bg-[#F6F1E7] px-6 pb-40 pt-32 text-[#14110D] md:px-16">
      <p className="text-sm tracking-[0.3em] text-[#B8892D]">ROYAL CREST</p>
      <h1 className="mt-4 max-w-3xl font-serif" style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", lineHeight: 1 }}>
        Royal Crest Categories
      </h1>

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
                <ProductCard key={p.id} product={p} sel={sel} setSel={setSel} />
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

      {/* appears once something is picked */}
      {picked.count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[#14110D] px-6 py-4 text-[#F6F1E7] shadow-2xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <p className="text-sm">
              <span className="font-medium">{picked.count}</span> {picked.count === 1 ? "item" : "items"} ·{" "}
              <span className="text-[#D9B45A]">{money(picked.total)}</span>
            </p>
            <button
              onClick={addToCart}
              className="flex items-center gap-2 rounded-full bg-[#D9B45A] px-6 py-3 text-sm font-medium text-black hover:bg-[#e6c571]"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
