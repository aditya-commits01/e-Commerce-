import { Router } from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

// Prices and totals are computed on the server, never trusted from the client.
router.post("/", protect, async (req, res) => {
  const { items, shipping, paymentMethod } = req.body;
  if (!items?.length) return res.status(400).json({ message: "Your cart is empty" });

  const products = await Product.find({ _id: { $in: items.map((i) => i.product) } });
  const lines = [];
  for (const i of items) {
    const p = products.find((x) => String(x._id) === String(i.product));
    if (!p) return res.status(400).json({ message: "A product in your cart no longer exists" });
    if (p.stock < i.qty) return res.status(400).json({ message: `Only ${p.stock} left of ${p.name}` });
    lines.push({ product: p._id, name: p.name, price: p.price, qty: i.qty });
  }
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);

  await Promise.all(lines.map((l) => Product.updateOne({ _id: l.product }, { $inc: { stock: -l.qty } })));
  const order = await Order.create({ user: req.user._id, items: lines, shipping, paymentMethod, total });
  res.status(201).json(order);
});

router.get("/mine", protect, async (req, res) =>
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }))
);

router.get("/", protect, adminOnly, async (_req, res) =>
  res.json(await Order.find().populate("user", "name email").sort({ createdAt: -1 }))
);

router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

export default router;
