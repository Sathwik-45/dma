const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(
  'mongodb+srv://sathwikpentakoti:Sathwik575@cluster0.agwd2xm.mongodb.net/digitalMarketingAgency?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema and Model
const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const Lead = mongoose.model('Lead', leadSchema);

// API Route
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const newLead = new Lead({ name, email, message });
    await newLead.save();
    res.json({ message: 'Message received! Thank you.' });
  } catch (err) {
    console.error('Error saving lead:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
