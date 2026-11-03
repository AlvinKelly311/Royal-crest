import { createContext, useContext, useRef, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const USER_KEY = "rc_user";
const PROFILES_KEY = "rc_demo_profiles"; // demo only: remembers a name and phone per email (never passwords)

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const validEmail = (e) => /^\S+@\S+\.\S+$/.test(e);

/*
  DEMO AUTH. This is NOT secure and does not stop scammers: it cannot check a password
  because there is no server yet. Replace signIn / signUp / signOut with a real provider
  (for example Supabase Auth: supabase.auth.signUp, signInWithPassword, signOut) before launch.
  The rest of the site only uses { user, signIn, signUp, signOut, requireAuth }, so nothing else changes.
*/
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(USER_KEY, null));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pending = useRef(null); // what to do right after the person logs in

  const finish = (u) => {
    setUser(u);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch {}
    setDrawerOpen(false);
    const next = pending.current;
    pending.current = null;
    if (next) next();
    return u;
  };

  const signUp = async ({ name, phone, email, password }) => {
    if (!name.trim()) throw new Error("Please enter your name.");
    if (!phone.trim()) throw new Error("Please enter your phone number.");
    if (!validEmail(email)) throw new Error("Please enter a valid email address.");
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");
    const profiles = read(PROFILES_KEY, {});
    profiles[email.toLowerCase()] = { name: name.trim(), phone: phone.trim() };
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    return finish({ name: name.trim(), phone: phone.trim(), email: email.toLowerCase() });
  };

  const signIn = async ({ email, password }) => {
    if (!validEmail(email)) throw new Error("Please enter a valid email address.");
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");
    const profile = read(PROFILES_KEY, {})[email.toLowerCase()];
    return finish({
      name: profile?.name || email.split("@")[0],
      phone: profile?.phone || "",
      email: email.toLowerCase(),
    });
  };

  const signOut = () => {
    setUser(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch {}
  };

  // run `action` now if signed in, otherwise slide the login panel open and run it after login
  const requireAuth = (action) => {
    if (user) {
      action();
      return;
    }
    pending.current = action;
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    pending.current = null;
    setDrawerOpen(false);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, requireAuth, drawerOpen, closeDrawer }}>
      {children}
    </AuthContext.Provider>
  );
}
