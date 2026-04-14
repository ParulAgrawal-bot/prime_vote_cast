'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ElectionsAnimations from '../../js/ElectionsAnimations';
import styles from '../../styles/elections.module.css';

export default function ElectionsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const [region, setRegion] = useState('All Regions');
  const [regions, setRegions] = useState(['All Regions']);
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 12,
    hours: 8,
    minutes: 34
  });
  const pageRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        let { days, hours, minutes } = prev;
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        return { days, hours, minutes };
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const setFilter = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  // Scroll fix
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
  }, []);

  useEffect(() => {
    const fromUrl = searchParams?.get('region');
    if (fromUrl) setRegion(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('region', region);
        params.set('q', searchTerm);
        params.set('filter', activeFilter);
        const res = await fetch(`/api/elections?${params.toString()}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok) {
          setElections(Array.isArray(data.elections) ? data.elections : []);
          setRegions(Array.isArray(data.regions) ? data.regions : ['All Regions']);
        } else {
          setElections([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [region, searchTerm, activeFilter]);

  const filteredElections = elections;

  return (
    <>
      <Head>
        <title>PrimeVote Cast - Elections</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className={styles.mainContainer}>
        <div className={styles['bg-layer']}></div>
        <div className={styles['bg-grid']}></div>

        <div className={styles['window-wrap']}>
          {/* Page - SCROLLABLE */}
          <div className={styles.page} ref={pageRef}>
            {/* Header */}
            <div className={styles['page-header']}>
              <div className={styles['page-header-top']}>
                <span className={styles['page-tag']}>2026 Season</span>
                <span className={styles['live-pill']}>
                  <span className={styles['live-dot']}></span>Live Now
                </span>
              </div>
              <h1 className={styles['page-title']}>
                Active <em>&amp;</em> Upcoming<br />Elections
              </h1>
              <p className={styles['page-subtitle']}>
                Review all city-wide, district, and ballot measure elections. 
                Cast your vote, track results, and stay informed on every race.
              </p>
            </div>

            {/* Filters */}
            <FilterBar 
              activeFilter={activeFilter}
              setFilter={setFilter}
              region={region}
              regions={regions}
              setRegion={setRegion}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            {/* Featured Election */}
            <div className={styles['section-label']} data-election-animate>
              Featured Election
            </div>
            <FeaturedCard countdown={countdown} />

            {/* All Elections */}
            <div
              className={styles['section-label']}
              style={{ marginTop: '40px' }}
              data-election-animate
            >
              {region === 'All Regions'
                ? `All Elections (${filteredElections.length})`
                : `All Elections in ${region} (${filteredElections.length})`}
              {isLoading ? ' · Loading…' : ''}
            </div>
            <ElectionsGrid elections={filteredElections} />

            {/* Load More */}
            <div className={styles['load-more-wrap']}>
              <button className={styles['load-more-btn']} type="button">
                Load More Elections
              </button>
            </div>
          </div>

          {/* Status bar */}
          <div className={styles.statusbar}>
            <div className={styles['statusbar-dot']}></div>
            <span className={styles['statusbar-text']}>
              System Online · 2 Active Elections · Polls Close Mar 14, 2026
            </span>
          </div>
        </div>

        <ElectionsAnimations />
      </div>
    </>
  );
}

// ✅ ALL COMPONENTS WITH SINGLE PARENT FIX
function FilterBar({ activeFilter, setFilter, region, regions, setRegion, searchTerm, setSearchTerm }) {
  const filters = ['All', 'Active', 'Upcoming', 'Closed', 'City-Wide', 'District', 'Ballot Measures'];

  return (
    <div className={styles['filter-bar']}>
      {filters.map(filter => (
        <button
          key={filter}
          className={`${styles['filter-btn']} ${activeFilter === filter ? styles.active : ''}`}
          onClick={() => setFilter(filter)}
          type="button"
        >
          {filter}
        </button>
      ))}
      <div className={styles['filter-sep']}></div>
      <div className={styles['region-wrap']}>
        <svg viewBox="0 0 24 24" strokeWidth="2">
          <path d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Region">
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div className={styles['search-wrap']}>
        <svg viewBox="0 0 24 24" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input 
          type="text" 
          placeholder="Search elections…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
}

function FeaturedCard({ countdown }) {
  return (
    <div className={styles['featured-card']} data-election-animate>
      <div className={styles['featured-top']}>
        <div className={styles['featured-meta']}>
          <div className={styles['election-type']}>City-Wide · Mayoral Race · 2026</div>
          <h2 className={styles['featured-title']}>
            Metropolis Mayor<br/>General Election
          </h2>
          <p className={styles['featured-desc']}>
            The race to lead Metropolis for the next four years. 
            Three candidates competing on housing, public safety, and infrastructure reform.
          </p>
        </div>
        <CountdownBox countdown={countdown} />
      </div>

      <CandidatesRow />

      <div className={styles['featured-footer']}>
        <div className={styles['featured-stats']}>
          <div className={styles['stat-item']}>
            <div className={styles['stat-val']}>142,390</div>
            <div className={styles['stat-lbl']}>Votes Cast</div>
          </div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-val']}>68.4%</div>
            <div className={styles['stat-lbl']}>Turnout</div>
          </div>
          <div className={styles['stat-item']}>
            <div className={styles['stat-val']}>208,124</div>
            <div className={styles['stat-lbl']}>Registered</div>
          </div>
        </div>
        <Link href="/vote_now" className={styles['vote-btn']}>
          <svg viewBox="0 0 24 24" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          Vote Now
        </Link>
      </div>
    </div>
  );
}

function CountdownBox({ countdown }) {
  return (
    <div className={styles['countdown-box']}>
      <div className={styles['countdown-label']}>Polls Close In</div>
      <div className={styles['countdown-digits']}>
        <div className={styles['digit-group']}>
          <span className={styles.digit}>{countdown.days.toString().padStart(2, '0')}</span>
          <span className={styles['digit-sub']}>Days</span>
        </div>
        <span className={styles['countdown-sep']}>:</span>
        <div className={styles['digit-group']}>
          <span className={styles.digit}>{countdown.hours.toString().padStart(2, '0')}</span>
          <span className={styles['digit-sub']}>Hours</span>
        </div>
        <span className={styles['countdown-sep']}>:</span>
        <div className={styles['digit-group']}>
          <span className={styles.digit}>{countdown.minutes.toString().padStart(2, '0')}</span>
          <span className={styles['digit-sub']}>Mins</span>
        </div>
      </div>
    </div>
  );
}

function CandidatesRow() {
  const candidates = [
    { name: 'James Harlow', party: 'Progressive Party', pct: '46%', avatar: 'av-blue' },
    { name: 'Sandra Reeves', party: 'Reform Alliance', pct: '38%', avatar: 'av-red' },
    { name: 'Marcus Chen', party: 'Green Metropolis', pct: '16%', avatar: 'av-green' }
  ];

  return (
    <div className={styles['candidates-row']}>
      {candidates.map((candidate, index) => (
        <div key={index} className={styles['candidate-card']}>
          <div className={`${styles['candidate-avatar']} ${styles[candidate.avatar]}`}>
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className={styles['candidate-info']}>
            <div className={styles['candidate-name']}>{candidate.name}</div>
            <div className={styles['candidate-party']}>{candidate.party}</div>
            <div className={styles['poll-bar']}>
              <div 
                className={`${styles['poll-fill']} ${styles[`fill-${candidate.avatar.split('-')[1]}`]}`}
                style={{width: '0%'}}
                data-w={candidate.pct}
              />
            </div>
          </div>
          <div className={styles['candidate-pct']}>{candidate.pct}</div>
        </div>
      ))}
    </div>
  );
}

const ALL_ELECTION_CARDS = [
  {
    key: 'd4',
    title: 'District 4 City Council',
    subtitle: 'Two seats open on the District 4 council. Zoning, transit, and housing on the agenda.',
    status: 'active',
    meta: ['Closes Mar 14', '4 Candidates'],
    iconClass: styles['icon-blue'],
  },
  {
    key: 'school',
    title: 'School Board Election',
    subtitle: 'City-wide race for three school board seats. Education funding and safety priorities.',
    status: 'active',
    meta: ['Closes Mar 20', '6 Candidates'],
    iconClass: styles['icon-blue'],
  },
  {
    key: 'j',
    title: 'Ballot Measure J — Housing',
    subtitle: 'Housing rezone and affordability package. Early returns; margin may shift.',
    status: 'upcoming',
    meta: ['Opens Apr 1', 'City-Wide'],
    iconClass: styles['icon-gold'],
  },
  {
    key: 'd7',
    title: 'District 7 Special Election',
    subtitle: 'Special election to fill a council vacancy. Compact field, high turnout expected.',
    status: 'upcoming',
    meta: ['Opens Mar 28', '3 Candidates'],
    iconClass: styles['icon-gold'],
  },
  {
    key: 'k',
    title: 'Ballot Measure K — Transit',
    subtitle: 'Transit tax measure — final results certified for the November cycle.',
    status: 'closed',
    meta: ['Closed', 'Final tally'],
    iconClass: styles['icon-muted'],
  },
  {
    key: 'd2',
    title: 'District 2 Council — 2025',
    subtitle: 'Prior cycle council seat — archived for reference and turnout comparison.',
    status: 'closed',
    meta: ['Closed 2025', 'Final'],
    iconClass: styles['icon-muted'],
  },
];

function ElectionsGrid({ elections }) {
  const byTitle = new Map(ALL_ELECTION_CARDS.map((c) => [c.title, c]));
  const electionCards = elections
    .map((e) => {
      const base = byTitle.get(e.title);
      if (!base) return null;
      return {
        ...base,
        status: e.status || base.status,
      };
    })
    .filter(Boolean);

  return (
    <div className={styles['elections-grid']}>
      {electionCards.map((card) => (
        <ElectionCard key={card.key} card={card} />
      ))}
    </div>
  );
}

function ElectionCard({ card }) {
  const badge =
    card.status === 'active'
      ? styles['badge-active']
      : card.status === 'upcoming'
        ? styles['badge-upcoming']
        : styles['badge-closed'];

  return (
    <div
      className={`${styles['election-card']} ${styles[`card-${card.status}`]}`}
      data-election-animate
    >
      <div className={styles['card-header']}>
        <div className={`${styles['card-icon']} ${card.iconClass}`}>
          <svg viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <span className={`${styles['status-badge']} ${badge}`}>{card.status}</span>
      </div>
      <div className={styles['card-title']}>{card.title}</div>
      <p className={styles['card-subtitle']}>{card.subtitle}</p>
      <div className={styles['card-meta']}>
        {card.meta.map((line) => (
          <div key={line} className={styles['meta-item']}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
