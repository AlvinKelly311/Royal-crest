import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Store, Trash2, Truck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const WHATSAPP_NUMBER = "233594236150"; // the owner's WhatsApp
const money = (n) => `GHS ${n.toFixed(2)}`;

const field =
  "w-full border-b border-white/25 bg-transparent py-3 text-sm text-[#f5f0e6] outline-none placeholder:text-white/35 focus:border-[#d9b45a]";

function Choice({ active, onClick, icon, title, note }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-4 border p-5 text-left transition-colors ${
        active ? "border-[#d9b45a] bg-[#d9b45a]/10" : "border-white/15 hover:border-white/40"
      }`}
    >
      <span className="mt-0.5 text-[#d9b45a]">{icon}</span>
      <span>
        <span className="block font-serif text-xl">{title}</span>
        {note && <span className="mt-1 block text-xs text-white/50">{note}</span>}
      </span>
    </button>
  );
}

export default function Cart() {
  const { user } = useAuth();
  const { lines, subtotal, setQty, clear, setOrder } = useCart();
  const navigate = useNavigate();

  const [mode, setMode] = useState(null); // "pickup" | "delivery"
  const [pay, setPay] = useState(null); // "online" | "delivery"
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const total = subtotal; // delivery fee, if any, is confirmed with the owner

  const validate = () => {
    if (!name.trim() || !phone.trim()) return "Please enter your name and phone number.";
    if (mode === "delivery" && !address.trim()) return "Please enter your delivery address.";
    return "";
  };

  const buildMessage = () =>
    [
      "Hello Royal Crest, I'd like to order:",
      ...lines.map(
        (l) => `${l.qty} x ${l.name}${l.showLabel ? ` (${l.label})` : ""} - ${money(l.price * l.qty)}`
      ),
      `Subtotal: ${money(subtotal)}`,
      `Total: ${money(total)}`,
      mode === "pickup" ? "Pickup" : `Delivery: ${address}`,
      `Payment: ${mode === "pickup" ? "Pay at pickup" : "Pay on delivery"}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      user?.email ? `Email: ${user.email}` : "",
    ]
      .filter(Boolean)
      .join("\n");

  const submit = () => {
    const problem = validate();
    setError(problem);
    if (problem) return;

    if (pay === "online") {
      // hand the details to the payment page
      setOrder({ mode, address, name, phone, total, lines });
      navigate("/payment");
      return;
    }

    // pay on delivery: send the order to the owner's WhatsApp
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`, "_blank");
    setSent(true);
  };

  // ---------- empty cart ----------
  if (lines.length === 0) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0b0b0a] px-6 pt-20 text-center text-[#f5f0e6]">
        <div>
          <h1 className="font-serif text-5xl text-[#d9b45a]">{sent ? "Order sent" : "Your cart is empty"}</h1>
          <p className="mt-4 text-white/55">
            {sent ? "Send the message in WhatsApp to finish your order." : "Add something from the shop to get started."}
          </p>
          <Link
            to="/shop"
            className="mt-10 inline-block rounded-full bg-[#d9b45a] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-black"
          >
            Go to the shop
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0a] px-6 pb-24 pt-32 text-[#f5f0e6] md:px-16">
      <p className="text-sm tracking-[0.3em] text-[#d9b45a]">ROYAL CREST</p>
      <h1 className="mt-4 font-serif" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1 }}>
        Your cart
      </h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        {/* items */}
        <section>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-4 py-5">
                <div className="h-24 w-20 shrink-0 overflow-hidden bg-white/5">
                  {l.image && <img src={l.image} alt={l.name} className="h-full w-full object-cover" />}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="font-serif text-xl">{l.name}</p>
                      {l.showLabel && <p className="text-xs text-white/50">{l.label}</p>}
                      <p className="mt-1 text-sm text-white/60">{money(l.price)} each</p>
                    </div>
                    <p className="tabular-nums">{money(l.price * l.qty)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full border border-white/25 px-1 py-1">
                      <button
                        onClick={() => setQty(l.key, l.qty - 1)}
                        className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10"
                        aria-label="Remove one"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-5 text-center text-sm tabular-nums">{l.qty}</span>
                      <button
                        onClick={() => setQty(l.key, l.qty + 1)}
                        className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/10"
                        aria-label="Add one"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => setQty(l.key, 0)}
                      className="text-white/40 hover:text-red-400"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-white/50">
            Ordering in bulk?{" "}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#d9b45a] underline underline-offset-4"
            >
              Contact us
            </a>
            .
          </p>
        </section>

        {/* summary and checkout */}
        <aside className="h-fit border border-white/15 p-6 md:p-8">
          <div className="flex justify-between text-sm text-white/70">
            <span>Subtotal</span>
            <span className="tabular-nums">{money(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-white/40">Any delivery fee is confirmed with Royal Crest.</p>
          <div className="mt-5 flex justify-between border-t border-white/15 pt-5 font-serif text-2xl text-[#d9b45a]">
            <span>Total</span>
            <span className="tabular-nums">{money(total)}</span>
          </div>

          {/* step 1: pickup or delivery */}
          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-white/50">How would you like to get it?</p>
          <div className="mt-3 grid gap-3">
            <Choice
              active={mode === "pickup"}
              onClick={() => {
                setMode("pickup");
                setError("");
              }}
              icon={<Store className="h-5 w-5" />}
              title="Pickup"
            />
            <Choice
              active={mode === "delivery"}
              onClick={() => {
                setMode("delivery");
                setError("");
              }}
              icon={<Truck className="h-5 w-5" />}
              title="Delivery"
            />
          </div>

          {/* step 2: payment (only after pickup or delivery is chosen) */}
          {mode && (
            <>
              <p className="mt-8 text-xs uppercase tracking-[0.25em] text-white/50">How would you like to pay?</p>
              <div className="mt-3 grid gap-3">
                <Choice
                  active={pay === "online"}
                  onClick={() => setPay("online")}
                  icon={<span className="font-serif text-lg">₵</span>}
                  title="Pay online"
                  note="Mobile Money"
                />
                <Choice
                  active={pay === "delivery"}
                  onClick={() => setPay("delivery")}
                  icon={<FaWhatsapp className="h-5 w-5" />}
                  title={mode === "pickup" ? "Pay at pickup" : "Pay on delivery"}
                  note="Your order is sent to us on WhatsApp"
                />
              </div>
            </>
          )}

          {/* step 3: details and confirm */}
          {mode && pay && (
            <>
              <div className="mt-8 space-y-4">
                <input className={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                <input
                  className={field}
                  type="tel"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {mode === "delivery" && (
                  <input
                    className={field}
                    placeholder="Delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                )}
              </div>

              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

              <button
                onClick={submit}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#d9b45a] py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-black hover:bg-[#e6c571]"
              >
                {pay === "online" ? (
                  "Continue to payment"
                ) : (
                  <>
                    <FaWhatsapp className="h-5 w-5" /> Send order on WhatsApp
                  </>
                )}
              </button>

              {sent && (
                <button onClick={clear} className="mt-4 w-full text-xs uppercase tracking-[0.25em] text-white/50 hover:text-white">
                  I've sent it, clear my cart
                </button>
              )}
            </>
          )}
        </aside>
      </div>
    </main>
  );
}
