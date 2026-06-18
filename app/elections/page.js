'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import ElectionsAnimations from '../../js/ElectionsAnimations';
import styles from '../../styles/elections.module.css';

// 1. Your Main Export now wraps the implementation in a Suspense Boundary
export default function ElectionsPage() {
  return (
    <Suspense fallback={<div className={styles.mainContainer}>Loading Elections Workspace...</div>}>
      <ElectionsPageContent />
    </Suspense>
  );
}

// 2. Change your original main function to an internal sub-component
function ElectionsPageContent() {
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
      removeEventListener;
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

// Keep the rest of your sub-components (FilterBar, FeaturedCard, CountdownBox, CandidatesRow, ElectionsGrid, ElectionCard) exactly the same below...
