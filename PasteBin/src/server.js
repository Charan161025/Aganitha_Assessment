import express from "express";
import { setupRoutes } from "./routes.js";

const app = express();
app.use(express.json());

setupRoutes(app);

export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => console.log("http://localhost:3000"));
}