import mysql from "mysql2";
import dotenv from "dotenv";


dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3307,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Failed to connect to MySQL:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

export default db;