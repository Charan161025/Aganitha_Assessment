import { nanoid } from "nanoid";
import { connectDB } from "./db.js";
import { Paste } from "./models/Paste.js";
import { homePage, pastePage } from "./views.js";

function now(req) {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    return Number(req.headers["x-test-now-ms"]);
  }
  return Date.now();
}

export function setupRoutes(app) {

  app.get("/", (req, res) => {
    res.send(homePage());
  });

  app.get("/api/healthz", async (req, res) => {
    try {
      await connectDB();
      res.json({ ok: true });
    } catch {
      res.status(500).json({ ok: false });
    }
  });

  app.post("/api/pastes", async (req, res) => {
    
    try {
      await connectDB();

      const { content, ttl_seconds, max_views } = req.body;

      if (!content || typeof content !== "string" || !content.trim()) {
        return res.status(400).json({ error: "Invalid content" });
      }

      if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
        return res.status(400).json({ error: "Invalid ttl_seconds" });
      }

      if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
        return res.status(400).json({ error: "Invalid max_views" });
      }

      const id = nanoid(8);
      const createdAt = now(req);

      const paste = await Paste.create({
        _id: id,
        content,
        createdAt,
        ttlSeconds: ttl_seconds ?? null,
        remainingViews: max_views ?? null,
      });

      res.json({
        id,
        url: `${req.protocol}://${req.get("host")}/p/${id}`
      });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/pastes/:id", async (req, res) => {
  try {
    await connectDB();

    const currentTime = now(req);

    const paste = await Paste.findById(req.params.id);
    if (!paste) {
      return res.status(404).json({ error: "Not found" });
    }

    
    if (paste.ttlSeconds !== null) {
      const expiresAt = paste.createdAt + paste.ttlSeconds * 1000;
      if (currentTime > expiresAt) {
        await Paste.deleteOne({ _id: paste._id });
        return res.status(404).json({ error: "Not found" });
      }
    }

    
    if (paste.remainingViews === null) {
      return res.json({
        content: paste.content,
        remaining_views: null,
        expires_at: paste.ttlSeconds
          ? new Date(paste.createdAt + paste.ttlSeconds * 1000).toISOString()
          : null
      });
    }

    const updated = await Paste.findOneAndUpdate(
      { _id: paste._id, remainingViews: { $gt: 0 } }, 
      { $inc: { remainingViews: -1 } },
      { new: true }
    );

    if (!updated) {
      await Paste.deleteOne({ _id: paste._id });
      return res.status(404).json({ error: "Not found" });
    }

    res.json({
      content: updated.content,
      remaining_views: updated.remainingViews,
      expires_at: updated.ttlSeconds
        ? new Date(updated.createdAt + updated.ttlSeconds * 1000).toISOString()
        : null
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

  app.get("/p/:id", async (req, res) => {
    try {
      await connectDB();
      const paste = await Paste.findById(req.params.id);

      if (!paste) return res.status(404).send("Not found");

      const currentTime = now(req);

      if (paste.ttlSeconds !== null) {
        const expiresAt = paste.createdAt + paste.ttlSeconds * 1000;
        if (currentTime > expiresAt) {
          await Paste.deleteOne({ _id: paste._id });
          return res.status(404).send("Not found");
        }
      }

      if (paste.remainingViews !== null && paste.remainingViews <= 0) {
        await Paste.deleteOne({ _id: paste._id });
        return res.status(404).send("Not found");
      }

      res.send(pastePage(paste.content));
    } catch {
      res.status(500).send("Server error");
    }
  });
}