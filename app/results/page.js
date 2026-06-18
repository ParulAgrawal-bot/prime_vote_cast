'use client';

import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import ResultsAnimations from '../../js/ResultsAnimation';
import styles from '../../styles/result.module.css';

export default function ResultsPage() {
  const [lastUpdated, setLastUpdated] = useState('Today, 4:42 PM');
  const [voteResults, setVoteResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(null);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results');
      if (response.ok) {
        const data = await response.json();
        setVoteResults(data);
      }
    } catch (error) {
      console.error('Failed to fetch results:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fix scrolling issues
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    // Fetch results on mount
    fetchResults();

    const updateTime = () => {
      const now = new Date();
      setLastUpdated(`Today, ${now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`);
    };
    updateTime();
    
    // Refresh every 60 seconds
    const interval = setInterval(() => {
      fetchResults();
      updateTime();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>PrimeVote Cast Result</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </Head>
      
      <div className={styles.bg}></div>
      <div className={styles['bg-dots']}></div>

      {/* Page - SCROLLABLE CONTAINER */}
      <div className={styles.page} ref={pageRef}>
        {/* Header */}
        <div className={styles['page-header']}>
          <div className={styles['header-left']}>
            <div className={styles.eyebrow}>
              <span className={styles['live-dot']}></span>
              Live Results · Updated Every 60s
            </div>
            <h1 className={styles['page-title']}>
              Election <em>Results</em>
            </h1>
            <p className={styles['page-subtitle']}>
              Real-time vote tallies for all active and recently closed elections. 
              Results reflect ballots counted as of the last update.
            </p>
          </div>
          <div className={styles['header-right']}>
            <span className={styles['last-updated']}>
              <svg viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              Last updated: {lastUpdated}
            </span>
          </div>
        </div>

        {/* Stats Strip */}
        <StatsStrip voteResults={voteResults} />

        {/* Featured Race */}
        <div
          className={`${styles['section-label']}`}
          style={{ animation: 'fadeUp 0.6s 0.1s both' }}
          data-results-animate
        >
          Featured Race
        </div>
        <FeaturedRace voteResults={voteResults} loading={loading} />

        {/* All Races */}
        <div
          className={`${styles['section-label']}`}
          style={{ animation: 'fadeUp 0.6s 0.18s both', marginTop: '40px' }}
          data-results-animate
        >
          All Races
        </div>
        <RacesGrid />

        {/* Voter Turnout */}
        <TurnoutSection />
      </div>

      {/* Status Bar */}
      <div className={styles.statusbar}>
        <div className={styles['statusbar-dot']}></div>
        <span className={styles['statusbar-text']}>
          System Online · Results Live · Next update in 58s · 84% precincts reporting
        </span>
      </div>

      <ResultsAnimations />
    </>
  );
}

// COMPLETE Stats Strip Component
function StatsStrip({ voteResults }) {
  const totalVotes = voteResults?.total || 0;
  const turnoutPercent = ((totalVotes / 208124) * 100).toFixed(1);
  
  return (
    <div className={styles['stats-strip']}>
      <div className={styles['stat-card']} data-results-animate>
        <div className={styles['stat-icon']}>
          <svg viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
        </div>
        <div className={styles['stat-val']}>{totalVotes.toLocaleString()}</div>
        <div className={styles['stat-lbl']}>Total Votes Cast</div>
        <div className={styles['stat-sub']}>Real-time count</div>
      </div>
      <div className={styles['stat-card']} data-results-animate>
        <div className={styles['stat-icon']}>
          <svg viewBox="0 0 24 24">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div className={styles['stat-val']}>{turnoutPercent}%</div>
        <div className={styles['stat-lbl']}>Voter Turnout</div>
        <div className={styles['stat-sub']}>of 208,124 registered</div>
      </div>
      <div className={styles['stat-card']} data-results-animate>
        <div className={styles['stat-icon']}>
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M9 21V9"/>
          </svg>
        </div>
        <div className={styles['stat-val']}>3</div>
        <div className={styles['stat-lbl']}>Active Candidates</div>
        <div className={styles['stat-sub']}>All options live</div>
      </div>
      <div className={styles['stat-card']} data-results-animate>
        <div className={styles['stat-icon']}>
          <svg viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div className={styles['stat-val']}>100%</div>
        <div className={styles['stat-lbl']}>Results Live</div>
        <div className={styles['stat-sub']}>All votes counted</div>
      </div>
    </div>
  );
}

// COMPLETE Featured Race Component
function FeaturedRace({ voteResults, loading }) {
  const totalVotes = voteResults?.total || 0;
  
  return (
    <div className={styles['featured-race']} data-results-animate>
      <div className={styles['featured-top']}>
        <div className={styles['race-meta']}>
          <div className={styles['race-type']}>City-Wide · Voting General Election · 2026</div>
          <h2 className={styles['race-title']}>Election Results</h2>
          <p className={styles['race-desc']}>Real-time vote tallies showing current election results.</p>
        </div>
        <div className={styles['race-status']}>
          <span className={`${styles['status-pill']} ${styles['pill-live']}`}>
            <span className={styles.dot}></span>Counting Live
          </span>
          <span className={styles['pct-counted']}>{loading ? 'Loading...' : 'Live'}</span>
        </div>
      </div>

      <div className={styles['race-visual']}>
        <DonutChart voteResults={voteResults} />
        <CandidateList voteResults={voteResults} />
      </div>

      <div className={styles['race-footer']}>
        <div className={styles['race-footer-stats']}>
          <div className={styles['rf-stat']}>
            <div className={styles['rf-val']}>{totalVotes.toLocaleString()}</div>
            <div className={styles['rf-lbl']}>Votes Cast</div>
          </div>
          <div className={styles['rf-stat']}>
            <div className={styles['rf-val']}>100%</div>
            <div className={styles['rf-lbl']}>Results</div>
          </div>
          <div className={styles['rf-stat']}>
            <div className={styles['rf-val']}>3</div>
            <div className={styles['rf-lbl']}>Options</div>
          </div>
          <div className={styles['rf-stat']}>
            <div className={styles['rf-val']}>{voteResults?.options?.[0]?.percentage || 0}%</div>
            <div className={styles['rf-lbl']}>Leader</div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

// COMPLETE Donut Chart Component
function DonutChart({ voteResults }) {
  if (!voteResults || !voteResults.options) {
    return (
      <div className={styles['donut-wrap']}>
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading results...</div>
      </div>
    );
  }

  const options = voteResults.options;
  const leader = options.length > 0 ? options[0] : null;
  
  // Calculate SVG arc values (percentages of 502.65 circumference)
  const circumference = 502.65;
  const strokeDasharray1 = (options[0]?.percentage / 100) * circumference;
  const strokeDasharray2 = (options[1]?.percentage / 100) * circumference;
  const strokeDasharray3 = (options[2]?.percentage / 100) * circumference;
  
  const offset2 = strokeDasharray1;
  const offset3 = strokeDasharray1 + strokeDasharray2;
  
  return (
    <div className={styles['donut-wrap']}>
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#eaf4fd" strokeWidth="24"/>
        <circle 
          cx="100" cy="100" r="80" fill="none" stroke="#1748a0" strokeWidth="24"
          strokeDasharray={`${strokeDasharray1} ${circumference}`} strokeDashoffset="0" strokeLinecap="butt"
        />
        <circle 
          cx="100" cy="100" r="80" fill="none" stroke="#c0392b" strokeWidth="24"
          strokeDasharray={`${strokeDasharray2} ${circumference}`} strokeDashoffset={`-${offset2}`} strokeLinecap="butt"
        />
        <circle 
          cx="100" cy="100" r="80" fill="none" stroke="#4a8fd8" strokeWidth="24"
          strokeDasharray={`${strokeDasharray3} ${circumference}`} strokeDashoffset={`-${offset3}`} strokeLinecap="butt"
        />
        <circle cx="100" cy="100" r="66" fill="white"/>
      </svg>
      <div className={styles['donut-center']}>
        <div className={styles['donut-winner']}>{leader?.option || 'N/A'}<br/>{leader?.percentage || 0}%</div>
        <div className={styles['donut-sub']}>Leading</div>
      </div>
    </div>
  );
}


// COMPLETE Candidate List Component
function CandidateList({ voteResults }) {
  if (!voteResults || !voteResults.options) {
    return (
      <div className={styles['candidates-list']}>
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading candidates...</div>
      </div>
    );
  }

  const candidateNames = {
    'Option A': 'James Harlow',
    'Option B': 'Sandra Reeves',
    'Option C': 'Marcus Chen'
  };

  const avatarClasses = {
    'Option A': 'av-1',
    'Option B': 'av-2',
    'Option C': 'av-3'
  };

  const avatarInitials = {
    'Option A': 'JH',
    'Option B': 'SR',
    'Option C': 'MC'
  };

  const fillClasses = {
    'Option A': 'fill-1',
    'Option B': 'fill-2',
    'Option C': 'fill-3'
  };

  return (
    <div className={styles['candidates-list']}>
      {voteResults.options.map((option, index) => (
        <div className={styles['candidate-row']} key={option.option}>
          <div className={`${styles['c-avatar']} ${styles[avatarClasses[option.option]]}`}>
            {avatarInitials[option.option]}
          </div>
          <div className={styles['c-info']}>
            <div className={styles['c-name']}>
              {candidateNames[option.option]} 
              {index === 0 && <span className={styles['leading-badge']}>Leading</span>}
            </div>
            <div className={styles['c-party']}>Candidate · {option.count.toLocaleString()} votes</div>
            <div className={styles['bar-track']}>
              <div 
                className={`${styles['bar-fill']} ${styles[fillClasses[option.option]]}`} 
                style={{width: '0%'}} 
                data-w={`${option.percentage}%`}
              ></div>
            </div>
          </div>
          <div>
            <div className={styles['c-pct']}>{option.percentage}%</div>
            <div className={styles['c-votes']}>{option.count.toLocaleString()}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// COMPLETE Races Grid Component
function RacesGrid() {
  return (
    <div className={styles['races-grid']}>
      {/* District 4 Council */}
      <div className={`${styles['race-card']} ${styles['rc-live']}`} data-results-animate>
        <div className={styles['rc-header']}>
          <div>
            <div className={styles['race-type']} style={{fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '5px'}}>
              District 4
            </div>
            <div className={styles['rc-title']}>City Council — 2 Seats</div>
          </div>
          <span className={`${styles['rc-badge']} ${styles['badge-live']}`}>Live</span>
        </div>
        <MiniBars data={[
          {name: 'T. Washington', pct: '34%', color: 'fill-1'},
          {name: 'P. Nguyen', pct: '29%', color: 'fill-1'},
          {name: 'R. Okafor', pct: '22%', color: 'fill-2'},
          {name: 'L. Torres', pct: '15%', color: 'fill-3'}
        ]} />
        <div className={styles['rc-footer']}>
          <span className={styles['rc-votes']}>18,432 votes</span>
          <span className={styles['rc-pct-in']}>76% in</span>
        </div>
      </div>

      {/* School Board */}
      <div className={`${styles['race-card']} ${styles['rc-live']}`} data-results-animate>
        <div className={styles['rc-header']}>
          <div>
            <div className={styles['race-type']} style={{fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--sky)', marginBottom: '5px'}}>
              City-Wide
            </div>
            <div className={styles['rc-title']}>School Board — 3 Seats</div>
          </div>
          <span className={`${styles['rc-badge']} ${styles['badge-live']}`}>Live</span>
        </div>
        <MiniBars data={[
          {name: 'M. Patel', pct: '28%', color: 'fill-1'},
          {name: 'C. Robinson', pct: '25%', color: 'fill-1'},
          {name: 'A. Kowalski', pct: '24%', color: 'fill-3'},
          {name: 'D. Fernandez', pct: '23%', color: 'fill-2'}
        ]} />
        <div className={styles['rc-footer']}>
          <span className={styles['rc-votes']}>31,890 votes</span>
          <span className={styles['rc-pct-in']}>91% in</span>
        </div>
      </div>

      {/* Measure K */}
      <div className={`${styles['race-card']} ${styles['rc-done']}`} data-results-animate>
        <div className={styles['rc-header']}>
          <div>
            <div className={styles['race-type']} style={{fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '5px'}}>
              Ballot Measure
            </div>
            <div className={styles['rc-title']}>Measure K — Transit Tax</div>
          </div>
          <span className={`${styles['rc-badge']} ${styles['badge-done']}`}>Final</span>
        </div>
        <MiniBars data={[
          {name: 'Yes — Pass', pct: '61%', color: 'yes'},
          {name: 'No — Reject', pct: '39%', color: 'no'}
        ]} />
        <div className={styles['rc-footer']}>
          <span className={styles['rc-votes']}>89,204 votes · <b style={{color: '#1a7a4a'}}>Passed ✓</b></span>
          <span className={styles['rc-pct-in']}>100% in</span>
        </div>
      </div>

      {/* District 7 Special */}
      <div className={`${styles['race-card']} ${styles['rc-close']}`} data-results-animate>
        <div className={styles['rc-header']}>
          <div>
            <div className={styles['race-type']} style={{fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '5px'}}>
              District 7 · Special
            </div>
            <div className={styles['rc-title']}>Council Vacancy Seat</div>
          </div>
          <span className={`${styles['rc-badge']} ${styles['badge-close']}`}>Close Race</span>
        </div>
        <MiniBars data={[
          {name: 'B. Sanchez', pct: '51%', color: 'fill-1'},
          {name: 'H. Kim', pct: '47%', color: 'fill-2'},
          {name: 'G. Adeyemi', pct: '2%', color: 'fill-3'}
        ]} />
        <div className={styles['rc-footer']}>
          <span className={styles['rc-votes']}>9,214 votes</span>
          <span className={styles['rc-pct-in']} style={{color: 'var(--gold)'}}>55% in — Too close</span>
        </div>
      </div>

      {/* Measure J */}
      <div className={`${styles['race-card']} ${styles['rc-close']}`} data-results-animate>
        <div className={styles['rc-header']}>
          <div>
            <div className={styles['race-type']} style={{fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '5px'}}>
              Ballot Measure
            </div>
            <div className={styles['rc-title']}>Measure J — Housing Rezone</div>
          </div>
          <span className={`${styles['rc-badge']} ${styles['badge-close']}`}>Early</span>
        </div>
        <MiniBars data={[
          {name: 'Yes — Pass', pct: '54%', color: 'yes'},
          {name: 'No — Reject', pct: '46%', color: 'no'}
        ]} />
        <div className={styles['rc-footer']}>
          <span className={styles['rc-votes']}>11,060 votes</span>
          <span className={styles['rc-pct-in']} style={{color: 'var(--gold)'}}>22% in — Early</span>
        </div>
      </div>

      {/* D2 Council */}
      <div className={`${styles['race-card']} ${styles['rc-done']}`} data-results-animate>
        <div className={styles['rc-header']}>
          <div>
            <div className={styles['race-type']} style={{fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '5px'}}>
              District 2 · 2025
            </div>
            <div className={styles['rc-title']}>City Council Seat</div>
          </div>
          <span className={`${styles['rc-badge']} ${styles['badge-done']}`}>Final</span>
        </div>
        <MiniBars data={[
          {name: 'E. Vasquez ✓', pct: '54%', color: 'winner'},
          {name: 'F. Bradley', pct: '46%', color: 'fill-2'}
        ]} />
        <div className={styles['rc-footer']}>
          <span className={styles['rc-votes']}>72,910 votes · <b style={{color: '#1a7a4a'}}>Elected ✓</b></span>
          <span className={styles['rc-pct-in']}>100% in</span>
        </div>
      </div>
    </div>
  );
}

// COMPLETE MiniBars Component
function miniBarBackground(color) {
  if (color === 'yes' || color === 'winner') {
    return 'linear-gradient(90deg, #0d2147, #2563c8)';
  }
  if (color === 'no') {
    return 'linear-gradient(90deg, #8b1a1a, #c0392b)';
  }
  return undefined;
}

function MiniBars({ data }) {
  return (
    <div className={styles['mini-bars']}>
      {data.map((candidate, index) => (
        <div key={index} className={styles['mini-row']}>
          <div className={styles['mini-name']}>{candidate.name}</div>
          <div className={styles['mini-track']}>
            <div
              className={`${styles['mini-fill']} ${styles[candidate.color] || ''}`}
              style={{
                width: '0%',
                background: miniBarBackground(candidate.color),
              }}
              data-w={candidate.pct}
            />
          </div>
          <div
            className={styles['mini-pct']}
            style={{
              color: candidate.color === 'yes' ? 'var(--navy)' : undefined,
            }}
          >
            {candidate.pct}
          </div>
        </div>
      ))}
    </div>
  );
}

// COMPLETE Turnout Section
function TurnoutSection() {
  const districts = [
    {name: 'District 1', pct: '72%', votes: '18,440 / 25,600'},
    {name: 'District 2', pct: '65%', votes: '21,100 / 32,460'},
    {name: 'District 3', pct: '71%', votes: '17,220 / 24,240'},
    {name: 'District 4', pct: '60%', votes: '19,800 / 33,000'},
    {name: 'District 5', pct: '74%', votes: '22,830 / 30,850'},
    {name: 'District 6', pct: '68%', votes: '15,800 / 23,240'},
    {name: 'District 7', pct: '58%', votes: '14,200 / 24,480'},
    {name: 'At-Large', pct: '76%', votes: '13,000 / 17,100'}
  ];

  return (
    <div className={styles['turnout-section']} data-results-animate>
      <div className={styles['section-label']} data-results-animate>
        Voter Turnout
      </div>
      <div className={styles['turnout-card']}>
        <div className={styles['turnout-header']}>
          <div>
            <div className={styles['turnout-title']}>Citywide Turnout Overview</div>
            <div className={styles['turnout-sub']}>208,124 registered voters · 142,390 cast ballots so far</div>
          </div>
        </div>

        <div className={styles['big-bar-wrap']}>
          <div className={styles['big-bar-labels']}>
            <span className={styles['big-bar-label']}>0%</span>
            <span className={styles['big-bar-label']} style={{color: 'var(--mid)', fontWeight: '600'}}>
              68.4% voted
            </span>
            <span className={styles['big-bar-label']}>100%</span>
          </div>
          <div className={styles['big-bar']}>
            <div className={`${styles['big-bar-seg']} ${styles['seg-voted']}`} style={{width: '0%'}} data-w="60%"></div>
            <div className={`${styles['big-bar-seg']} ${styles['seg-partial']}`} style={{width: '0%'}} data-w="8.4%"></div>
          </div>
          <div className={styles['big-bar-legend']}>
            <div className={styles['legend-item']}>
              <div className={styles['legend-dot']} style={{background: 'var(--navy)'}}></div>
              Confirmed votes
            </div>
            <div className={styles['legend-item']}>
              <div className={styles['legend-dot']} style={{background: 'var(--sky)'}}></div>
              Processing
            </div>
            <div className={styles['legend-item']}>
              <div className={styles['legend-dot']} style={{background: 'var(--ice)'}}></div>
              Not yet voted
            </div>
          </div>
        </div>

        <div className={styles['section-label']} style={{marginBottom: '14px'}}>By District</div>
        <div className={styles['district-grid']}>
          {districts.map((district, index) => (
            <div key={index} className={styles['district-item']}>
              <div className={styles['district-name']}>{district.name}</div>
              <div className={styles['district-bar']}>
                <div className={styles['district-fill']} style={{width: '0%'}} data-w={district.pct}></div>
              </div>
              <div className={styles['district-pct']}>{district.pct}</div>
              <div className={styles['district-sub']}>{district.votes}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


