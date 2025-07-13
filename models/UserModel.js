import db from "./db.js";

export const createUser = (name, email, hashedPassword, role, callback) => {
  const sql = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, email, hashedPassword, role], callback);
};

export const findUserByEmail = (email, callback) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  db.query(sql, [email], callback);
};
  

