import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI, authAPI } from '../api';
import { Brain, Plus, Trash2, Home, CheckCircle, XCircle } from 'lucide-react';

function Quiz() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showQuiz, setShowQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    questionCount: 5,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
    if (userId) {
      loadQuizzes();
    }
  }, [userId]);

  const checkAuth = async () => {
    try {
      await authAPI.verify();
    } catch (error) {
      navigate('/');
    }
  };

  const loadQuizzes = async () => {
    try {
      const response = await quizAPI.getByUser(userId);
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error loading quizzes:', error);
    }
  };

  const generateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await quizAPI.generate({ ...formData, userId });
      setShowForm(false);
      setFormData({ subject: '', topic: '', questionCount: 5 });
      loadQuizzes();
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizAPI.delete(id);
        loadQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const startQuiz = (quiz) => {
    setShowQuiz(quiz);
    setUserAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (questionIndex, answerIndex) => {
    setUserAnswers({ ...userAnswers, [questionIndex]: answerIndex });
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    showQuiz.questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return { correct, total: showQuiz.questions.length };
  };

  return (
    <div className="quiz-page">
      <header className="page-header">
        <button onClick={() => navigate('/')} className="back-btn">
          <Home size={20} />
        </button>
        <h1>🧠 Quiz Generator</h1>
        <button onClick={() => setShowForm(!showForm)} className="add-btn">
          <Plus size={20} />
          New Quiz
        </button>
      </header>

      {showForm && (
        <div className="form-card">
          <h2>Create AI Quiz</h2>
          <form onSubmit={generateQuiz}>
            <input
              type="text"
              placeholder="Subject (e.g., Physics)"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Topic (e.g., Newton's Laws)"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Number of questions (1-10)"
              value={formData.questionCount}
              onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
              min="1"
              max="10"
              required
            />
            <div className="form-actions">
              <button type="button" onClick={() => setShowForm(false)}>
                Cancel
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Quiz'}
              </button>
            </div>
          </form>
        </div>
      )}

      {showQuiz ? (
        <div className="quiz-container">
          <div className="quiz-header">
            <h2>{showQuiz.subject} - {showQuiz.topic}</h2>
            {!showResults && (
              <button onClick={() => setShowQuiz(null)} className="back-btn">
                Back
              </button>
            )}
          </div>

          {showQuiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="question-card">
              <h3>Question {qIndex + 1}</h3>
              <p className="question-text">{question.question}</p>
              <div className="options">
                {question.options.map((option, oIndex) => (
                  <button
                    key={oIndex}
                    className={`option-btn ${
                      userAnswers[qIndex] === oIndex ? 'selected' : ''
                    } ${
                      showResults
                        ? oIndex === question.correctAnswer
                          ? 'correct'
                          : userAnswers[qIndex] === oIndex
                          ? 'incorrect'
                          : ''
                        : ''
                    }`}
                    onClick={() => !showResults && handleAnswer(qIndex, oIndex)}
                    disabled={showResults}
                  >
                    {showResults && oIndex === question.correctAnswer && (
                      <CheckCircle size={16} className="icon" />
                    )}
                    {showResults &&
                      userAnswers[qIndex] === oIndex &&
                      oIndex !== question.correctAnswer && (
                        <XCircle size={16} className="icon" />
                      )}
                    {option}
                  </button>
                ))}
              </div>
              {showResults && (
                <div className="explanation">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              )}
            </div>
          ))}

          {!showResults ? (
            <button
              onClick={submitQuiz}
              className="submit-btn"
              disabled={Object.keys(userAnswers).length < showQuiz.questions.length}
            >
              Submit Quiz
            </button>
          ) : (
            <div className="results">
              <h3>Results</h3>
              <p className="score">
                You scored {calculateScore().correct} out of {calculateScore().total}
              </p>
              <button onClick={() => setShowQuiz(null)} className="back-btn">
                Back to Quizzes
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="quizzes-list">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card">
              <div className="quiz-card-header">
                <h3>{quiz.subject}</h3>
                <button onClick={() => deleteQuiz(quiz._id)} className="delete-btn">
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="quiz-topic">{quiz.topic}</p>
              <p className="quiz-count">{quiz.questions.length} questions</p>
              <button onClick={() => startQuiz(quiz)} className="start-btn">
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Quiz;
