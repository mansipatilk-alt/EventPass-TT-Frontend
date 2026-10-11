
import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import html2canvas from "html2canvas";
import api from "./api";
import "./Registration.css";

function Register() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    eventName: params.get("event") || "AI Workshop",
  });

  const [message, setMessage] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setTicketId("");
    setLoading(true);

    try {
      const response = await api.post("/register", formData);
      setTicketId(response.data.ticketId);
      setMessage("Registration successful!");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(
        "Registration failed. Please check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!ticketRef.current) {
      return;
    }

    setDownloading(true);

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");

      link.href = image;
      link.download = `EventPass-${ticketId}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage("Ticket downloaded successfully!");
    } catch (error) {
      console.error("Ticket download error:", error);
      setMessage("Unable to download the ticket. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  const apiUrl =
    import.meta.env.VITE_API_URL || "http://localhost:8081";

  return (
    <div className="register-page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
          width: "100%",
          maxWidth: ticketId ? "1100px" : "580px",
          margin: "0 auto",
          padding: "30px 20px",
          boxSizing: "border-box",
          flexWrap: "wrap",
        }}
      >
        <div
          className="register-card"
          style={{
            flex: "1 1 430px",
            minWidth: "0",
            maxWidth: ticketId ? "520px" : "540px",
            boxSizing: "border-box",
          }}
        >
          <button
            className="back-button"
            type="button"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>

          <p className="register-eyebrow">
            EVENTPASS / REGISTRATION
          </p>

          <h1>Save your spot.</h1>

          <p className="register-description">
            Enter your details to register for your event.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter 10-digit mobile number"
              value={formData.mobile}
              onChange={handleChange}
              pattern="[0-9]{10}"
              required
            />

            <label>Select Event</label>
            <select
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              required
            >
              <option value="AI Workshop">AI Workshop</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Technical Quiz">Technical Quiz</option>
              <option value="Cloud Computing Workshop">
                Cloud Computing Workshop
              </option>
            </select>

            <button
              className="register-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Registering..."
                : "Complete Registration →"}
            </button>
          </form>

          {message && !ticketId && (
            <p style={{ color: "#ff6b81", marginTop: "18px" }}>
              {message}
            </p>
          )}
        </div>

        {ticketId && (
          <div
            style={{
              flex: "0 1 360px",
              minWidth: "260px",
              padding: "28px 22px",
              boxSizing: "border-box",
              textAlign: "center",
              background: "#ffffff",
              borderRadius: "20px",
              color: "#0f172a",
              boxShadow: "0 15px 45px rgba(0,0,0,0.25)",
            }}
          >
            <div ref={ticketRef}>
              <div
                style={{
                  padding: "10px 0",
                  background: "#ffffff",
                }}
              >
                <p
                  style={{
                    color: "#6366f1",
                    fontWeight: "800",
                    letterSpacing: "3px",
                    fontSize: "13px",
                    margin: "0 0 8px",
                  }}
                >
                  EVENTPASS
                </p>

                <h2 style={{ margin: "0 0 6px" }}>
                  Registration Ticket
                </h2>

                <p style={{ color: "#64748b", fontSize: "13px" }}>
                  Your event entry pass
                </p>

                <div
                  style={{
                    borderTop: "1px dashed #cbd5e1",
                    margin: "20px 0",
                  }}
                />

                <div
                  style={{
                    textAlign: "left",
                    marginBottom: "18px",
                  }}
                >
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                  >
                    PARTICIPANT NAME
                  </p>

                  <p
                    style={{
                      color: "#0f172a",
                      fontWeight: "700",
                      marginTop: "0",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {formData.name}
                  </p>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                  >
                    EVENT NAME
                  </p>

                  <p
                    style={{
                      color: "#0f172a",
                      fontWeight: "700",
                      marginTop: "0",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {formData.eventName}
                  </p>

                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                  >
                    GENERATED TICKET ID
                  </p>

                  <p
                    style={{
                      color: "#4f46e5",
                      fontWeight: "800",
                      marginTop: "0",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {ticketId}
                  </p>
                </div>

                <img
                  crossOrigin="anonymous"
                  src={`${apiUrl}/qr?ticketId=${encodeURIComponent(
                    ticketId
                  )}`}
                  alt={`QR code for ticket ${ticketId}`}
                  style={{
                    display: "block",
                    width: "220px",
                    height: "220px",
                    maxWidth: "100%",
                    objectFit: "contain",
                    margin: "0 auto",
                  }}
                />

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "12px",
                    marginTop: "16px",
                  }}
                >
                  Present this QR code at the event entrance.
                </p>

                <div
                  style={{
                    borderTop: "1px dashed #cbd5e1",
                    marginTop: "20px",
                    paddingTop: "14px",
                  }}
                >
                  <p
                    style={{
                      color: "#16a34a",
                      fontWeight: "700",
                      margin: "0",
                    }}
                  >
                    Registration Successful
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "13px 16px",
                border: "none",
                borderRadius: "10px",
                background: downloading ? "#64748b" : "#4f46e5",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: "700",
                cursor: downloading ? "wait" : "pointer",
              }}
            >
              {downloading
                ? "Preparing Ticket..."
                : "⬇ Download Ticket"}
            </button>

            {message && ticketId && (
              <p
                role="status"
                style={{
                  color: "#334155",
                  fontSize: "13px",
                  marginTop: "12px",
                }}
              >
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;
