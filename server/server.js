const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); // Enable cross-origin support

// Initialize the app
const app = express();

// Middleware to parse incoming request bodies
app.use(bodyParser.json());

// Enable CORS for all origins (you can adjust this later for production)
app.use(cors());

// MongoDB connection
const dbURI = process.env.MONGODB_URI;
mongoose.connect(
  'mongodb+srv://sathwikpentakoti:Sathwik575@cluster0.agwd2xm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define Mongoose schemas
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
const Lead = mongoose.model("Lead", leadSchema);
const Testimonial = mongoose.model("Testimonial", testimonialSchema);

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
