'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/vote_now.module.css';
import styles1 from '../../styles/styles.module.css';

export default function VoteNow() {
  const router = useRouter();
  const [hasVoted, setHasVoted] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedElection, setSelectedElection] = useState(null);
  const [elections, setElections] = useState([]);
  const [loadingElections, setLoadingElections] = useState(true);
  const votingCardRef = useRef(null);

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

  // Fetch active elections on mount
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch('/api/elections?filter=active');
        if (response.ok) {
          const data = await response.json();
          setElections(data.elections || []);
        }
      } catch (error) {
        console.error('Failed to fetch elections:', error);
        showMessage('Failed to load elections', 'error');
      } finally {
        setLoadingElections(false);
      }
    };
    fetchElections();
  }, [showMessage]);

  // Scroll to voting section when verified
  useEffect(() => {
    if (isVerified && votingCardRef.current) {
      setTimeout(() => {
        votingCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Also scroll parent if needed
        window.scrollTo({
          top: window.scrollY + votingCardRef.current.getBoundingClientRect().top - 100,
          behavior: 'smooth'
        });
      }, 200);
    }
  }, [isVerified]);

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
    if (hasVoted) return showMessage('You have already voted in this election.', 'error');
    if (!selectedOption) return showMessage('Please select an option.', 'error');

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aadhaar: aadhaar.trim(),
          selection: selectedOption,
          electionTitle: selectedElection.title,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setHasVoted(true);
        showMessage(data.message || 'Your vote was saved successfully.', 'success', 3000);
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else if (response.status === 409) {
        // User already voted in this election
        setHasVoted(true);
        showMessage(
          data.error || 'You have already cast a vote in this election.',
          'error',
          8000
        );
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
                setSelectedElection(null);
                setIsVerified(false);
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

  // Show election selection first
  if (!selectedElection) {
    return (
      <div className={styles['vote-widget']}>
        <div className={styles.content}>
          <section className={styles1.verificationSection}>
            <h2>Select Election</h2>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
              Choose which election you would like to vote in.
            </p>
            {loadingElections ? (
              <p style={{ textAlign: 'center', color: '#999' }}>Loading elections...</p>
            ) : elections.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999' }}>No active elections available.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {elections.map((election) => (
                  <button
                    key={election.title}
                    type="button"
                    className={styles1.submitBtn}
                    onClick={() => setSelectedElection(election)}
                    style={{
                      backgroundColor: '#1e3c72',
                      color: 'white',
                      padding: 12,
                      borderRadius: 8,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#2a5298';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#1e3c72';
                      e.target.style.transform = 'none';
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 600 }}>{election.title}</div>
                      <div style={{ fontSize: 12, opacity: 0.9 }}>
                        {election.type} • {election.region}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
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
    <div className={styles['vote-widget']} ref={votingCardRef}>
      <div className={styles.content}>
        {/* Election Info Header */}
        <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #e0e0e0' }}>
          <small style={{ color: '#999', fontSize: 12 }}>Selected Election</small>
          <h3 style={{ margin: '4px 0 0 0', color: '#1e3c72', fontSize: 16 }}>
            {selectedElection.title}
          </h3>
          <button
            type="button"
            style={{
              marginTop: 8,
              padding: '4px 12px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
              color: '#666',
            }}
            onClick={() => {
              setSelectedElection(null);
              setIsVerified(false);
              setAadhaar('');
              setDob('');
              setSelectedOption('');
            }}
          >
            ← Change election
          </button>
        </div>

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
