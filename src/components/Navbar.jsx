import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const WHATSAPP_NUMBER = "233594236150";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About Us" },
];

const linkClass = ({ isActive }) =>
  `text-xs uppercase tracking-[0.2em] transition-colors ${
    isActive ? "text-[#d9b45a]" : "text-white/60 hover:text-[#d9b45a]"
  }`;

// links inside the side panel are larger
const sideLinkClass = ({ isActive }) =>
  `block border-b border-white/10 py-4 font-serif text-3xl transition-colors ${
    isActive ? "text-[#d9b45a]" : "text-white/80 hover:text-[#d9b45a]"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const { user, signOut } = useAuth();
  const { count } = useCart();

  // keep the hidden panel out of keyboard focus while it is closed
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open;
  }, [open]);

  // while the panel is open: Escape closes it and the page behind it does not scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#0b0b0a]/85 backdrop-blur-xl">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="font-serif text-xl font-extrabold tracking-wide text-[#d9b45a]">
            <Link to="/">ROYAL CREST</Link>
          </h1>

          <nav className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <button onClick={signOut} className="text-xs uppercase tracking-[0.2em] text-white/60 hover:text-[#d9b45a]">
                Log out
              </button>
            ) : (
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
            )}
          </nav>

          {/* more space between the cart icon and the menu button */}
          <div className="flex items-center gap-7 md:gap-5">
            {user && <span className="hidden text-xs text-white/50 lg:inline">Hi, {user.name.split(" ")[0]}</span>}

            {/* cart icon with the number of items */}
            <Link to="/cart" aria-label={`Cart, ${count} items`} className="relative text-[#d9b45a]">
              <ShoppingBag className="h-6 w-6" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[#d9b45a] px-1 text-[11px] font-semibold text-black">
                  {count}
                </span>
              )}
            </Link>

            <button
              className="text-white/80 md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/*
        Mobile side panel. It sits OUTSIDE the <header> on purpose: the header has a blur effect, and a blurred
        parent would trap this fixed panel inside the header's height.
      */}
      <div className={`fixed inset-0 z-[60] md:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          onClick={close}
          className={`absolute inset-0 bg-black/70 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
        />

        <aside
          ref={panelRef}
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-xs flex-col bg-[#0b0b0a] px-7 pb-8 pt-5 shadow-2xl transition-transform duration-500 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* <div className="flex items-center justify-between">
            <span className="font-serif text-lg font-extrabold tracking-wide text-[#d9b45a]">ROYAL CREST</span>
            <button onClick={close} aria-label="Close menu" className="text-white/70 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div> */}

          <nav className="mt-10 flex flex-col">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={sideLinkClass} onClick={close}>
                {l.label}
              </NavLink>
            ))}
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  close();
                }}
                className="border-b border-white/10 py-4 text-left font-serif text-3xl text-white/80 hover:text-[#d9b45a]"
              >
                Log out
              </button>
            ) : (
              <NavLink to="/login" className={sideLinkClass} onClick={close}>
                Login
              </NavLink>
            )}
          </nav>

          <div className="mt-auto">
            {user && <p className="mb-5 text-sm text-white/50">Signed in as {user.name.split(" ")[0]}</p>}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 text-sm text-[#d9b45a]"
            >
              <FaWhatsapp className="h-5 w-5" /> Chat on WhatsApp
            </a>
            <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-white/30">The Mark of Prestige</p>
          </div>
        </aside>
      </div>
    </>
  );
}