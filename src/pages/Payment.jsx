import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const money = (n) => `GHS ${n.toFixed(2)}`;

const NETWORKS = ["MTN MoMo", "Telecel Cash", "AirtelTigo Money"];

const field =
  "w-full border-b border-white/25 bg-transparent py-3 text-sm text-[#f5f0e6] outline-none placeholder:text-white/35 focus:border-[#d9b45a]";

/*
  PAYMENT INTEGRATION POINT.

  startPayment() below is where the real Mobile Money gateway plugs in. Suggested flow:
    1. Send the order (items, name, phone, pickup or delivery, address) to your server. The server creates
       the order with status "pending" and works out the total itself from its own price list.
    2. The server asks the payment provider (for example Paystack, Hubtel or Flutterwave) to charge the
       customer's Mobile Money number, and returns a reference.
    3. The provider calls your server's webhook when the payment succeeds or fails. ONLY the webhook (or a
       verify call made by the server) marks the order "paid". Never mark it paid from this page.
    4. This page then shows the result (success, failed or still waiting) by checking the order's status.
  Keep secret API keys on the server only, never in this React code.
*/
async function startPayment({ order, network, momoNumber }) {
  // TODO: replace with a real call, e.g. const res = await fetch("/api/payments/start", { method: "POST", body: ... })
  console.log("Payment request (not sent anywhere yet):", { order, network, momoNumber });
  throw new Error("Online payment is not connected yet.");
}

export default function Payment() {
  const { order } = useCart();
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [momoNumber, setMomoNumber] = useState(order?.phone || "");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  // nothing to pay for: go back to the cart
  if (!order) return <Navigate to="/cart" replace />;

  const pay = async () => {
    setMessage("");
    if (!momoNumber.trim()) {
      setMessage("Please enter your Mobile Money number.");
      return;
    }
    setBusy(true);
    try {
      await startPayment({ order, network, momoNumber });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
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
                key={n}
                onClick={() => setNetwork(n)}
                className={`border px-3 py-3 text-sm transition-colors ${
                  network === n ? "border-[#d9b45a] bg-[#d9b45a]/10 text-[#d9b45a]" : "border-white/15 hover:border-white/40"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <input
            className={`${field} mt-6`}
            type="tel"
            placeholder="Mobile Money number"
            value={momoNumber}
            onChange={(e) => setMomoNumber(e.target.value)}
          />

          {message && <p className="mt-4 text-sm text-amber-300">{message}</p>}

          <button
            onClick={pay}
            disabled={busy}
            className="mt-8 w-full rounded-full bg-[#d9b45a] py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-black hover:bg-[#e6c571] disabled:opacity-60"
          >
            {busy ? "Please wait..." : `Pay ${money(order.total)}`}
          </button>

          <Link to="/cart" className="mt-6 block text-center text-xs uppercase tracking-[0.25em] text-white/50 hover:text-white">
            Back to cart
          </Link>
        </section>
      </div>
    </main>
  );
}
