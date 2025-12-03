// This file defines basic user authentication routes: Sign-Up and Sign-In.
// They live under /api/users, so endpoints are /api/users/signup and /api/users/signin.

import { Router } from "express";
import bcrypt from "bcrypt"; // For password hashing
import jwt from "jsonwebtoken"; // For issuing tokens on sign-in
import { pool } from "../db"; // pg Pool connected to Supabase

const router = Router();

/* ---------------------------
   USER SIGN-UP
   ---------------------------
   - Accepts username, email, password
   - Hashes password with bcrypt
   - Inserts new user into Supabase Postgres
   - Returns safe user object (no password)
   - Handles duplicate email errors
*/
router.post("/signup", async (req, res) => {
  // Debug log
  console.log("Signup route hit:", req.body);

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, name, email, role, created_at`,
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (err: any) {
    if (err.code === "23505") {
      // Postgres unique violation (duplicate email)
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------------------
   USER SIGN-IN
   ---------------------------
   - Accepts email + password
   - Looks up user by email
   - Verifies password with bcrypt.compare
   - Issues JWT token if valid
   - Returns safe user object + token
*/
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Issue JWT (use env var for secret in production)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "supersecret",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Signed in successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;