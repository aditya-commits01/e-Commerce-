import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import Product from "./models/Product.js";

const img = (n) => `https://picsum.photos/seed/${n}/600/600`;
const products = [
  { name: "Wireless Earbuds", price: 1999, category: "Electronics", stock: 40, description: "Bluetooth 5.3 earbuds with 24-hour battery life.", image: img("earbuds") },
  { name: "Mechanical Keyboard", price: 3499, category: "Electronics", stock: 25, description: "Hot-swappable switches, compact 75% layout.", image: img("keyboard") },
  { name: "Smart Watch", price: 4999, category: "Electronics", stock: 18, description: "Heart-rate, sleep tracking and 7-day battery.", image: img("watch") },
  { name: "Cotton Hoodie", price: 1299, category: "Fashion", stock: 60, description: "Heavyweight cotton, relaxed fit.", image: img("hoodie") },
  { name: "Running Shoes", price: 2799, category: "Fashion", stock: 35, description: "Lightweight mesh with cushioned sole.", image: img("shoes") },
  { name: "Canvas Backpack", price: 1499, category: "Fashion", stock: 45, description: "20L, fits a 15-inch laptop.", image: img("backpack") },
  { name: "Steel Water Bottle", price: 599, category: "Home", stock: 100, description: "Insulated, keeps drinks cold for 24 hours.", image: img("bottle") },
  { name: "Desk Lamp", price: 899, category: "Home", stock: 50, description: "Dimmable LED with three colour temperatures.", image: img("lamp") },
  { name: "Clean Code (Book)", price: 749, category: "Books", stock: 30, description: "A handbook of agile software craftsmanship.", image: img("book1") },
  { name: "Python Crash Course", price: 699, category: "Books", stock: 30, description: "A hands-on, project-based introduction to Python.", image: img("book2") },
];

await mongoose.connect(process.env.MONGO_URI);
await Promise.all([User.deleteMany(), Product.deleteMany()]);
await User.create({ name: "Admin", email: "admin@shop.com", password: "admin123", isAdmin: true });
await User.create({ name: "Demo User", email: "user@shop.com", password: "user123" });
await Product.insertMany(products);
console.log("Seeded. Admin: admin@shop.com / admin123 | User: user@shop.com / user123");
await mongoose.disconnect();
