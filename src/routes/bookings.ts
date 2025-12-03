//This is the basic search API for booking hotels

//generic sample bookings route
import { Router } from "express";
import { pool } from "../db";

const router = Router();

// Bookings API
router.post("/", async (req, res) => {
  const { userId, roomId, checkIn, checkOut } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO bookings (user_id, room_id, check_in, check_out) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, roomId, checkIn, checkOut]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
// End of Bookings API