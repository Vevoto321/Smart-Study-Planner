const mongoose = require('mongoose');

const studyScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  topics: [{
    name: String,
    duration: Number, // in minutes
    priority: String, // 'high', 'medium', 'low'
  }],
  schedule: [{
    day: String,
    date: Date,
    tasks: [{
      topic: String,
      startTime: String,
      endTime: String,
      completed: {
        type: Boolean,
        default: false,
      },
    }],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StudySchedule', studyScheduleSchema);
