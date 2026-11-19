import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB() {
  await mongoose.connect(env.MONGODB_URI, {
    family: 4, // skip IPv6 entirely
    serverSelectionTimeoutMS: 20000,
  });
  console.log("MongoDB connected");
}
