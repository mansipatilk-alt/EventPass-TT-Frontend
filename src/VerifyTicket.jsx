import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "./api";
import "./App.css";

function VerifyTicket() {
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState("");
  const scannerRef = useRef(null);
  const processingRef = useRef(false);

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner(
      "eventpass-qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        if (processingRef.current) return;

        processingRef.current = true;
        setScanning(false);
        setError("");

        try {
          await scanner.clear();

          const ticketId = decodedText.trim();

          const response = await api.get("/verify", {
            params: { ticketId },
          });

          setResult(response.data);
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "Unable to verify this QR code. Please try again."
          );
        }
      },
      () => {
        // Ignore normal camera scanning messages.
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  function scanAgain() {
    processingRef.current = false;
    setResult(null);
    setError("");
    setScanning(true);
  }

  const successful = result?.valid === true;
  const alreadyUsed = result?.status === "ALREADY USED";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080d1b",
        color: "#f5f7ff",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "650px", margin: "0 auto" }}>
        <a
          href="/"
          style={{
            color: "#7ba5ff",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          ← Back to EventPass
        </a>

        <div style={{ textAlign: "center", marginTop: "35px" }}>
          <div style={{ fontSize: "42px" }}>▦</div>

          <h1 style={{ fontSize: "32px", marginBottom: "12px" }}>
            Ticket Verification
          </h1>

          <p style={{ color: "#aab5ce", lineHeight: 1.6 }}>
            Scan the QR code on the participant's EventPass ticket
            to verify entry automatically.
          </p>
        </div>

        {scanning && (
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "#111a2e",
              border: "1px solid #263657",
              borderRadius: "18px",
            }}
          >
            <h3 style={{ textAlign: "center", marginTop: 0 }}>
              Scan Participant QR Code
            </h3>

            <div id="eventpass-qr-reader"></div>

            <p
              style={{
                color: "#aab5ce",
                fontSize: "13px",
                textAlign: "center",
                marginBottom: 0,
              }}
            >
              Allow camera access when your browser asks for permission.
            </p>
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              borderRadius: "12px",
              background: "#351b27",
              border: "1px solid #b9435d",
              color: "#ffb7c3",
            }}
          >
            <h3>Verification Error</h3>
            <p>{error}</p>
            <button onClick={scanAgain} style={buttonStyle}>
              Scan Again
            </button>
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: "25px",
              padding: "25px",
              borderRadius: "16px",
              background: successful ? "#102e29" : "#351b27",
              border: `1px solid ${
                successful ? "#258b70" : "#b9435d"
              }`,
            }}
          >
            <h2
              style={{
                textAlign: "center",
                color: successful ? "#68e0b5" : "#ff8f9f",
                fontSize: "28px",
              }}
            >
              {result.status || "VERIFICATION RESULT"}
            </h2>

            <p style={{ textAlign: "center" }}>
              {result.message}
            </p>

            {result.ticketId && (
              <div style={detailStyle}>
                <span>Ticket ID</span>
                <strong>{result.ticketId}</strong>
              </div>
            )}

            {result.participantName && (
              <div style={detailStyle}>
                <span>Participant</span>
                <strong>{result.participantName}</strong>
              </div>
            )}

            {result.eventName && (
              <div style={detailStyle}>
                <span>Event</span>
                <strong>{result.eventName}</strong>
              </div>
            )}

            {successful && (
              <p
                style={{
                  textAlign: "center",
                  color: "#68e0b5",
                  fontWeight: "bold",
                }}
              >
                ✓ Entry approved. Ticket checked in successfully.
              </p>
            )}

            {alreadyUsed && (
              <p
                style={{
                  textAlign: "center",
                  color: "#ffb7c3",
                  fontWeight: "bold",
                }}
              >
                ⚠ Entry denied. This ticket has already been used.
              </p>
            )}

            <button
              onClick={scanAgain}
              style={{ ...buttonStyle, width: "100%", marginTop: "20px" }}
            >
              Scan Next Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const buttonStyle = {
  background: "#3978ff",
  color: "#ffffff",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};

const detailStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  padding: "14px 0",
  borderBottom: "1px solid #35445d",
};

export default VerifyTicket;
