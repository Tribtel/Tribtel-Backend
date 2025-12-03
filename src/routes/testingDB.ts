//This is the database connection testing route

import { Router } from "express";
import { pool } from "../db";      
const router = Router();

// DB heartbeat API
router.get("/api/test-db", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.json({ ok: true, now: result.rows[0].now });
  } catch (err) {
    console.error("DB test failed:", err);
    res.status(500).json({ ok: false, error: "Database connection failed" });
  }
});

export default router;
// End of DB heartbeat API