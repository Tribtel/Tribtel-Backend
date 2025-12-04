//entry point of the application - sets up main server.

//basic express server setup
import dotenv from "dotenv";
dotenv.config();//load env variables first


import express from "express";
import cors from "cors";
import { pool } from "./db";

//Begin Routes imports for API Endpoints.
import usersRouter from "./routes/users";
import searchRouter from "./routes/search";
import bookingsRouter from "./routes/bookings";
//End Routes imports for API Endpoints.

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());//middleware to parse JSON bodies

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "Backend running!" });
});

// DB heartbeat
app.get("/api/test-db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ ok: true, now: result.rows[0].now });
  } catch (err) {
    console.error("DB test failed:", err);
    res.status(500).json({ ok: false, error: "Database connection failed" });
  }
});

// setup server to listen on specified port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//Begin calling API Endpoints.
app.use("/api/users", usersRouter);
app.use("/api/search", searchRouter);
app.use("/api/bookings", bookingsRouter);
//End calling API Endpoints.

