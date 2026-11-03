import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import AuthDrawer from "./components/AuthDrawer";
import Footer from "./components/Footer";

// pages that should not show the shared footer (About has its own contact footer; login and payment stay focused)
const NO_FOOTER = ["/about", "/login", "/payment"];

// start every page at the top when you move between pages
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <Navbar />
        <Outlet />
        {!NO_FOOTER.includes(pathname) && <Footer />}
        <AuthDrawer />
      </CartProvider>
    </AuthProvider>
  );
}