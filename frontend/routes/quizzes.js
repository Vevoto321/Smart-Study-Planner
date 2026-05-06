const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate AI-powered quiz
router.post('/generate', async (req, res) => {
  try {
    const { userId, subject, topic, questionCount = 5 } = req.body;

    const prompt = `Generate ${questionCount} multiple choice questions about ${topic} in ${subject}. 
    For each question, provide:
    - The question text
    - 4 options (A, B, C, D)
    - The correct answer (0 for A, 1 for B, 2 for C, 3 for D)
    - A brief explanation for the correct answer
    
    Return the questions as a JSON array with this structure:
    [
      {
        "question": "Question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Explanation here"
      }
    ]`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Extract JSON from the response (Gemini might add markdown code blocks)
    text = text.replace(/```json|```/g, "").trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const questions = JSON.parse(jsonMatch ? jsonMatch[0] : text);

    const quiz = new Quiz({
      userId,
      subject,
      topic,
      questions,
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all quizzes for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.params.userId });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete quiz
router.delete('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
