import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../assets/images/logo.jpg"

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 360; // 15s at 24fps
const WHATSAPP_URL = "https://wa.me/233594236150"; // confirm the number is on WhatsApp

// progress ranges (0 to 1) in which each headline is visible, and where the text sits
const BEATS = [
  { from: 0.02, to: 0.28, align: "center", title: "Where Freshness Meets Excellent Taste.", sub: "Crest Yogur Coconut Plus+." },
  { from: 0.33, to: 0.52, align: "right", title: "Poured, thick.", sub: "Slow, rich and full of flavour." },
  { from: 0.56, to: 0.74, align: "left", title: "Real coconut flakes.", sub: "Loaded in every cup." },
  { from: 0.82, to: 1.01, align: "center", title: "Sealed fresh.", sub: "Ready when you are.", cta: true },
];

// where each text block sits (on phones the text always stays at the bottom)
const POSITION = {
  center: "justify-center text-center",
  left: "justify-start text-left md:items-center md:pb-0",
  right: "justify-end text-right md:items-center md:pb-0",
};

const framePath = (set, i) => `/frames/${set}/f_${String(i + 1).padStart(4, "0")}.webp`;

export default function ScrollHero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(0);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [beat, setBeat] = useState(0);

  // draw one frame, cropped to fill the screen with the cup kept in the centre
  const draw = (index) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete) return;
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };

  const resize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    draw(frameRef.current);
  };

  // preload every frame (smaller set on phones)
  useEffect(() => {
    const set = window.innerWidth < 768 ? "sm" : "lg";
    let count = 0;
    const images = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(set, i);
      img.onload = img.onerror = () => {
        count += 1;
        setLoaded(count);
        if (count === FRAME_COUNT) setReady(true);
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // connect scroll position to the frame number
  useEffect(() => {
    if (!ready) return;
    resize();
    window.addEventListener("resize", resize);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      frameRef.current = FRAME_COUNT - 1;
      draw(frameRef.current);
      setBeat(BEATS.length - 1);
      return () => window.removeEventListener("resize", resize);
    }

    const state = { frame: 0 };
    const ctx = gsap.context(() => {
      gsap.to(state, {
        frame: FRAME_COUNT - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          onUpdate: (self) => {
            const p = self.progress;
            const idx = BEATS.findIndex((b) => p >= b.from && p < b.to);
            setBeat((prev) => (prev === idx ? prev : idx));
          },
        },
        onUpdate: () => {
          frameRef.current = state.frame;
          draw(state.frame);
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", resize);
    };
  }, [ready]);

  const percent = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <>
      {!ready && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-amber-200">
          <p className="font-serif text-2xl tracking-[0.12em]">Royal Crest</p>
          <div className="mt-6 h-px w-48 bg-amber-200/20">
            <div className="h-px bg-amber-200 transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 md:px-10">
        <img src={logo} alt="logo" className="w-8 h-8 rounded-4xl" />
        <div className="flex items-center gap-5 font-sans tracking-wide">
          <Link to="/about" className="text-sm text-amber-100/80 hover:text-amber-100 transition-colors">
            About
          </Link>

          <a href="#shop" className="text-sm text-amber-100/80 hover:text-amber-100 transition-colors">
            Shop
          </a>

          <a
            href={WHATSAPP_URL}
            className="rounded-full border border-amber-200/60 px-4 py-1.5 text-sm text-amber-100 transition-all hover:bg-amber-200 hover:text-black"
          >
            Order now
          </a>
        </div>
      </header>

      {/* tall section: the page scrolls while the canvas stays pinned */}
      <section ref={sectionRef} className="relative h-[900vh] bg-black md:h-[1300vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="h-full w-full" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

          {BEATS.map((b, i) => (
            <div
              key={b.title}
              className={`absolute inset-0 flex items-end px-6 pb-14 transition-opacity duration-700 md:px-16 md:pb-20 ${
                POSITION[b.align]
              } ${beat === i ? "opacity-100" : "opacity-0"}`}
            >
              <div className="max-w-md md:max-w-lg">
                <h2
                  className="font-serif font-medium tracking-tight text-amber-100"
                  style={{
                    fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
                    lineHeight: 1.05,
                  }}
                >
                  {b.title}
                </h2>
                <p className="mt-4 font-sans text-base tracking-wide text-amber-100/80 md:text-lg">
                  {b.sub}
                </p>
                {b.cta && (
                  <a
                    href={WHATSAPP_URL}
                    className="pointer-events-auto mt-6 inline-block rounded-full bg-amber-200 px-7 py-3 font-sans text-sm font-semibold tracking-wide text-black transition-all duration-300 hover:bg-amber-100 hover:scale-105"
                  >
                    Order on WhatsApp
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </>
  );
}
