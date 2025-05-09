const express = require("express");
const mongoose = require("mongoose");
const Lead = require("./models/Lead"); // Import the Lead model
const bodyParser = require("body-parser");

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB (make sure to replace the placeholder with your MongoDB URI)
mongoose.connect("your-mongodb-uri", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// POST route to handle lead form submission
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (name && email && message) {
    try {
      const newLead = new Lead({
        name,
        email,
        message,
      });

      // Save the lead to the database
      await newLead.save();

      res.json({ message: "Form submitted successfully!" });
    } catch (err) {
      res.status(500).json({ message: "Error saving lead", error: err.message });
    }
  } else {
    res.status(400).json({ message: "Please provide all fields." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
