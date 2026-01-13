import mongoose from "mongoose";
import "dotenv/config"

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGODB_URL, {
    dbName: "pastebin"
  });
}