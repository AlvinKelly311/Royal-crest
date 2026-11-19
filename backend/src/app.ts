import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error";
import routes from "./routes";

const app = express();
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(","), credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => { res.json({ ok: true }); });
app.use("/api", routes);
app.use(errorHandler);

export default app;
