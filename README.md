# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Royal Crest scroll hero

Files
- public/frames/lg: 360 WebP frames (24fps), 1280px wide (desktop)
- public/frames/sm: 360 WebP frames (24fps), 720px wide (phones)
- src/components/ScrollHero.jsx: the scroll hero (React, GSAP ScrollTrigger, Tailwind)

Setup
1. Copy public/frames into your project's public folder.
2. Copy ScrollHero.jsx into src/components.
3. npm install gsap
4. Use it: import ScrollHero from "./components/ScrollHero"; render <ScrollHero /> on the home page.

Edit
- Headlines: the BEATS array at the top of ScrollHero.jsx. from/to are scroll progress (0 to 1).
- Scroll length: h-[900vh] (phones) and md:h-[1300vh] (desktop) on the section. Larger is slower.
- WhatsApp link: WHATSAPP_URL. Confirm the number is registered on WhatsApp first.
- Frame count: FRAME_COUNT. If you re-export the video, extract at 24fps and update it.

Re-extract frames
ffmpeg -i hero.mp4 -an -vf "fps=24,scale=1280:-2" -c:v libwebp -quality 72 public/frames/lg/f_%04d.webp
ffmpeg -i hero.mp4 -an -vf "fps=24,scale=720:-2" -c:v libwebp -quality 70 public/frames/sm/f_%04d.webp
