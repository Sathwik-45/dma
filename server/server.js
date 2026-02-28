const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Initialize the app
const app = express();

// Middleware to parse incoming request bodies
app.use(bodyParser.json());

// Enable CORS for all origins (you can adjust this later for production)
app.use(cors());

// MongoDB connection
require("dotenv").config();
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dma';
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

mongoose.connect(dbURI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define Mongoose schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyname: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create Mongoose models
const User = mongoose.model("User", userSchema);
const Lead = mongoose.model("Lead", leadSchema);
const Testimonial = mongoose.model("Testimonial", testimonialSchema);

// --- Auth Routes ---
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});


// POST route for contact form submissions
app.post("/api/contact", async (req, res) => {
  try {
    console.log("Received contact form data:", req.body);
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, Email, and Message are required." });
    }

    const newLead = new Lead({ name, email, message });
    await newLead.save();

    res.status(200).json({ message: "Contact form submitted successfully!" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ message: "Error processing your request." });
  }
});

// POST route for testimonial submissions
app.post("/api/testimonial", async (req, res) => {
  try {
    console.log("Received testimonial data:", req.body);
    const { name, companyname, message } = req.body;

    if (!name || !companyname || !message) {
      return res.status(400).json({ message: "Name, Company Name, and Message are required." });
    }

    const newTestimonial = new Testimonial({ name, companyname, message });
    await newTestimonial.save();

    res.status(200).json({ message: "Testimonial submitted successfully!" });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    res.status(500).json({ message: "Error processing your request." });
  }
});
app.get("/api/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ message: "Error fetching testimonials." });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
