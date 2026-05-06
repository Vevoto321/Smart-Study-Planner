const express = require('express');
const router = express.Router();
const StudySchedule = require('../models/StudySchedule');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate AI-powered study schedule
router.post('/generate', async (req, res) => {
  try {
    const { userId, subject, topics, days } = req.body;

    const prompt = `Create a study schedule for ${subject} with the following topics: ${topics.map(t => t.name).join(', ')}. 
    The schedule should span ${days} days. For each day, assign specific topics with time slots (e.g., 9:00 AM - 10:30 AM).
    Consider the priority levels: ${topics.map(t => `${t.name} (${t.priority})`).join(', ')}.
    Return the schedule as a JSON array with this structure:
    [
      {
        "day": "Day 1",
        "date": "YYYY-MM-DD",
        "tasks": [
          {
            "topic": "Topic name",
            "startTime": "HH:MM",
            "endTime": "HH:MM"
          }
        ]
      }
    ]`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Extract JSON from the response (Gemini might add markdown code blocks)
    text = text.replace(/```json|```/g, "").trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const scheduleData = JSON.parse(jsonMatch ? jsonMatch[0] : text);

    const studySchedule = new StudySchedule({
      userId,
      subject,
      topics,
      schedule: scheduleData,
    });

    await studySchedule.save();
    res.status(201).json(studySchedule);
  } catch (error) {
    console.error('Schedule generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all schedules for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const schedules = await StudySchedule.find({ userId: req.params.userId });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const schedule = await StudySchedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task completion status
router.patch('/:scheduleId/day/:dayIndex/task/:taskIndex', async (req, res) => {
  try {
    const { completed } = req.body;
    const schedule = await StudySchedule.findById(req.params.scheduleId);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const dayIndex = parseInt(req.params.dayIndex);
    const taskIndex = parseInt(req.params.taskIndex);

    if (schedule.schedule[dayIndex] && schedule.schedule[dayIndex].tasks[taskIndex]) {
      schedule.schedule[dayIndex].tasks[taskIndex].completed = completed;
      schedule.markModified('schedule');
    }

    await schedule.save();
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete schedule
router.delete('/:id', async (req, res) => {
  try {
    const schedule = await StudySchedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
