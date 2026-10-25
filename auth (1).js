import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = Router();
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const payload = (u) => ({ _id: u._id, name: u.name, email: u.email, isAdmin: u.isAdmin, token: sign(u._id) });

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
  if (await User.findOne({ email })) return res.status(409).json({ message: "Email is already registered" });
  const user = await User.create({ name, email, password });
  res.status(201).json(payload(user));
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Email or password is incorrect" });
  res.json(payload(user));
});

router.get("/me", protect, (req, res) => res.json(req.user));

export default router;
