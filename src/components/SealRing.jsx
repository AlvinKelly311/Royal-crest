import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../assets/images/logo.jpg";

gsap.registerPlugin(ScrollTrigger);

// A gold ring of text that turns as you scroll past it, around the Royal Crest logo.
export default function SealRing() {
  const wrapRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ringRef.current, {
        rotation: 360,
        svgOrigin: "200 200",
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="mx-auto aspect-square w-full max-w-md">
      <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Royal Crest seal">
        <defs>
          <path id="ring-path" d="M200,200 m-165,0 a165,165 0 1,1 330,0 a165,165 0 1,1 -330,0" />
          <clipPath id="logo-clip">
            <circle cx="200" cy="200" r="108" />
          </clipPath>
        </defs>

        <g ref={ringRef}>
          <text className="font-serif" fill="#D9B45A" fontSize="17">
            <textPath href="#ring-path" textLength="1030" lengthAdjust="spacing">
              THE MARK OF PRESTIGE ✦ THE MARK OF PRESTIGE ✦ THE MARK OF PRESTIGE ✦
            </textPath>
          </text>
        </g>

        <circle cx="200" cy="200" r="120" fill="none" stroke="#D9B45A" strokeOpacity="0.5" />
        <circle cx="200" cy="200" r="110" fill="none" stroke="#D9B45A" strokeOpacity="0.2" />

        <image
          href={logo}
          x="90"
          y="90"
          width="220"
          height="220"
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#logo-clip)"
        />
      </svg>
    </div>
  );
}
