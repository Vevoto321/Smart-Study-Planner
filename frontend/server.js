const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studyplanner', {
  
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/schedules', require('./routes/schedules'));
app.use('/api/quizzes', require('./routes/quizzes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Smart Study Planner API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
