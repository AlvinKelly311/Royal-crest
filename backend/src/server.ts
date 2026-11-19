import dns from "node:dns";
import net from "node:net";
import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

// Some networks have broken IPv6 and slow IPv4: prefer IPv4 and give it time
dns.setDefaultResultOrder("ipv4first");
net.setDefaultAutoSelectFamilyAttemptTimeout(5000);

connectDB()
  .then(() => app.listen(env.PORT, () => console.log(`API running on http://localhost:${env.PORT}`)))
  .catch((err) => {
    console.error("Failed to start:", err);
    process.exit(1);
  });
