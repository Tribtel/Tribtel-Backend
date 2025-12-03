//Database connection and configuration

import { Pool } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("Missing DATABASE_URL in environment");
}

const certPath = path.resolve(process.env.DB_SSL_CERT!);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync(process.env.DB_SSL_CERT!, "utf-8"), // load cert from .env path
    rejectUnauthorized: true,
  },
});


// Optional: simple helper to query with typed params
export const query = (text: string, params?: any[]) => pool.query(text, params);
