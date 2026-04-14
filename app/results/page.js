'use client';

import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import ResultsAnimations from '../../js/ResultsAnimation';
import styles from '../../styles/result.module.css';

export default function ResultsPage() {
  const [lastUpdated, setLastUpdated] = useState('Today, 4:42 PM');
  const pageRef = useRef(null);

  useEffect(() => {
    // Fix scrolling issues
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    const updateTime = () => {
      const now = new Date();
      setLastUpdated(`Today, ${now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
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
            <button className={styles['export-btn']} type="button">
              <svg viewBox="0 0 24 24" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export Results
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <StatsStrip />

        {/* Featured Race */}
        <div
          className={`${styles['section-label']}`}
          style={{ animation: 'fadeUp 0.6s 0.1s both' }}
          data-results-animate
        >
          Featured Race
        </div>
        <FeaturedRace />

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
function StatsStrip() {
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
        <div className={styles['stat-val']}>142,390</div>
        <div className={styles['stat-lbl']}>Total Votes Cast</div>
        <div className={styles['stat-sub']}>↑ 12,840 since yesterday</div>
      </div>
      <div className={styles['stat-card']} data-results-animate>
        <div className={styles['stat-icon']}>
          <svg viewBox="0 0 24 24">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div className={styles['stat-val']}>68.4%</div>
        <div className={styles['stat-lbl']}>Voter Turnout</div>
        <div className={styles['stat-sub']}>↑ 4.2% vs. 2022</div>
      </div>
      <div className={styles['stat-card']} data-results-animate>
        <div className={styles['stat-icon']}>
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M9 21V9"/>
          </svg>
        </div>
        <div className={styles['stat-val']}>5</div>
        <div className={styles['stat-lbl']}>Active Races</div>
        <div className={styles['stat-sub']}>2 calling imminent</div>
      </div>
      <div className={styles['stat-card']} data-results-animate>
        <div className={styles['stat-icon']}>
          <svg viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div className={styles['stat-val']}>84%</div>
        <div className={styles['stat-lbl']}>Precincts Reporting</div>
        <div className={styles['stat-sub']}>269 of 320 precincts</div>
      </div>
    </div>
  );
}

// COMPLETE Featured Race Component
function FeaturedRace() {
  return (
    <div className={styles['featured-race']} data-results-animate>
      <div className={styles['featured-top']}>
        <div className={styles['race-meta']}>
          <div className={styles['race-type']}>City-Wide · Mayoral General Election · 2026</div>
          <h2 className={styles['race-title']}>Metropolis Mayor</h2>
          <p className={styles['race-desc']}>Three candidates competing for a four-year term leading Metropolis. 84% of precincts reporting.</p>
        </div>
        <div className={styles['race-status']}>
          <span className={`${styles['status-pill']} ${styles['pill-live']}`}>
            <span className={styles.dot}></span>Counting Live
          </span>
          <span className={styles['pct-counted']}>84% precincts in</span>
        </div>
      </div>

      <div className={styles['race-visual']}>
        <DonutChart />
        <CandidateList />
      </div>

      <div className={styles['race-footer']}>
        <div className={styles['race-footer-stats']}>
          <div className={styles['rf-stat']}>
            <div className={styles['rf-val']}>142,390</div>
            <div className={styles['rf-lbl']}>Votes Cast</div>
          </div>
          <div className={styles['rf-stat']}>
            <div className={styles['rf-val']}>68.4%</div>
            <div className={styles['rf-lbl']}>Turnout</div>
          </div>
          <div className={styles['rf-stat']}>
            <div className={styles['rf-val']}>208,124</div>
            <div className={styles['rf-lbl']}>Registered</div>
          </div>
          <div className={styles['rf-stat']}>
            <div className={styles['rf-val']}>+8%</div>
            <div className={styles['rf-lbl']}>Harlow margin</div>
          </div>
        </div>
        <button className={styles['detail-btn']} type="button">
          Full Breakdown
          <svg viewBox="0 0 24 24" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// COMPLETE Donut Chart Component
function DonutChart() {
  return (
    <div className={styles['donut-wrap']}>
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#eaf4fd" strokeWidth="24"/>
        <circle 
          cx="100" cy="100" r="80" fill="none" stroke="#1748a0" strokeWidth="24"
          strokeDasharray="230.4 502.65" strokeDashoffset="0" strokeLinecap="butt"
        />
        <circle 
          cx="100" cy="100" r="80" fill="none" stroke="#c0392b" strokeWidth="24"
          strokeDasharray="190.4 502.65" strokeDashoffset="-230.4" strokeLinecap="butt"
        />
        <circle 
          cx="100" cy="100" r="80" fill="none" stroke="#4a8fd8" strokeWidth="24"
          strokeDasharray="80.4 502.65" strokeDashoffset="-420.8" strokeLinecap="butt"
        />
        <circle cx="100" cy="100" r="66" fill="white"/>
      </svg>
      <div className={styles['donut-center']}>
        <div className={styles['donut-winner']}>James<br/>Harlow</div>
        <div className={styles['donut-sub']}>Leading</div>
      </div>
    </div>
  );
}

// COMPLETE Candidate List Component
function CandidateList() {
  return (
    <div className={styles['candidates-list']}>
      <div className={styles['candidate-row']}>
        <div className={`${styles['c-avatar']} ${styles['av-1']}`}>JH</div>
        <div className={styles['c-info']}>
          <div className={styles['c-name']}>
            James Harlow <span className={styles['leading-badge']}>Leading</span>
          </div>
          <div className={styles['c-party']}>Progressive Party · 65,499 votes</div>
          <div className={styles['bar-track']}>
            <div className={`${styles['bar-fill']} ${styles['fill-1']}`} style={{width: '0%'}} data-w="46%"></div>
          </div>
        </div>
        <div>
          <div className={styles['c-pct']}>46%</div>
          <div className={styles['c-votes']}>65,499</div>
        </div>
      </div>
      <div className={styles['candidate-row']}>
        <div className={`${styles['c-avatar']} ${styles['av-2']}`}>SR</div>
        <div className={styles['c-info']}>
          <div className={styles['c-name']}>Sandra Reeves</div>
          <div className={styles['c-party']}>Reform Alliance · 54,108 votes</div>
          <div className={styles['bar-track']}>
            <div className={`${styles['bar-fill']} ${styles['fill-2']}`} style={{width: '0%'}} data-w="38%"></div>
          </div>
        </div>
        <div>
          <div className={styles['c-pct']}>38%</div>
          <div className={styles['c-votes']}>54,108</div>
        </div>
      </div>
      <div className={styles['candidate-row']}>
        <div className={`${styles['c-avatar']} ${styles['av-3']}`}>MC</div>
        <div className={styles['c-info']}>
          <div className={styles['c-name']}>Marcus Chen</div>
          <div className={styles['c-party']}>Green Metropolis · 22,783 votes</div>
          <div className={styles['bar-track']}>
            <div className={`${styles['bar-fill']} ${styles['fill-3']}`} style={{width: '0%'}} data-w="16%"></div>
          </div>
        </div>
        <div>
          <div className={styles['c-pct']}>16%</div>
          <div className={styles['c-votes']}>22,783</div>
        </div>
      </div>
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
