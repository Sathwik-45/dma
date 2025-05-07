// server/models/Lead.js
const mongoose = require("mongoose");

// Define schema for leads
const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, // Simple email validation
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create model based on schema
const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;
