import { Router } from "express";
import rateLimit from "express-rate-limit";
import authRoutes from "./modules/auth/auth.routes";
import paymentRoutes from "./modules/payments/payments.routes";

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 50 });

const router = Router();
router.use("/auth", authLimiter, authRoutes);
router.use("/payments", paymentRoutes);
export default router;
