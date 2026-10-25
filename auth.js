import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Please log in to continue" });
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id).select("-password");
    if (!req.user) return res.status(401).json({ message: "Account no longer exists" });
    next();
  } catch {
    res.status(401).json({ message: "Session expired. Please log in again" });
  }
};

export const adminOnly = (req, res, next) =>
  req.user?.isAdmin ? next() : res.status(403).json({ message: "Admin access required" });
