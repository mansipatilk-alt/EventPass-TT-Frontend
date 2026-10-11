
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

function OrganizerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(event) {
    event.preventDefault();
    setError("");

    if (
      email.trim().toLowerCase() === "organizer@eventpass.com" &&
      password === "EventPass@123"
    ) {
      sessionStorage.setItem("eventpassOrganizerLoggedIn", "true");
      navigate("/organizer-dashboard");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  }

  return (
    <div className="organizer-page">
      <div className="organizer-login-card">
        <Link to="/" className="organizer-back-link">
          ← Back to Home
        </Link>

        <div className="organizer-logo">EP</div>

        <h1>Organizer Login</h1>
        <p className="organizer-subtitle">
          Sign in to manage your EventPass registrations and tickets.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="organizer-email">Email Address</label>
          <input
            id="organizer-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="organizer-password">Password</label>
          <input
            id="organizer-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="organizer-error">{error}</p>}

          <button type="submit" className="organizer-primary-button">
            Sign In →
          </button>
        </form>

        <p className="organizer-demo-note">
          Demo login: organizer@eventpass.com
        </p>
      </div>
    </div>
  );
}

export default OrganizerLogin;
