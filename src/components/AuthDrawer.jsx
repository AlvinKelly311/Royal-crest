import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthForm from "./AuthForm";
import logo from "../assets/images/logo.jpg";

// The login / sign-up panel that slides in from the right when someone tries to add to cart without an account.
export default function AuthDrawer() {
  const { drawerOpen, closeDrawer } = useAuth();
  const panelRef = useRef(null);

  // while closed, keep the hidden panel out of keyboard focus (works in React 18 and 19)
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !drawerOpen;
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  return (
    <div className={`fixed inset-0 z-[70] ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-black/70 transition-opacity duration-500 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        ref={panelRef}
        className={`absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-[#0b0b0a] p-8 text-[#f5f0e6] shadow-2xl transition-transform duration-500 ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button onClick={closeDrawer} aria-label="Close" className="absolute right-6 top-6 text-white/60 hover:text-white">
          <X className="h-6 w-6" />
        </button>

        <img src={logo} alt="Royal Crest" className="mx-auto mt-6 h-24 w-24 rounded-full border border-[#d9b45a]/40 object-cover" />
        <h2 className="mt-6 text-center font-serif text-3xl text-[#d9b45a]">Welcome to Royal Crest</h2>
        <p className="mb-10 mt-2 text-center text-sm text-white/50">Log in or create an account to add to your cart.</p>

        <AuthForm />
      </aside>
    </div>
  );
}
