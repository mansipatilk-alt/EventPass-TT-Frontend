
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import "./App.css";

function OrganizerDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("eventpassOrganizerLoggedIn") !== "true") {
      navigate("/organizer-login");
      return;
    }

    loadTickets();
  }, [navigate]);

  async function loadTickets() {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/tickets");
      setTickets(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Could not load tickets:", err);
      setError("Could not load ticket data. Check that the Spring Boot backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("eventpassOrganizerLoggedIn");
    navigate("/organizer-login");
  }

  const checkedInCount = tickets.filter((ticket) => ticket.used).length;
  const pendingCount = tickets.length - checkedInCount;
  const attendancePercentage = tickets.length === 0
    ? 0
    : Math.round((checkedInCount / tickets.length) * 100);

  const eventData = useMemo(() => {
    const eventMap = {};

    tickets.forEach((ticket) => {
      const eventName = (ticket.eventName || "Unnamed Event").trim();
      eventMap[eventName] = (eventMap[eventName] || 0) + 1;
    });

    return Object.entries(eventMap)
      .map(([eventName, registrations]) => ({
        eventName,
        registrations,
      }))
      .sort((a, b) => a.eventName.localeCompare(b.eventName));
  }, [tickets]);

  return (
    <div className="organizer-dashboard-page">
      <header className="organizer-dashboard-header">
        <Link to="/" className="organizer-brand">
          <span className="organizer-logo-small">EP</span>
          <span>EventPass</span>
        </Link>

        <div className="organizer-header-actions">
          <Link to="/verify" className="organizer-nav-link">
            Verify Tickets
          </Link>

          <Link to="/analytics" className="organizer-nav-link">
            View Registrations
          </Link>

          <button onClick={handleLogout} className="organizer-logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="organizer-dashboard-content">
        <div className="organizer-dashboard-heading">
          <div>
            <p className="organizer-eyebrow">ORGANIZER PANEL</p>
            <h1>Dashboard Overview</h1>
            <p>Monitor registrations and event attendance.</p>
          </div>

          <button
            onClick={loadTickets}
            className="organizer-refresh-button"
            disabled={loading}
          >
            {loading ? "Loading..." : "↻ Refresh Data"}
          </button>
        </div>

        <section className="organizer-stats-grid">
          <div className="organizer-stat-card">
            <span className="organizer-stat-label">Total Registrations</span>
            <strong>{tickets.length}</strong>
            <span>Registered tickets</span>
          </div>

          <div className="organizer-stat-card">
            <span className="organizer-stat-label">Checked In</span>
            <strong>{checkedInCount}</strong>
            <span>Successful entries</span>
          </div>

          <div className="organizer-stat-card">
            <span className="organizer-stat-label">Not Checked In</span>
            <strong>{pendingCount}</strong>
            <span>Awaiting arrival</span>
          </div>

          <div className="organizer-stat-card">
            <span className="organizer-stat-label">Attendance Rate</span>
            <strong>{attendancePercentage}%</strong>
            <span>Of registered tickets</span>
          </div>
        </section>

        <section className="organizer-attendance-card">
          <div className="organizer-attendance-heading">
            <div>
              <h2>Attendance Progress</h2>
              <p>Checked-in tickets compared with all registrations.</p>
            </div>
            <strong>{attendancePercentage}%</strong>
          </div>

          <div
            className="organizer-progress-track"
            role="progressbar"
            aria-valuenow={attendancePercentage}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Attendance percentage"
          >
            <div
              className="organizer-progress-fill"
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </section>

        <section className="organizer-tickets-section">
          <div className="organizer-tickets-heading">
            <div>
              <h2>Event Registration Overview</h2>
              <p>Overall registrations received for each event.</p>
            </div>
            <span className="organizer-ticket-count">
              {eventData.length} events
            </span>
          </div>

          {loading && (
            <p className="organizer-message">Loading registration data...</p>
          )}

          {!loading && error && (
            <div className="organizer-error-panel">
              <p>{error}</p>
              <button onClick={loadTickets}>Try Again</button>
            </div>
          )}

          {!loading && !error && eventData.length === 0 && (
            <div className="organizer-empty-state">
              <h3>No registrations yet</h3>
              <p>Event registration counts will appear here after participants register.</p>
            </div>
          )}

          {!loading && !error && eventData.length > 0 && (
            <div className="organizer-table-wrapper">
              <table className="organizer-tickets-table">
                <thead>
                  <tr>
                    <th>S. No.</th>
                    <th>Event Name</th>
                    <th>Total Registrations</th>
                  </tr>
                </thead>
                <tbody>
                  {eventData.map((event, index) => (
                    <tr key={event.eventName}>
                      <td>{index + 1}</td>
                      <td>{event.eventName}</td>
                      <td>
                        <strong>{event.registrations}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default OrganizerDashboard;
