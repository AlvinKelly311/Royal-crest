import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const field =
  "w-full border-b border-white/25 bg-transparent py-3 text-sm text-[#f5f0e6] outline-none placeholder:text-white/35 focus:border-[#d9b45a]";

// onDone is optional: the slide panel does not need it (the pending action runs automatically after login)
export default function AuthForm({ onDone }) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState("login");
  const [f, setF] = useState({ name: "", phone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = tab === "login" ? await signIn(f) : await signUp(f);
      onDone?.(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 border-b border-white/15 text-xs uppercase tracking-[0.25em]">
        {[
          ["login", "Log in"],
          ["signup", "Sign up"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setError("");
            }}
            className={`pb-4 transition-colors ${
              tab === id ? "border-b-2 border-[#d9b45a] text-[#d9b45a]" : "text-white/40 hover:text-white/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-8 space-y-5">
        {tab === "signup" && (
          <>
            <input className={field} placeholder="Full name" value={f.name} onChange={set("name")} autoComplete="name" />
            <input
              className={field}
              type="tel"
              placeholder="Phone number"
              value={f.phone}
              onChange={set("phone")}
              autoComplete="tel"
            />
          </>
        )}
        <input
          className={field}
          type="email"
          placeholder="Email address"
          value={f.email}
          onChange={set("email")}
          autoComplete="email"
        />
        <input
          className={field}
          type="password"
          placeholder="Password"
          value={f.password}
          onChange={set("password")}
          autoComplete={tab === "login" ? "current-password" : "new-password"}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-[#d9b45a] py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-black transition hover:bg-[#e6c571] disabled:opacity-60"
        >
          {busy ? "Please wait..." : tab === "login" ? "Log in" : "Create account"}
        </button>
      </form>
    </div>
  );
}
