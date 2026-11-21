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
  const [vi, setVi] = useState(0);
  const variant = product.variants[vi];
  const key = `${product.id}|${vi}`;
  const qty = sel[key] || 0;

  const picked = product.variants.reduce(
    (n, _, i) => n + (sel[`${product.id}|${i}`] || 0),
    0
  );

  return (
    <article className="group flex h-full min-w-0 flex-col">
      {/* Product image: same aspect ratio for every card */}
      <div
        className={`relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-sm bg-gradient-to-b ${
          TONES[product.category] || TONES.yogur
        } transition-transform duration-500 group-hover:-translate-y-1`}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-serif text-5xl text-[#14110D]/15 sm:text-7xl">
            {product.name[0]}
          </span>
        )}

        {picked > 0 && (
          <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-[#B8892D] text-xs font-semibold text-black shadow sm:right-3 sm:top-3 sm:h-9 sm:w-9 sm:text-sm">
            {picked}
          </span>
        )}

        {!product.available && (
          <span className="absolute inset-x-0 bottom-0 bg-[#14110D]/85 py-1.5 text-center text-[10px] tracking-widest text-[#F6F1E7] sm:py-2 sm:text-xs">
            SOLD OUT
          </span>
        )}
      </div>

      {/* All information rows reserve consistent space across cards */}
      <div className="mt-3 flex min-w-0 flex-1 flex-col sm:mt-4">
        {/* Product name: fixed two-line slot */}
        <h3 className="h-12 shrink-0 overflow-hidden break-words font-serif text-base leading-6 sm:text-lg">
          {product.name}
        </h3>

        {/* Price: always below the product name */}
        <div className="mt-1 flex h-6 shrink-0 items-center">
          <span className="whitespace-nowrap text-xs text-[#14110D]/70 sm:text-sm">
            {money(variant.price)}
          </span>
        </div>

        {/* Description: consistent three-line slot */}
        <p className="mt-1 h-[4.5rem] shrink-0 overflow-hidden text-xs leading-6 text-[#14110D]/65 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:text-sm">
          {product.desc}
        </p>

        {/* Always reserve this row, including products with one variant */}
        <div className="mt-2 flex h-8 shrink-0 items-start gap-2 overflow-hidden">
          {product.variants.length > 1 &&
            product.variants.map((v, i) => (
              <button
                key={v.label}
                type="button"
                onClick={() => setVi(i)}
                className={`whitespace-nowrap rounded-full border px-3 py-1 text-[10px] sm:text-xs ${
                  vi === i
                    ? "border-[#14110D] bg-[#14110D] text-[#F6F1E7]"
                    : "border-[#14110D]/30"
                }`}
              >
                {v.label}
              </button>
            ))}
        </div>

        {/* Pin the action to the bottom of every card */}
        <div className="mt-auto pt-2">
          {!product.available ? (
            <button
              disabled
              className="w-full rounded-full border border-[#14110D]/20 py-2 text-xs text-[#14110D]/40 sm:py-2.5 sm:text-sm"
            >
              Unavailable
            </button>
          ) : qty === 0 ? (
            <button
              onClick={() => setSel((s) => ({ ...s, [key]: 1 }))}
              className="w-full rounded-full bg-[#14110D] py-2 text-xs text-[#F6F1E7] hover:bg-[#B8892D] hover:text-black sm:py-2.5 sm:text-sm"
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
      </div>
    </article>
  );
}

// Shown instead of products (no prices) for a category that has not started yet.
function ComingSoon({ category }) {
  return (
    <div className="grid place-items-center border border-dashed border-[#14110D]/30 px-6 py-20 text-center">
      <p className="font-serif text-4xl">{category.name}</p>
      <p className="mt-3 text-sm tracking-[0.3em] text-[#B8892D]">
        COMING SOON
      </p>
    </div>
  );
}

export default function Shop() {
  const [active, setActive] = useState("all");
  const [sel, setSel] = useState({});
  const { requireAuth } = useAuth();
  const { addMany } = useCart();
  const navigate = useNavigate();

  const activeCategory = CATEGORIES.find((c) => c.id === active);

  const visible = useMemo(
    () =>
      active === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === active),
    [active]
  );

  const picked = Object.entries(sel).reduce(
    (acc, [key, qty]) => {
      const [id, vi] = key.split("|");
      const price =
        PRODUCTS.find((p) => p.id === id)?.variants[Number(vi)]?.price ?? 0;

      return {
        count: acc.count + qty,
        total: acc.total + qty * price,
      };
    },
    { count: 0, total: 0 }
  );

  // Anyone can browse and pick. Adding to the cart needs an account.
  const addToCart = () =>
    requireAuth(() => {
      addMany(sel);
      setSel({});
      navigate("/cart");
    });

  return (
    <main className="min-h-screen bg-[#F6F1E7] px-4 pb-40 pt-32 text-[#14110D] sm:px-6 md:px-16">
      <p className="text-sm tracking-[0.3em] text-[#B8892D]">ROYAL CREST</p>

      <h1
        className="mt-4 max-w-3xl font-serif"
        style={{
          fontSize: "clamp(2rem, 6vw, 5rem)",
          lineHeight: 1.05,
        }}
      >
        Royal Crest Categories
      </h1>

      <div className="mt-8 flex gap-x-6 gap-y-3 overflow-x-auto pb-2 sm:mt-10 md:flex-wrap md:overflow-visible">
        {[{ id: "all", name: "All" }, ...CATEGORIES].map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`whitespace-nowrap border-b-2 pb-1 font-serif text-lg transition-colors sm:text-xl md:text-3xl ${
              active === c.id
                ? "border-[#B8892D] text-[#14110D]"
                : "border-transparent text-[#14110D]/40 hover:text-[#14110D]"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="mt-3 h-5 text-sm text-[#14110D]/60">
        {activeCategory?.blurb ?? ""}
      </p>

      <div className="mt-8 sm:mt-10">
        {activeCategory?.comingSoon ? (
          <ComingSoon category={activeCategory} />
        ) : (
          <>
            <div className="grid grid-cols-2 items-stretch gap-x-3 gap-y-10 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4">
              {visible.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  sel={sel}
                  setSel={setSel}
                />
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

      {/* Appears once something is picked */}
      {picked.count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[#14110D] px-6 py-4 text-[#F6F1E7] shadow-2xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <p className="text-sm">
              <span className="font-medium">{picked.count}</span>{" "}
              {picked.count === 1 ? "item" : "items"} ·{" "}
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