import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { clearToken, getToken, setToken } from "../lib/token";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const USER_KEY = "rc_user"; // cached copy of the signed-in user so the navbar does not flicker on reload

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const validEmail = (e) => /^\S+@\S+\.\S+$/.test(e);

/*
  Real auth: accounts live in MongoDB, the server checks the password and issues a token.
  The rest of the site still only uses { user, signIn, signUp, signOut, requireAuth }.
*/
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (getToken() ? read(USER_KEY, null) : null));
  const [ready, setReady] = useState(false); // false until a saved token has been checked
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pending = useRef(null); // what to do right after the person logs in

  const remember = (u) => {
    setUser(u);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch {}
  };

  const forget = () => {
    setUser(null);
    clearToken();
    try {
      localStorage.removeItem(USER_KEY);
    } catch {}
  };

  useEffect(() => {
    // an old demo login has no token, so it is dropped
    if (!getToken()) {
      forget();
      setReady(true);
      return;
    }
    api("/api/auth/me")
      .then(remember)
      .catch((err) => {
        if (err.status === 401) forget(); // expired token; if the server is just offline, stay signed in
      })
      .finally(() => setReady(true));
  }, []);

  const finish = ({ token, user: u }) => {
    setToken(token);
    remember(u);
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
    if (password.length < 8) throw new Error("Password must be at least 8 characters.");
    const data = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: name.trim(), phone: phone.trim(), email: email.trim(), password }),
    });
    return finish(data);
  };

  const signIn = async ({ email, password }) => {
    if (!validEmail(email)) throw new Error("Please enter a valid email address.");
    if (!password) throw new Error("Please enter your password.");
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password }),
    });
    return finish(data);
  };

  const signOut = () => forget();

  // always slide the login panel open and run `action` after login
  const openAuth = (action) => {
    pending.current = action || null;
    setDrawerOpen(true);
  };

  // run `action` now if signed in, otherwise open the login panel and run it after login
  const requireAuth = (action) => {
    if (user) {
      action();
      return;
    }
    openAuth(action);
  };

  const closeDrawer = () => {
    pending.current = null;
    setDrawerOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, ready, signIn, signUp, signOut, requireAuth, openAuth, drawerOpen, closeDrawer }}
    >
      {children}
    </AuthContext.Provider>
  );
}
