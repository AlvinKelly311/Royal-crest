import { Link } from "react-router-dom";
import { FaWhatsapp, FaTiktok, FaInstagram } from "react-icons/fa6";
import { Phone } from "lucide-react";
import logo from "../assets/images/logo.jpg";
import { CATEGORIES } from "../data/products";

const WHATSAPP_NUMBER = "233594236150";

const PAGES = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/cart", label: "Cart" },
  { to: "/about", label: "About Us" },
  { to: "/login", label: "Login" },
];

const heading = "text-xs uppercase tracking-[0.3em] text-[#d9b45a]";
const link = "text-sm text-white/55 transition-colors hover:text-[#d9b45a]";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0b0b0a] px-6 pb-8 pt-20 text-[#f5f0e6] md:px-16">
      <div className="mx-auto grid max-w-7xl gap-12 sm:grid-cols-2 lg:grid-cols-4">
        {/* brand */}
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Royal Crest" className="h-12 w-12 rounded-full border border-[#d9b45a]/40 object-cover" />
            <span className="font-serif text-2xl tracking-wide text-[#d9b45a]">ROYAL CREST</span>
          </Link>
          <p className="mt-5 font-serif text-lg italic text-white/70">The Mark of Prestige</p>
          <p className="mt-3 max-w-xs text-sm leading-7 text-white/45">
            Crest Yogur and more. Where Freshness Meets Excellent Taste.
          </p>
        </div>

        {/* pages */}
        <div>
          <h3 className={heading}>Explore</h3>
          <ul className="mt-6 space-y-3">
            {PAGES.map((p) => (
              <li key={p.to}>
                <Link to={p.to} className={link}>
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* categories (read from products.js, so new categories appear automatically) */}
        <div>
          <h3 className={heading}>Categories</h3>
          <ul className="mt-6 space-y-3">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link to="/shop" className={link}>
                  {c.name}
                  {c.comingSoon && <span className="ml-2 text-[10px] uppercase tracking-widest text-[#d9b45a]/70">Soon</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* contact */}
        <div>
          <h3 className={heading}>Contact</h3>
          <ul className="mt-6 space-y-4">
            <li>
              <a href="tel:+233594236150" className={`${link} flex items-center gap-3`}>
                <Phone className="h-4 w-4 text-[#d9b45a]" /> +233 59 423 6150
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className={`${link} flex items-center gap-3`}
              >
                <FaWhatsapp className="h-4 w-4 text-[#d9b45a]" /> Chat on WhatsApp
              </a>
            </li>
          </ul>
          <div className="mt-6 flex gap-5 text-[#d9b45a]">
            <a href="https://www.tiktok.com/@royalcrest0" target="_blank" rel="noreferrer" aria-label="TikTok" className="transition hover:-translate-y-1">
              <FaTiktok className="h-5 w-5" />
            </a>
            {/* confirm the exact Instagram handle with the client before launch */}
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="transition hover:-translate-y-1">
              <FaInstagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 text-center text-[11px] tracking-widest text-white/35 md:flex-row">
        <p>© {new Date().getFullYear()} ROYAL CREST. ALL RIGHTS RESERVED.</p>
        <p>ELEGANCE. QUALITY. DISTINCTION.</p>
      </div>
    </footer>
  );
}