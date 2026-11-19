import { randomUUID } from "node:crypto";

const subKey = process.env.MOMO_SUBSCRIPTION_KEY;
if (!subKey) {
  console.error("Set MOMO_SUBSCRIPTION_KEY first");
  process.exit(1);
}

const base = "https://sandbox.momodeveloper.mtn.com";
const apiUser = randomUUID();

// 1. Create the API user
let res = await fetch(`${base}/v1_0/apiuser`, {
  method: "POST",
  headers: {
    "X-Reference-Id": apiUser,
    "Ocp-Apim-Subscription-Key": subKey,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ providerCallbackHost: "localhost" }),
});
if (res.status !== 201) {
  console.error("Creating API user failed:", res.status, await res.text());
  process.exit(1);
}

// 2. Generate its API key
res = await fetch(`${base}/v1_0/apiuser/${apiUser}/apikey`, {
  method: "POST",
  headers: { "Ocp-Apim-Subscription-Key": subKey },
});
if (!res.ok) {
  console.error("Creating API key failed:", res.status, await res.text());
  process.exit(1);
}
const { apiKey } = await res.json();

console.log("\nAdd these to your .env:\n");
console.log(`MOMO_SUBSCRIPTION_KEY=${subKey}`);
console.log(`MOMO_API_USER=${apiUser}`);
console.log(`MOMO_API_KEY=${apiKey}`);
