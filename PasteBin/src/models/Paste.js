import mongoose from "mongoose";

const pasteSchema = new mongoose.Schema({
  _id: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Number, required: true },
  ttlSeconds: { type: Number, default: null },
  remainingViews: { type: Number, default: null }
});

export const Paste = mongoose.models.Paste || mongoose.model("Paste", pasteSchema);