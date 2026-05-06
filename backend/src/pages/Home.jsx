import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import { BookOpen, Brain, Calendar, LogOut } from 'lucide-react';

function Home() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.verify();
      setUser(response.data.user);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('userName', response.data.user.name);
    } catch (error) {
      // User not logged in
      setUser(null);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = isLogin 
        ? await authAPI.login({ email, password })
        : await authAPI.register({ name, email, password });

      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('userName', response.data.user.name);
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authAPI.resetPassword({
        email,
        currentPassword,
        newPassword,
      });
      setSuccess('Password reset successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setShowResetPassword(false);
    } catch (error) {
      setError(error.response?.data?.error || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <header className="header">
        <h1 style={{ color: "white" }}>
  Smart Study Planner
</h1>

<p style={{ color: "#ccc" }}>
  AI-powered study schedules and quiz generation
</p>

<img src="/book.png" alt="Book" className="hero-image" />
      </header>

      {!user ? (
        <div className="user-form">
          <div className="auth-tabs">
            <button 
              className={`tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={`tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {showResetPassword ? (
            <form onSubmit={handleResetPassword}>
              <h2>Reset Password</h2>
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                minLength="6"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Reset Password'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowResetPassword(false)}
                className="cancel-btn"
              >
                Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleAuth}>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
              </button>
              {isLogin && (
                <button 
                  type="button" 
                  onClick={() => setShowResetPassword(true)}
                  className="reset-password-link"
                >
                  Forgot Password?
                </button>
              )}
            </form>
          )}
        </div>
      ) : (
        <div className="features">
          <div className="welcome-header">
            <h2 style={{ color: "white" }}>Welcome, {user.name}!</h2>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={20} />
              Logout
            </button>
          </div>
          <div className="feature-cards">
            <div className="feature-card" onClick={() => navigate('/schedule')}>
              <Calendar size={48} />
              <h3>Study Schedule</h3>
              <p>Generate AI-powered study schedules based on your topics</p>
            </div>
            <div className="feature-card" onClick={() => navigate('/quiz')}>
              <Brain size={48} />
              <h3>Quiz Generator</h3>
              <p>Create custom quizzes to test your knowledge</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
