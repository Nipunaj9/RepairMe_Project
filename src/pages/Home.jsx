import { Link } from 'react-router-dom';
import { FaWrench, FaMapMarkerAlt, FaClock, FaShieldAlt } from 'react-icons/fa';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <FaWrench className="logo-icon" />
              <span>RepairME</span>
            </div>
            <div className="nav-links">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Emergency Vehicle Repair
              <span className="gradient-text"> Made Simple</span>
            </h1>
            <p className="hero-subtitle">
              Connect with nearby garages instantly. Get help when you need it most.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Start Now
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose RepairME?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Location-Based</h3>
              <p>Find the nearest garages instantly using GPS technology</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaClock />
              </div>
              <h3>Real-Time Tracking</h3>
              <p>Track garage personnel in real-time and see estimated arrival</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaShieldAlt />
              </div>
              <h3>Trusted Garages</h3>
              <p>Connect with verified and trusted service providers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaWrench />
              </div>
              <h3>Quick Response</h3>
              <p>Get immediate assistance when your vehicle breaks down</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 RepairME. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;

