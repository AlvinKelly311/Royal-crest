import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import logo from "../assets/images/logo.jpg";

export default function Login() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="grid min-h-screen bg-[#0b0b0a] pt-20 text-[#f5f0e6] md:grid-cols-2">
      {/* brand side (hidden on phones) */}
      <section className="relative hidden items-center justify-center overflow-hidden border-r border-white/10 md:flex">
        <div className="absolute h-[480px] w-[480px] rounded-full bg-[#d9b45a]/[0.06] blur-[90px]" />
        <div className="relative px-10 text-center">
          <img src={logo} alt="Royal Crest" className="mx-auto h-72 w-72 rounded-full border border-[#d9b45a]/40 object-cover" />
          <p className="mt-10 font-serif text-3xl text-[#d9b45a]">The Mark of Prestige</p>
        </div>
      </section>

      {/* form side */}
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {user ? (
            <div className="text-center">
              <h1 className="font-serif text-4xl text-[#d9b45a]">You're signed in</h1>
              <p className="mt-4 text-white/60">{user.email}</p>
              <Link
                to="/shop"
                className="mt-10 block rounded-full bg-[#d9b45a] py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-black"
              >
                Go to the shop
              </Link>
              <button onClick={signOut} className="mt-5 text-xs uppercase tracking-[0.25em] text-white/50 hover:text-white">
                Log out
              </button>
            </div>
          ) : (
            <>
              <h1 className="mb-10 font-serif text-4xl">Welcome back</h1>
              <AuthForm onDone={() => navigate("/shop")} />
              <p className="mt-8 text-center text-xs text-white/40">You can browse the shop without an account.</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
