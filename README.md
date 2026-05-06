# Smart Study Planner with AI-Generated Schedule and Quiz Generation

A full-stack application that uses Google Gemini AI to generate personalized study schedules and quizzes.

## Features

- **AI-Powered Study Schedules**: Generate personalized study plans based on subjects, topics, and priorities
- **AI Quiz Generation**: Create custom multiple-choice quizzes for any subject and topic
- **Task Tracking**: Mark study tasks as completed and track progress
- **Quiz Taking**: Interactive quiz interface with instant feedback and explanations
- **Modern UI**: Clean, responsive interface built with React

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Google Gemini AI API

### Frontend
- React 19
- Vite
- React Router
- Axios
- Lucide React (icons)

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection string
- Google Gemini API key (get one from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/studyplanner
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

4. Start the backend server:
```bash
node server.js
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is in use)

## Usage

1. Open your browser and navigate to the frontend URL
2. Create a user profile with your name and email
3. **Study Schedule**:
   - Click on "Study Schedule"
   - Enter subject, number of days, and topics with priorities
   - Click "Generate Schedule" to create an AI-powered study plan
   - Track your progress by checking off completed tasks
4. **Quiz Generator**:
   - Click on "Quiz Generator"
   - Enter subject, topic, and number of questions
   - Click "Generate Quiz" to create an AI-generated quiz
   - Take the quiz and see your results with explanations

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Schedules
- `POST /api/schedules/generate` - Generate AI study schedule
- `GET /api/schedules/user/:userId` - Get all schedules for a user
- `GET /api/schedules/:id` - Get schedule by ID
- `PATCH /api/schedules/:scheduleId/task/:taskIndex` - Update task completion
- `DELETE /api/schedules/:id` - Delete schedule

### Quizzes
- `POST /api/quizzes/generate` - Generate AI quiz
- `GET /api/quizzes/user/:userId` - Get all quizzes for a user
- `GET /api/quizzes/:id` - Get quiz by ID
- `DELETE /api/quizzes/:id` - Delete quiz

## Project Structure

```
AiStudyPlanner/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── StudySchedule.js
│   │   └── Quiz.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── schedules.js
│   │   └── quizzes.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Schedule.jsx
    │   │   └── Quiz.jsx
    │   ├── api.js
    │   ├── App.jsx
    │   └── index.css
    └── package.json
```

## Important Notes

- Make sure MongoDB is running before starting the backend server
- Replace `your_actual_gemini_api_key_here` in the `.env` file with your actual Google Gemini API key
- The application uses localStorage to store user session data
