
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";

function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
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
      setError("Could not load registrations. Check that your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("eventpassOrganizerLoggedIn");
    navigate("/organizer-login");
  }

  const eventCount = new Set(
    tickets.map((ticket) => (ticket.eventName || "Unnamed Event").trim())
  ).size;

  const checkedInCount = tickets.filter((ticket) => ticket.used).length;
  const notCheckedInCount = tickets.length - checkedInCount;

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch = [
        ticket.participantName,
        ticket.eventName,
        ticket.ticketId,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

      const matchesFilter =
        filter === "ALL" ||
        (filter === "CHECKED_IN" && ticket.used) ||
        (filter === "NOT_CHECKED_IN" && !ticket.used);

      return matchesSearch && matchesFilter;
    });
  }, [tickets, search, filter]);

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#0b1120",
      color: "#f8fafc",
      fontFamily: "Arial, sans-serif",
      padding: "28px 20px 50px",
      boxSizing: "border-box",
    },
    container: {
      maxWidth: "1180px",
      margin: "0 auto",
    },
    card: {
      background: "#151e30",
      border: "1px solid #283449",
      borderRadius: "16px",
      padding: "22px",
    },
    input: {
      width: "100%",
      boxSizing: "border-box",
      background: "#0b1120",
      color: "#f8fafc",
      border: "1px solid #37445b",
      borderRadius: "10px",
      padding: "14px 16px",
      fontSize: "15px",
      outline: "none",
    },
    button: {
      background: "#7c3aed",
      color: "#ffffff",
      border: "none",
      borderRadius: "9px",
      padding: "11px 16px",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            paddingBottom: "24px",
            borderBottom: "1px solid #283449",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#ffffff",
              textDecoration: "none",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            <span
              style={{
                background: "#7c3aed",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              EP
            </span>
            EventPass
          </Link>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              to="/organizer-dashboard"
              style={{
                color: "#c4b5fd",
                textDecoration: "none",
                padding: "11px 12px",
              }}
            >
              ← Dashboard
            </Link>
            <button
              onClick={loadTickets}
              style={styles.button}
              disabled={loading}
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </div>
        </header>

        <section style={{ padding: "32px 0 24px" }}>
          <p
            style={{
              color: "#a78bfa",
              fontWeight: "bold",
              fontSize: "12px",
              letterSpacing: "2px",
            }}
          >
            ORGANIZER PORTAL
          </p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 38px)", margin: "8px 0" }}>
            View Registrations
          </h1>
          <p style={{ color: "#94a3b8", lineHeight: 1.6 }}>
            Search participants, view ticket details, and check registration status.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "16px",
            marginBottom: "26px",
          }}
        >
          {[
            {
              label: "Total Registrations",
              value: tickets.length,
              note: "All registered tickets",
            },
            {
              label: "Events",
              value: eventCount,
              note: "Unique event names",
            },
            {
              label: "Checked In",
              value: checkedInCount,
              note: "Successful entries",
            },
            {
              label: "Not Checked In",
              value: notCheckedInCount,
              note: "Participants yet to arrive",
            },
          ].map((item) => (
            <div key={item.label} style={styles.card}>
              <p style={{ color: "#94a3b8", margin: "0 0 14px" }}>
                {item.label}
              </p>
              <h2 style={{ fontSize: "34px", margin: "0 0 8px" }}>
                {item.value}
              </h2>
              <p style={{ color: "#a78bfa", fontSize: "13px", margin: 0 }}>
                {item.note}
              </p>
            </div>
          ))}
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0, fontSize: "20px" }}>
            Registration Directory
          </h2>
          <p style={{ color: "#94a3b8", marginBottom: "20px" }}>
            Search by participant, event name, or ticket ID.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
              marginBottom: "20px",
            }}
          >
            <input
              type="search"
              placeholder="Search registrations..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search registrations"
              style={styles.input}
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter registration status"
              style={styles.input}
            >
              <option value="ALL">All Registrations</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="NOT_CHECKED_IN">Not Checked In</option>
            </select>
          </div>

          <p style={{ color: "#94a3b8", fontSize: "13px" }}>
            Showing {filteredTickets.length} of {tickets.length} registrations
          </p>

          {loading && <p style={{ color: "#c4b5fd" }}>Loading registrations...</p>}

          {!loading && error && (
            <div role="alert" style={{ color: "#fca5a5", padding: "15px 0" }}>
              <p>{error}</p>
              <button onClick={loadTickets} style={styles.button}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredTickets.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "36px 12px",
                color: "#94a3b8",
              }}
            >
              <h3 style={{ color: "#f8fafc" }}>No registrations found</h3>
              <p>Try another search term or select a different filter.</p>
            </div>
          )}

          {!loading && !error && filteredTickets.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: "680px",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ background: "#202b40", color: "#cbd5e1" }}>
                    {["Ticket ID", "Participant", "Event", "Status"].map(
                      (heading) => (
                        <th
                          key={heading}
                          style={{
                            padding: "15px 14px",
                            fontSize: "13px",
                            fontWeight: "600",
                          }}
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket, index) => (
                    <tr
                      key={ticket.ticketId || index}
                      style={{ borderBottom: "1px solid #283449" }}
                    >
                      <td
                        style={{
                          padding: "17px 14px",
                          color: "#c4b5fd",
                          fontSize: "13px",
                        }}
                      >
                        {ticket.ticketId || "—"}
                      </td>
                      <td style={{ padding: "17px 14px", fontWeight: "bold" }}>
                        {ticket.participantName || "—"}
                      </td>
                      <td style={{ padding: "17px 14px", color: "#cbd5e1" }}>
                        {ticket.eventName || "—"}
                      </td>
                      <td style={{ padding: "17px 14px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "7px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            background: ticket.used ? "#064e3b" : "#78350f",
                            color: ticket.used ? "#6ee7b7" : "#fcd34d",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ticket.used ? "CHECKED IN" : "NOT CHECKED IN"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer
          style={{
            textAlign: "center",
            color: "#64748b",
            fontSize: "12px",
            paddingTop: "24px",
          }}
        >
          EventPass · Registration Management
        </footer>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
