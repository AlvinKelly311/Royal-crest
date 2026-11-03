import { Quote, Star } from "lucide-react";

/*
  PLACEHOLDER REVIEWS. Replace these with real ones from the client's customers (WhatsApp messages,
  TikTok comments, Instagram DMs) and ask each customer for permission to use their words and first name.
  Do not publish invented reviews. If the list is empty, the whole section is hidden.
*/
const TESTIMONIALS = [
  { id: 1, name: "Salamatu Karim", product: "Coconut Plus+", rating: 5, text: "Nice taste." },
  { id: 2, name: "Ray", product: "Crest Bubble Tea", rating: 5, text: "A very different taste. You need to try this 🥰." },
  { id: 3, name: "Customer name", product: "Crest Chills", rating: 5, text: "Replace this with a real customer's own words." },
];

function Stars({ rating }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-[#d9b45a] text-[#d9b45a]" : "text-white/20"}`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="bg-[#0b0b0a] px-6 py-24 text-[#f5f0e6] md:px-16 md:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.4em] text-[#d9b45a]">Kind words</p>
        <h2 className="mt-5 max-w-2xl font-serif" style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)", lineHeight: 1.05 }}>
          What our customers say
        </h2>

        {/* swipe on phones, three across on desktop */}
        <div className="-mx-6 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.id}
              className="relative flex w-[85%] shrink-0 snap-center flex-col justify-between border border-white/10 bg-[#14130f] p-8 transition duration-500 hover:-translate-y-1 hover:border-[#d9b45a]/50 md:w-auto"
            >
              <Quote className="h-8 w-8 text-[#d9b45a]/40" />
              <blockquote className="mt-6 flex-1 text-base leading-8 text-white/70">{t.text}</blockquote>

              <figcaption className="mt-8 border-t border-white/10 pt-6">
                <Stars rating={t.rating} />
                <p className="mt-3 font-serif text-lg">{t.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">{t.product}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}