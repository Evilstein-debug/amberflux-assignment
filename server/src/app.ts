import express from "express";
import cors from "cors";
import quoteRoutes from "./routes/quoteRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app: express.Application = express();

app.use(cors());
app.use(express.json());

// Health check — useful for confirming the server is running
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/quotes", quoteRoutes);

// Error handler must be registered last
app.use(errorHandler);

export default app;
