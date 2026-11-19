import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { initiatePayment, paymentStatus } from "./payments.controller";

const router = Router();
router.use(requireAuth); // nobody pays without signing in
router.post("/momo/initiate", initiatePayment);
router.get("/momo/status/:orderId", paymentStatus);

export default router;
