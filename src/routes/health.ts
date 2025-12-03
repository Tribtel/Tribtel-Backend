//This is a basic health check API

//generic health route
import { Router } from "express";
import { pool } from "../db";

const router = Router();
// Health check API
router.get("/", (_req, res) => {
  res.json({ status: "Backend running!" });
});

export default router;  
// End of Health check API