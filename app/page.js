"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/Home.module.css";

const MODAL_COPY = {
  vote: {
    title: "Cast Your Vote",
    body: "Authenticate with your voter ID to proceed to the secure ballot. This step requires identity verification.",
  },
  track: {
    title: "Track Your Vote",
    body: "Enter your unique tracking code to verify your ballot was received and counted securely.",
  },
};

export default function Home() {
  const router = useRouter();
  const [modal, setModal] = useState(null);

  const openModal = useCallback((key) => {
    setModal(MODAL_COPY[key] || { title: "Coming soon", body: "This section is under development." });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const onOverlayPointerDown = useCallback(
    (e) => {
      if (e.target === e.currentTarget) closeModal();
    },
    [closeModal]
  );

  return (
    <div className={styles.container}>
      <main className="content">
        <div className="hero-card">
          <button
            type="button"
            className="action-btn"
            onClick={() => router.push("/vote_now")}
          >
            <div className="icon-wrap">
              <div className="badge">!</div>
              <svg viewBox="0 0 48 48">
                <rect x="8" y="22" width="32" height="20" rx="3" />
                <path d="M16 22v-2a2 2 0 012-2h12a2 2 0 012 2v2" />
                <line x1="24" y1="26" x2="24" y2="34" />
                <path d="M20 30l4-4 4 4" />
                <rect x="20" y="14" width="8" height="3" rx="1.5" />
              </svg>
            </div>
            <span className="action-label">Vote Now</span>
          </button>

          <button
            type="button"
            className="action-btn"
            onClick={() => router.push("/results")}
            style={{ position: "relative", zIndex: 10 }}
          >
            <div className="icon-wrap">
              <svg viewBox="0 0 48 48">
                <rect x="8" y="30" width="7" height="12" rx="2" />
                <rect x="20" y="22" width="7" height="20" rx="2" />
                <rect x="32" y="14" width="7" height="28" rx="2" />
                <polyline points="11,28 24,20 38,10" strokeLinecap="round" />
                <circle cx="38" cy="10" r="2.5" fill="var(--navy)" />
              </svg>
            </div>
            <span className="action-label">View Results</span>
          </button>

          <button type="button" className="action-btn" onClick={() => openModal("track")}>
            <div className="icon-wrap">
              <svg viewBox="0 0 48 48">
                <path d="M6 24s6-12 18-12 18 12 18 12-6 12-18 12S6 24 6 24z" />
                <circle cx="24" cy="24" r="5" />
              </svg>
            </div>
            <span className="action-label">Track Vote</span>
          </button>
        </div>
      </main>

      <div className="footer">
        <span>Secure.</span> &nbsp;Private. &nbsp;Transparent. &nbsp;— PrimeVote Cast
      </div>

      <div className="status-bar">
        <div className="status-dot" />
        <span className="status-text">System Online · Election Active · Polls Close Nov 5, 2026</span>
      </div>

      <div
        className={`modal-overlay${modal ? " open" : ""}`}
        onMouseDown={onOverlayPointerDown}
        role="presentation"
        aria-hidden={!modal}
      >
        {modal && (
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <h2 id="modal-title">{modal.title}</h2>
            <p>{modal.body}</p>
            <button type="button" className="modal-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
