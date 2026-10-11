import { Link } from "react-router-dom";
import "./App.css";

const events = [
  {
    name: "AI Workshop",
    category: "ARTIFICIAL INTELLIGENCE",
    description:
      "Explore AI, machine learning, and the technologies shaping tomorrow.",
    date: "LEARN SOMETHING NEW",
    number: "01",
  },
  {
    name: "Hackathon",
    category: "INNOVATION",
    description:
      "Build ideas, solve real problems, and turn your creativity into code.",
    date: "BUILD SOMETHING GREAT",
    number: "02",
  },
  {
    name: "Technical Quiz",
    category: "TECHNOLOGY",
    description:
      "Challenge your knowledge and put your technical skills to the test.",
    date: "TEST YOUR KNOWLEDGE",
    number: "03",
  },
  {
    name: "Cloud Computing Workshop",
    category: "CLOUD TECHNOLOGY",
    description:
      "Discover cloud platforms and the future of scalable applications.",
    date: "EXPAND YOUR SKILLS",
    number: "04",
  },
];

function AppHome() {
  return (
    <div className="home-page">
      <nav className="navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">E</span>
          <span>
            EventPass<span className="brand-dot">.</span>
          </span>
        </Link>

        <div className="nav-links">
          <a href="#events">Explore Events</a>
          <a href="#how-it-works">How It Works</a>
          <Link to="/verify">Verify Ticket ↗</Link>
          <Link to="/organizer-login">Organizer Login ↗</Link>
        </div>

        <a className="nav-button" href="#events">
          Get Tickets ↗
        </a>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="live-dot"></span>
              YOUR NEXT EXPERIENCE STARTS HERE
            </div>

            <h1>
              Less waiting.
              <br />
              <span>More experiencing.</span>
            </h1>

            <p className="hero-description">
              Discover exciting events, reserve your spot, and get your
              digital ticket. Everything you need for a smoother event
              experience, all in one place.
            </p>

            <div className="hero-actions">
              <a href="#events" className="primary-button">
                Explore Events <span>↗</span>
              </a>
              <a href="#how-it-works" className="secondary-button">
                How it works
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>01.</strong>
                <span>Choose an event</span>
              </div>
              <div>
                <strong>02.</strong>
                <span>Register online</span>
              </div>
              <div>
                <strong>03.</strong>
                <span>Get your ticket</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="floating-label floating-top">
              <span className="label-icon">✦</span>
              Your next big thing
            </div>

            <div className="ticket-card">
              <div className="ticket-top">
                <div className="ticket-brand">
                  <span className="ticket-brand-icon">E</span>
                  EVENTPASS
                </div>
                <span className="ticket-status">DIGITAL PASS</span>
              </div>

              <div className="ticket-art">
                <div className="ticket-art-glow"></div>
                <div className="ticket-symbol">✳</div>
                <span>
                  MAKE IT
                  <br />
                  MEMORABLE.
                </span>
                <div className="ticket-art-number">EP / 001</div>
              </div>

              <div className="ticket-info">
                <div>
                  <span>YOUR NEXT EXPERIENCE</span>
                  <h3>Starts right here.</h3>
                </div>
                <div className="ticket-arrow">↗</div>
              </div>

              <div className="ticket-perforation">
                <span></span>
                <span></span>
              </div>

              <div className="ticket-bottom">
                <span>ONE PASS. ENDLESS POSSIBILITIES.</span>
                <span>EVENTPASS®</span>
              </div>
            </div>

            <div className="floating-label floating-bottom">
              <span className="check-icon">✓</span>
              Your ticket, simplified.
            </div>
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">FIND YOUR NEXT EXPERIENCE</p>
              <h2>
                Events worth showing up for<span>.</span>
              </h2>
            </div>
            <p className="section-side-text">
              Find your people. Learn something new.
              <br />
              Make every moment count.
            </p>
          </div>

          <div className="event-grid">
            {events.map((event) => (
              <article className="event-card" key={event.name}>
                <div className={`event-art event-art-${event.number}`}>
                  <span className="event-number">{event.number} / 04</span>
                  <span className="event-art-symbol">
                    {event.number === "01" && "✳"}
                    {event.number === "02" && "⌘"}
                    {event.number === "03" && "⟡"}
                    {event.number === "04" && "◈"}
                  </span>
                  <span className="event-art-caption">{event.category}</span>
                </div>

                <div className="event-card-content">
                  <p className="event-category">{event.category}</p>
                  <h3>{event.name}</h3>
                  <p className="event-description">{event.description}</p>

                  <div className="event-card-footer">
                    <span>{event.date}</span>
                    <Link
                      to={`/register?event=${encodeURIComponent(event.name)}`}
                      aria-label={`Register for ${event.name}`}
                    >
                      ↗
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-heading">
            <p className="section-eyebrow">SIMPLE BY DESIGN</p>
            <h2>Your ticket to a better experience.</h2>
            <p>
              No complicated steps. Just find your event, register,
              and get ready to show up.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">01</span>
              <span className="step-symbol">⌕</span>
              <h3>Discover</h3>
              <p>
                Explore events and find the experience that excites you.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">02</span>
              <span className="step-symbol">↗</span>
              <h3>Register</h3>
              <p>
                Enter your details and reserve your place in a few clicks.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">03</span>
              <span className="step-symbol">▦</span>
              <h3>Get your pass</h3>
              <p>
                Receive your unique ticket ID and get ready for the event.
              </p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div>
            <p className="section-eyebrow">
              YOUR NEXT CHAPTER STARTS HERE
            </p>
            <h2>Got plans? Now you do.</h2>
            <p>Find your next event and make it count.</p>
          </div>

          <a href="#events" className="primary-button">
            Find an Event <span>↗</span>
          </a>
        </section>
      </main>

      <footer className="footer">
        <Link to="/" className="brand">
          <span className="brand-icon">E</span>
          <span>
            EventPass<span className="brand-dot">.</span>
          </span>
        </Link>

        <p>Good events. Great people. Unforgettable moments.</p>
        <span>© 2026 EventPass. All rights reserved.</span>
      </footer>
    </div>
  );
}

export default AppHome;
