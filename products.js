import { Router } from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// GET /api/products?search=&category=&sort=price_asc|price_desc|new&page=1&limit=12
router.get("/", async (req, res) => {
  const { search, category, sort, page = 1, limit = 12 } = req.query;
  const filter = {};
  if (search) filter.$text = { $search: search };
  if (category && category !== "all") filter.category = category;
  const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 }, new: { createdAt: -1 } };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortMap[sort] || { createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  res.json({ items, total, pages: Math.ceil(total / Number(limit)) });
});

router.get("/categories", async (_req, res) => res.json(await Product.distinct("category")));

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).catch(() => null);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

router.post("/", protect, adminOnly, async (req, res) => res.status(201).json(await Product.create(req.body)));

router.put("/:id", protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

export default router;
