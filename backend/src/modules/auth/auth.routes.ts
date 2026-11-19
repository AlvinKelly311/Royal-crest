import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { optionalAuth, requireAuth, signToken } from "../../middleware/auth";
import { User } from "../../models/user.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { HttpError } from "../../utils/httpError";

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z.string().trim().min(5, "Please enter your phone number").max(20),
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});
const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

const publicUser = (u: { id: string; name: string; email: string; phone?: string | null }) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone ?? "",
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, phone, email, password } = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) throw new HttpError(409, "That email is already registered. Try signing in.");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, phone, email, passwordHash });
    const token = signToken({ id: user.id, email: user.email });
    res.status(201).json({ token, user: publicUser(user) });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email: email.toLowerCase() });
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!user || !ok) throw new HttpError(401, "Invalid email or password");

    const token = signToken({ id: user.id, email: user.email });
    res.json({ token, user: publicUser(user) });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!.id).select("name email phone");
    if (!user) throw new HttpError(401, "Account no longer exists");
    res.json(publicUser(user));
  })
);

router.get("/session", optionalAuth, (req, res) => {
  res.json({ authenticated: !!req.user });
});

export default router;
