import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Welcome to Study Sphere!</h1>
        <p>Your one-stop solution for tracking your study progress!</p>
        <div className="cta-buttons">
          <Link to="/login" className="cta-button login-button">
            Login
          </Link>
          <Link to="/signup" className="cta-button signup-button">
            Sign Up
          </Link>
          <Link to="admin/login" className="cta-button login-button">
            Login as Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
