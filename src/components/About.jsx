import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaWhatsapp,
  FaTiktok,
  FaInstagram,
} from "react-icons/fa6";
import {
  ArrowUpRight,
  ArrowDown,
  Sparkles,
  Phone,
  Mail,
  ShoppingBag,
  Truck,
  Coffee,
} from "lucide-react";

import logo from "../assets/images/logo.jpg";
import { CATEGORIES } from "../data/products";

const WHATSAPP_NUMBER = "233594236150";

export default function About() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSent(true);
  };

  return (
    <main className="overflow-hidden bg-[#0b0b0a] text-[#f5f0e6]">

      <style>{`
        @keyframes crestFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes crestReveal {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .crest-float {
          animation: crestFloat 6s ease-in-out infinite;
        }

        .crest-reveal {
          animation: crestReveal 1s ease-out both;
        }

        .gold-line {
          background: linear-gradient(
            90deg,
            transparent,
            #d9b45a,
            transparent
          );
        }

        .category-card img {
          transition: transform 0.8s ease;
        }

        .category-card:hover img {
          transform: scale(1.08);
        }

        @media (prefers-reduced-motion: reduce) {
          .crest-float,
          .crest-reveal {
            animation: none;
          }

          .category-card img {
            transition: none;
          }
        }
      `}</style>

      {/* NAVIGATION */}

      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0b0b0a]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link to="/" className="font-serif text-xl tracking-wide text-[#d9b45a]">
            ROYAL CREST
          </Link>

          <div className="hidden items-center gap-10 text-xs uppercase tracking-[0.2em] text-white/60 md:flex">
            <a href="#story" className="transition hover:text-[#d9b45a]">
              Our Story
            </a>
            <a href="#categories" className="transition hover:text-[#d9b45a]">
              Collections
            </a>
            <a href="#experience" className="transition hover:text-[#d9b45a]">
              Experience
            </a>
            <a href="#contact" className="transition hover:text-[#d9b45a]">
              Contact
            </a>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 rounded-full border border-[#d9b45a]/50 px-5 py-2.5 text-xs uppercase tracking-wider text-[#d9b45a] transition hover:bg-[#d9b45a] hover:text-black"
          >
            Shop Now <ArrowUpRight size={15} />
          </Link>

        </div>
      </nav>


      {/* HERO SECTION */}

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24 text-center">

        {/* Background decoration */}

        <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9b45a]/[0.045] blur-[100px]" />

        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(#d9b45a 0.7px, transparent 0.7px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl">

          <div className="crest-reveal mb-10 flex items-center justify-center gap-4">
            <span className="h-px w-12 bg-[#d9b45a]/60" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#d9b45a]">
              A Taste of Distinction
            </span>
            <span className="h-px w-12 bg-[#d9b45a]/60" />
          </div>

          {/* Logo */}

          <div className="crest-float relative mx-auto mb-12 flex h-64 w-64 items-center justify-center rounded-full border border-[#d9b45a]/40 p-3 shadow-[0_0_100px_rgba(217,180,90,0.10)] md:h-80 md:w-80">

            <div className="absolute inset-0 rounded-full border border-[#d9b45a]/20 scale-110" />

            <div className="h-full w-full overflow-hidden rounded-full border border-[#d9b45a]/50">
              <img
                src={logo}
                alt="Royal Crest"
                className="h-full w-full object-cover"
              />
            </div>

          </div>

          <h1 className="crest-reveal font-serif text-5xl leading-tight tracking-wide md:text-7xl"
            style={{ animationDelay: "0.2s" }}
          >
            The Art of
            <span className="block italic text-[#d9b45a]">
              Indulgence.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-8 text-white/50 md:text-base">
            Discover a world of delightful flavours, thoughtful creations
            and exceptional experiences.
          </p>

          <a
            href="#story"
            className="mt-12 inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[#d9b45a] transition hover:gap-5"
          >
            Discover Our Story
            <ArrowDown size={16} />
          </a>

        </div>

        <span className="absolute bottom-10 left-10 hidden text-[10px] tracking-[0.4em] text-white/20 md:block">
          ROYAL CREST — EST. WITH DISTINCTION
        </span>

      </section>


      {/* OUR STORY */}

      <section id="story" className="relative bg-[#f5f0e6] px-6 py-28 text-[#171612] md:py-40">

        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">

          <div>
            <div className="mb-8 flex items-center gap-4">
              <Sparkles className="text-[#b18a37]" size={19} />
              <span className="text-xs uppercase tracking-[0.4em] text-[#9a7837]">
                The Royal Philosophy
              </span>
            </div>

            <h2 className="font-serif text-5xl leading-tight md:text-7xl">
              More than
              <span className="block italic text-[#b18a37]">
                a taste.
              </span>
              It's an experience.
            </h2>

            <div className="my-10 h-px w-24 bg-[#b18a37]" />

            <p className="max-w-lg text-base leading-9 text-black/65">
              Royal Crest is the home of Crest Yogur and our other food
              and beverage collections. We bring together delightful
              flavours and carefully crafted offerings to make everyday
              moments feel special.
            </p>

            <p className="mt-5 max-w-lg text-base leading-9 text-black/65">
              From refreshing drinks to satisfying bites and indulgent
              treats, every collection is an invitation to experience
              something delightful.
            </p>

            <Link
              to="/"
              className="mt-10 inline-flex items-center gap-4 border-b border-[#b18a37] pb-3 text-xs uppercase tracking-[0.25em] transition hover:gap-7"
            >
              Explore Our Collections
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {/* Decorative brand panel */}

          <div className="relative mx-auto w-full max-w-md">

            <div className="absolute -right-4 -top-4 h-full w-full border border-[#b18a37]/40" />

            <div className="relative flex min-h-[450px] flex-col justify-between overflow-hidden bg-[#15140f] p-10 text-[#f5f0e6]">

              <span className="text-xs uppercase tracking-[0.4em] text-[#d9b45a]">
                ROYAL CREST
              </span>

              <div>
                <p className="font-serif text-6xl italic leading-tight">
                  Simply
                  <br />
                  Exceptional.
                </p>

                <div className="my-8 h-px w-20 bg-[#d9b45a]" />

                <p className="max-w-xs text-sm leading-8 text-white/50">
                  The perfect blend of flavour, creativity and
                  memorable moments.
                </p>
              </div>

              <span className="text-[10px] tracking-[0.4em] text-[#d9b45a]/70">
                THE MARK OF PRESTIGE
              </span>

            </div>

          </div>

        </div>
      </section>


      {/* CATEGORIES */}

      <section id="categories" className="px-6 py-28 md:py-36">

        <div className="mx-auto max-w-7xl">

          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.4em] text-[#d9b45a]">
                Discover Royal Crest
              </p>

              <h2 className="font-serif text-5xl md:text-7xl">
                Our Collections
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-8 text-white/45">
              A collection of flavours and creations, each bringing
              something special to your table.
            </p>

          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {CATEGORIES.map((category, index) => (

              <div
                key={category.id}
                className="category-card group relative flex min-h-[320px] flex-col justify-between overflow-hidden border border-white/10 bg-[#14130f] p-7 transition duration-500 hover:border-[#d9b45a]/60 hover:-translate-y-2"
              >

                <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#d9b45a]/[0.06] blur-3xl transition group-hover:bg-[#d9b45a]/15" />

                <div className="relative flex items-center justify-between">

                  <span className="text-xs tracking-widest text-[#d9b45a]">
                    0{index + 1}
                  </span>

                  <ArrowUpRight
                    size={20}
                    className="text-white/30 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#d9b45a]"
                  />

                </div>

                <div className="relative">

                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#d9b45a]/30 text-[#d9b45a]">
                    {index === 0 && <Coffee size={24} />}
                    {index === 1 && <Sparkles size={24} />}
                    {index === 2 && <ShoppingBag size={24} />}
                    {index === 3 && <Coffee size={24} />}
                    {index > 3 && <Sparkles size={24} />}
                  </div>

                  <h3 className="font-serif text-2xl md:text-3xl">
                    {category.name}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/45">
                    {category.comingSoon
                      ? "Something special is on its way."
                      : category.blurb}
                  </p>

                  {category.comingSoon && (
                    <span className="mt-5 inline-block text-[9px] uppercase tracking-[0.3em] text-[#d9b45a]">
                      Coming Soon
                    </span>
                  )}

                </div>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* ORDERING EXPERIENCE */}

      <section id="experience" className="bg-[#f5f0e6] px-6 py-28 text-[#171612] md:py-36">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-20 max-w-2xl text-center">

            <p className="mb-5 text-xs uppercase tracking-[0.4em] text-[#9a7837]">
              Effortless Enjoyment
            </p>

            <h2 className="font-serif text-5xl md:text-6xl">
              Your experience,
              <span className="block italic text-[#b18a37]">
                made simple.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-8 text-black/50">
              Enjoy a seamless experience from choosing your favourites
              to having them delivered to your doorstep.
            </p>

          </div>

          <div className="grid gap-14 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Choose Your Favourites",
                description:
                  "Explore our collections and select the products you love.",
                icon: <ShoppingBag size={27} />,
              },
              {
                number: "02",
                title: "Place Your Order",
                description:
                  "Choose your preferred payment and ordering option.",
                icon: <Sparkles size={27} />,
              },
              {
                number: "03",
                title: "Enjoy the Moment",
                description:
                  "Choose pickup or delivery and get ready to enjoy.",
                icon: <Truck size={27} />,
              },
            ].map((step) => (

              <div key={step.number} className="text-center">

                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#b18a37]/40 text-[#b18a37]">
                  {step.icon}
                </div>

                <span className="text-xs tracking-[0.3em] text-[#b18a37]">
                  {step.number}
                </span>

                <h3 className="mt-4 font-serif text-2xl">
                  {step.title}
                </h3>

                <p className="mx-auto mt-4 max-w-xs text-sm leading-8 text-black/50">
                  {step.description}
                </p>

              </div>

            ))}

          </div>

        </div>
      </section>


      {/* NEWSLETTER */}

      <section className="relative overflow-hidden bg-[#d9b45a] px-6 py-28 text-center text-[#15140f] md:py-36">

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-black/10" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full border border-black/10" />

        <div className="relative z-10 mx-auto max-w-3xl">

          <Sparkles className="mx-auto mb-8" size={30} />

          <p className="text-xs uppercase tracking-[0.4em]">
            A Little Something Special
          </p>

          <h2 className="mt-6 font-serif text-5xl leading-tight md:text-7xl">
            Stay in the
            <span className="block italic">Royal Circle.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-sm leading-8 text-black/65">
            Be the first to discover new creations, exclusive offers
            and delightful updates from Royal Crest.
          </p>

          {sent ? (

            <p className="mt-10 font-serif text-2xl">
              Thank you for joining us!
            </p>

          ) : (

            <form
              onSubmit={subscribe}
              className="mx-auto mt-12 flex max-w-xl flex-col gap-3 sm:flex-row"
            >

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="min-w-0 flex-1 rounded-full border border-black/30 bg-transparent px-7 py-4 text-sm outline-none placeholder:text-black/50 focus:border-black"
              />

              <button
                type="submit"
                className="rounded-full bg-[#15140f] px-9 py-4 text-xs uppercase tracking-[0.2em] text-white transition hover:bg-black/75"
              >
                Subscribe
              </button>

            </form>

          )}

          <p className="mt-6 text-[10px] uppercase tracking-widest text-black/45">
            Good things deserve to be shared.
          </p>

        </div>
      </section>


      {/* FOOTER / CONTACT */}

      <footer id="contact" className="px-6 pb-10 pt-24">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-16 border-b border-white/10 pb-20 md:grid-cols-2">

            <div>

              <p className="text-xs uppercase tracking-[0.4em] text-[#d9b45a]">
                Let's Connect
              </p>

              <h2 className="mt-6 max-w-lg font-serif text-5xl leading-tight md:text-6xl">
                Every great experience starts with a
                <span className="italic text-[#d9b45a]"> hello.</span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-8 text-white/45">
                Have a question, an enquiry or a special order?
                We'd love to hear from you.
              </p>

            </div>

            <div className="flex flex-col justify-center gap-8">

              <a
                href="tel:+233594236150"
                className="group flex items-center gap-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9b45a]/30 text-[#d9b45a]">
                  <Phone size={19} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                    Call Us
                  </p>
                  <p className="mt-1 text-lg transition group-hover:text-[#d9b45a]">
                    +233 59 423 6150
                  </p>
                </div>

              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9b45a]/30 text-[#d9b45a]">
                  <FaWhatsapp size={20} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                    WhatsApp
                  </p>
                  <p className="mt-1 text-lg transition group-hover:text-[#d9b45a]">
                    Chat with Royal Crest
                  </p>
                </div>

              </a>

              <div className="flex items-center gap-5">

                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9b45a]/30 text-[#d9b45a]">
                  <Mail size={19} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">
                    Social Media
                  </p>

                  <div className="mt-2 flex gap-5 text-[#d9b45a]">
                    <a
                      href="https://www.tiktok.com/@royalcrest0"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="TikTok"
                      className="transition hover:-translate-y-1"
                    >
                      <FaTiktok size={21} />
                    </a>

                    <a
                      href="https://www.instagram.com/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="transition hover:-translate-y-1"
                    >
                      <FaInstagram size={21} />
                    </a>
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* BOTTOM FOOTER */}

          <div className="flex flex-col items-center justify-between gap-6 py-10 text-center md:flex-row md:text-left">

            <div>
              <p className="font-serif text-2xl tracking-widest text-[#d9b45a]">
                ROYAL CREST
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/30">
                The Mark of Prestige
              </p>
            </div>

            <Link
              to="/"
              className="text-xs uppercase tracking-[0.3em] text-white/50 transition hover:text-[#d9b45a]"
            >
              Return to Shop ↑
            </Link>

            <p className="text-[10px] tracking-widest text-white/30">
              © {new Date().getFullYear()} ROYAL CREST. ALL RIGHTS RESERVED.
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}