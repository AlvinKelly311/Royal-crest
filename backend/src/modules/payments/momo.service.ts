import axios from "axios";
import { env } from "../../config/env";

const http = axios.create({ baseURL: env.MOMO_BASE_URL, timeout: 20000 });
const subKey = { "Ocp-Apim-Subscription-Key": env.MOMO_SUBSCRIPTION_KEY };

let cached: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return cached.token;
  const basic = Buffer.from(`${env.MOMO_API_USER}:${env.MOMO_API_KEY}`).toString("base64");
  const { data } = await http.post("/collection/token/", null, {
    headers: { Authorization: `Basic ${basic}`, ...subKey },
  });
  cached = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cached.token;
}

export async function requestToPay(p: {
  referenceId: string;
  amount: number;
  phone: string;
  externalId: string;
  message: string;
}) {
  const token = await getAccessToken();
  await http.post(
    "/collection/v1_0/requesttopay",
    {
      amount: String(p.amount),
      currency: env.MOMO_CURRENCY,
      externalId: p.externalId,
      payer: { partyIdType: "MSISDN", partyId: p.phone },
      payerMessage: p.message,
      payeeNote: p.message,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Reference-Id": p.referenceId,
        "X-Target-Environment": env.MOMO_TARGET_ENV,
        ...subKey,
      },
    }
  );
}

export async function getPaymentStatus(referenceId: string): Promise<{ status: string; reason?: string }> {
  const token = await getAccessToken();
  const { data } = await http.get(`/collection/v1_0/requesttopay/${referenceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Target-Environment": env.MOMO_TARGET_ENV,
      ...subKey,
    },
  });
  return { status: data.status, reason: data.reason };
}
