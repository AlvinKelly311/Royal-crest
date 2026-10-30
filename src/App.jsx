import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollHero from "./components/ScrollHero";
import Shop from "./components/Shop";
import About from "./components/About";

function Home() {
  return (
    <>
      <ScrollHero />
      <Shop />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
