import { createUser, findUserByEmail } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const registerUser = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  createUser(name, email, hashedPassword, role, (err, result) => {
    if (err) return res.status(500).json({ message: "Registration failed" });

    const userId = result.insertId;

    // ✅ Generate token after successful registration
    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(201).json({ token });
  });
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: "Login failed" });
    if (results.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = results[0];
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({ token });
  });
};