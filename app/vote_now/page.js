'use client';

import { useState, useCallback } from 'react';
import styles from '../../styles/vote_now.module.css';
import styles1 from '../../styles/styles.module.css';

export default function VoteNow() {
  const [hasVoted, setHasVoted] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [selectedOption, setSelectedOption] = useState('');

  const [isVerified, setIsVerified] = useState(false);
  const [aadhaar, setAadhaar] = useState('');
  const [dob, setDob] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  /** Server said this Aadhaar already voted — show only blocking message */
  const [alreadyVotedBlock, setAlreadyVotedBlock] = useState(false);

  const options = ['Option A', 'Option B', 'Option C'];

  const showMessage = useCallback((text, type = 'success', ms = 5000) => {
    setMessage(text);
    setMessageType(type);
    if (ms > 0) {
      setTimeout(() => setMessage(''), ms);
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setAlreadyVotedBlock(false);

    try {
      const response = await fetch('/api/vote/verify-aadhaar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhaar: aadhaar.trim(), dob: dob }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 409 && data?.hasVoted) {
        setIsVerified(false);
        setHasVoted(true);
        setAlreadyVotedBlock(true);
        showMessage(
          data.error || 'You have already cast your vote. You cannot vote again.',
          'error',
          8000
        );
        return;
      }

      if (response.ok) {
        setIsVerified(true);
        setHasVoted(false);
        showMessage(
          data.message || 'Identity verified. You can cast your vote below.',
          'success',
          6000
        );
        // Make the transition obvious: bring the ballot card into view.
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        return;
      }

      showMessage(
        data.error || `Verification failed (${response.status})`,
        'error'
      );
    } catch (err) {
      showMessage(err?.message || 'Connection to server failed', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      showMessage('Verify your identity first.', 'error');
      return;
    }
    if (hasVoted) return showMessage('You have already voted.', 'error');
    if (!selectedOption) return showMessage('Please select an option.', 'error');

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aadhaar: aadhaar.trim(),
          selection: selectedOption,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setHasVoted(true);
        showMessage(data.message || 'Your vote was saved successfully.', 'success', 6000);
      } else {
        showMessage(data.error || `Voting failed (${response.status})`, 'error');
      }
    } catch (err) {
      showMessage(err?.message || 'Network error during voting', 'error');
    }
  };

  if (alreadyVotedBlock) {
    return (
      <div className={styles['vote-widget']}>
        <div className={styles.content}>
          <section className={styles1.verificationSection}>
            <h2>Already voted</h2>
            <p style={{ color: '#555', marginBottom: 16, lineHeight: 1.5 }}>
              This identity has already been used to cast a vote. Each person may
              vote only once.
            </p>
            <button
              type="button"
              className={styles1.submitBtn}
              onClick={() => {
                setAlreadyVotedBlock(false);
                setAadhaar('');
                setDob('');
                setMessage('');
              }}
            >
              Try a different voter
            </button>
          </section>
          {message && (
            <div className={`${styles.message} ${styles[messageType]}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles['vote-widget']}>
      <div className={styles.content}>
        {!isVerified ? (
          <section className={styles1.verificationSection}>
            <h2>Voter verification</h2>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
              Enter your details. If you have not voted yet, you will proceed to
              the ballot.
            </p>
            <form onSubmit={handleVerify} className={styles.verifyForm}>
              <div className={styles1.inputGroup}>
                <label>Aadhaar number</label>
                <input
                  type="text"
                  maxLength="12"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  required
                />
              </div>
              <div className={styles1.inputGroup}>
                <label>Date of birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className={styles1.submitBtn}
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying…' : 'Verify identity'}
              </button>
            </form>
          </section>
        ) : (
          <section className={styles.votingSection}>
            <h2>Cast your vote</h2>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
              Choose one option. Your choice is saved on the server.
            </p>
            <form onSubmit={handleSubmit} className={styles.voteForm}>
              <fieldset className={styles.fieldset}>
                {options.map((opt, index) => (
                  <div
                    key={opt}
                    className={`${styles.option} ${selectedOption === opt ? styles.voted : ''}`}
                  >
                    <input
                      type="radio"
                      id={`opt${index}`}
                      name="vote"
                      value={opt}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      checked={selectedOption === opt}
                      disabled={hasVoted}
                    />
                    <label htmlFor={`opt${index}`}>{opt}</label>
                  </div>
                ))}
              </fieldset>
              <button
                type="submit"
                className={styles['vote-submit-btn']}
                disabled={hasVoted}
              >
                {hasVoted ? 'Thank you for voting ✓' : 'Confirm vote'}
              </button>
            </form>
          </section>
        )}

        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
