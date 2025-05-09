const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  name: String,
  companyname: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
