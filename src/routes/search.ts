// This is the basic search API for searching hotels

//generic sample search route
import { Router } from "express";
import { pool } from "../db";

const router = Router();

// Search API
router.get("/", async (req, res) => {
  const city = req.query.city;
  try {
    const result = await pool.query(
      "SELECT * FROM hotels WHERE city = $1",
      [city]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
// End of Search API