const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();


// ---------- CORS FIX ----------
const allowedOrigins = [
  "https://dma-bay.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, postman)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.includes(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(null, true); // prevent crash (IMPORTANT)
  },
  credentials: true
}));


// DO NOT USE app.options("*", cors());  ❌ (REMOVED)

app.use(express.json());


// ---------- MongoDB ----------
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dma';
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

mongoose.connect(dbURI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// ---------- Schemas ----------
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  name: String,
  createdAt: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

const testimonialSchema = new mongoose.Schema({
  name: String,
  companyname: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Lead = mongoose.model("Lead", leadSchema);
const Testimonial = mongoose.model("Testimonial", testimonialSchema);


// ---------- AUTH ----------
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed });

    res.json({ message: "Registered Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration error" });
  }
});


app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: { name: user.name, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});


// ---------- CONTACT ----------
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await Lead.create({ name, email, message });
    res.json({ message: "Contact submitted" });
  } catch {
    res.status(500).json({ message: "Error" });
  }
});


// ---------- TESTIMONIAL ----------
app.post("/api/testimonial", async (req, res) => {
  try {
    const { name, companyname, message } = req.body;
    await Testimonial.create({ name, companyname, message });
    res.json({ message: "Testimonial added" });
  } catch {
    res.status(500).json({ message: "Error" });
  }
});

app.get("/api/testimonials", async (req, res) => {
  const data = await Testimonial.find().sort({ createdAt: -1 });
  res.json(data);
});


// ---------- ROOT ROUTE ----------
app.get("/", (req, res) => {
  res.send("DMA Backend API Running 🚀");
});


// ---------- 404 HANDLER (VERY IMPORTANT) ----------
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});


// ---------- PORT FIX (RENDER IMPORTANT) ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});