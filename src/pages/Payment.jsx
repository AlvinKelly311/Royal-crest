import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { api, ApiError } from "../lib/api";

const money = (n) => `GHS ${n.toFixed(2)}`;

// Only MTN MoMo is connected. The MTN MoMo API cannot charge Telecel or AirtelTigo wallets.
const NETWORKS = [
  { name: "MTN MoMo", enabled: true },
  { name: "Telecel Cash", enabled: false },
  { name: "AirtelTigo Money", enabled: false },
];

const field =
  "w-full border-b border-white/25 bg-transparent py-3 text-sm text-[#f5f0e6] outline-none placeholder:text-white/35 focus:border-[#d9b45a]";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// 0241234567 -> 233241234567 (digits only, with country code)
const toMsisdn = (v) => v.replace(/\D/g, "").replace(/^0/, "233");

/*
  The server works out the total itself from its own price list, creates the order as PENDING,
  and asks MTN to send a payment request to the customer's phone. Only the server marks it PAID.
*/
async function startPayment({ order, momoNumber }) {
  const { orderId } = await api("/api/payments/momo/initiate", {
    method: "POST",
    body: JSON.stringify({
      items: order.lines.map((l) => ({
        productId: l.key.split("|")[0], // key looks like "y3|0": product id, then variant index
        variant: l.label,
        quantity: l.qty,
      })),
      phone: toMsisdn(momoNumber),
      customer: {
        name: order.name,
        phone: order.phone,
        mode: order.mode,
        address: order.address || undefined,
      },
    }),
  });
  return orderId;
}

// Checks every 3 seconds (about 2 minutes) until the order is PAID or FAILED.
async function waitForResult(orderId) {
  for (let i = 0; i < 40; i++) {
    await wait(3000);
    try {
      const { status } = await api(`/api/payments/momo/status/${orderId}`);
      if (status === "PAID" || status === "FAILED") return status;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) throw err;
      // otherwise a network blip: keep checking
    }
  }
  return "TIMEOUT";
}

export default function Payment() {
  const { order, clearCart } = useCart();
  const { ready, requireAuth, openAuth, signOut } = useAuth();
  const [network, setNetwork] = useState(NETWORKS[0].name);
  const [momoNumber, setMomoNumber] = useState(order?.phone || "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [paidTotal, setPaidTotal] = useState(null);

  // payment finished: show this before the "no order" redirect, because the cart is cleared
  if (paidTotal !== null) {
    return (
      <main className="min-h-screen bg-[#0b0b0a] px-6 pb-24 pt-32 text-[#f5f0e6] md:px-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm tracking-[0.3em] text-[#d9b45a]">ROYAL CREST</p>
          <h1 className="mt-4 font-serif" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1 }}>
            Payment received
          </h1>
          <p className="mt-6 text-white/70">Thank you. We received {money(paidTotal)} and are preparing your order.</p>
          <Link to="/" className="mt-10 inline-block rounded-full bg-[#d9b45a] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-black hover:bg-[#e6c571]">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  // nothing to pay for: go back to the cart
  if (!order) return <Navigate to="/cart" replace />;

  const runPayment = async () => {
    setBusy(true);
    setMessage("");
    try {
      const orderId = await startPayment({ order, momoNumber });
      setWaiting(true);
      const result = await waitForResult(orderId);
      if (result === "PAID") {
        setPaidTotal(order.total);
        clearCart?.();
      } else if (result === "FAILED") {
        setMessage("The payment was declined or cancelled. Please try again.");
      } else {
        setMessage("We have not received confirmation yet. Check your MoMo messages before trying again, so you are not charged twice.");
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        signOut(); // token expired: clear it and ask them to sign in again
        openAuth(runPayment);
      } else {
        setMessage(err.message);
      }
    } finally {
      setBusy(false);
      setWaiting(false);
    }
  };

  // Sign-in is required to pay. requireAuth opens your login drawer and continues after login.
  const pay = () => {
    setMessage("");
    if (!momoNumber.trim()) {
      setMessage("Please enter your Mobile Money number.");
      return;
    }
    if (!ready) return;
    requireAuth(runPayment);
  };

  return (
    <main className="min-h-screen bg-[#0b0b0a] px-6 pb-24 pt-32 text-[#f5f0e6] md:px-16">
      <div className="mx-auto max-w-xl">
        <p className="text-sm tracking-[0.3em] text-[#d9b45a]">ROYAL CREST</p>
        <h1 className="mt-4 font-serif" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1 }}>
          Pay online
        </h1>

        {/* order summary */}
        <section className="mt-10 border border-white/15 p-6">
          <ul className="space-y-2 text-sm">
            {order.lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-4">
                <span>
                  {l.qty} × {l.name}
                  {l.showLabel && <span className="text-white/50"> ({l.label})</span>}
                </span>
                <span className="tabular-nums">{money(l.qty * l.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-white/15 pt-5 font-serif text-2xl text-[#d9b45a]">
            <span>Total</span>
            <span className="tabular-nums">{money(order.total)}</span>
          </div>
          <p className="mt-4 text-xs text-white/50">
            {order.mode === "pickup" ? "Pickup" : `Delivery to ${order.address}`} · {order.name} · {order.phone}
          </p>
        </section>

        {/* Mobile Money details */}
        <section className="mt-8">
          <p className="text-xs uppercase tracking-[0.25em] text-white/50">Mobile Money network</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {NETWORKS.map((n) => (
              <button
                key={n.name}
                disabled={!n.enabled || busy}
                onClick={() => setNetwork(n.name)}
                className={`border px-3 py-3 text-sm transition-colors ${
                  !n.enabled
                    ? "cursor-not-allowed border-white/10 text-white/25"
                    : network === n.name
                    ? "border-[#d9b45a] bg-[#d9b45a]/10 text-[#d9b45a]"
                    : "border-white/15 hover:border-white/40"
                }`}
              >
                {n.name}
                {!n.enabled && <span className="block text-[10px] uppercase tracking-widest">Soon</span>}
              </button>
            ))}
          </div>

          <input
            className={`${field} mt-6`}
            type="tel"
            placeholder="MTN Mobile Money number"
            value={momoNumber}
            onChange={(e) => setMomoNumber(e.target.value)}
            disabled={busy}
          />

          {waiting && (
            <p className="mt-4 text-sm text-[#d9b45a]">
              A payment request was sent to your phone. Enter your MoMo PIN to approve {money(order.total)}.
            </p>
          )}
          {message && <p className="mt-4 text-sm text-amber-300">{message}</p>}

          <button
            onClick={pay}
            disabled={busy}
            className="mt-8 w-full rounded-full bg-[#d9b45a] py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-black hover:bg-[#e6c571] disabled:opacity-60"
          >
            {busy ? (waiting ? "Waiting for approval..." : "Please wait...") : `Pay ${money(order.total)}`}
          </button>

          <Link to="/cart" className="mt-6 block text-center text-xs uppercase tracking-[0.25em] text-white/50 hover:text-white">
            Back to cart
          </Link>
        </section>
      </div>
    </main>
  );
}
