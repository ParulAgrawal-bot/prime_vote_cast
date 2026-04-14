'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import HelpAnimations from '../../js/helpAnimations';
import styles from '../../styles/help.module.css';

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [openFaqs, setOpenFaqs] = useState({});
  const scrollContainerRef = useRef(null);

  // 🔥 SCROLL FIX
  useEffect(() => {
    document.body.style.overflow = 'visible';
    document.documentElement.style.overflow = 'visible';
    document.body.style.height = 'auto';
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  const showTab = useCallback((tabId) => {
    setActiveTab(tabId);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleFaq = useCallback((faqId) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [faqId]: !prev[faqId],
    }));
  }, []);

  return (
    <>
      <Head>
        <title>Help – Metropolis City Elections</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </Head>

      <div className={styles.mainContainer}>
        <div className={styles['bg-pattern']}></div>

        {/* FIXED HEADER */}


        {/* 🔥 SCROLLABLE MAIN CONTENT */}
        <main 
          ref={scrollContainerRef}
          className={styles.scrollContainer}
          style={{
            minHeight: 'calc(100vh - 100px)',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Hero */}
          <section className={styles.hero}>
            <div className={styles['hero-eyebrow']}>
              <span className={styles['eyebrow-tag']}>Help Center</span>
            </div>
            <h1>
              We're here to<br />
              <em>help you vote.</em>
            </h1>
            <p className={styles['hero-sub']}>
              Everything you need to cast your ballot with confidence — step-by-step 
              guidance, security answers, and a direct line to our support team.
            </p>
          </section>

          {/* 🔥 TAB NAVIGATION COMPONENT */}
          <div className={styles['tab-nav']}>
            <button
              className={`${styles['tab-btn']} ${activeTab === 'getting-started' ? styles.active : ''}`}
              onClick={() => showTab('getting-started')}
            >
              <span className={styles['tab-icon']}>📋</span>
              Getting Started
            </button>
            <button
              className={`${styles['tab-btn']} ${activeTab === 'security-faq' ? styles.active : ''}`}
              onClick={() => showTab('security-faq')}
            >
              <span className={styles['tab-icon']}>🔒</span>
              Security FAQ
            </button>
            <button
              className={`${styles['tab-btn']} ${activeTab === 'contact-support' ? styles.active : ''}`}
              onClick={() => showTab('contact-support')}
            >
              <span className={styles['tab-icon']}>💬</span>
              Contact Support
            </button>
          </div>

          {/* 🔥 CONTENT PANELS */}
          <div className={styles['content-wrap']}>
            {/* Getting Started Panel */}
            <div className={`${styles.panel} ${activeTab === 'getting-started' ? styles.active : ''}`} id="getting-started">
              <p className={styles['steps-intro']}>
                Follow these three simple steps to cast your vote securely and verify it was counted. 
                The entire process takes under five minutes.
              </p>
              <div className={styles['steps-track']}>
                <div className={styles['step-card']} data-help-animate>
                  <div className={styles['step-num-wrap']}>
                    <div className={styles['step-circle']}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <rect x="3" y="11" width="18" height="11" rx="2"/>
                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    </div>
                  </div>
                  <div className={styles['step-body']}>
                    <div className={styles['step-label']}>Step 01</div>
                    <h2 className={styles['step-title']}>Log In Securely</h2>
                    <p className={styles['step-desc']}>
                      Sign in with your registered Voter ID and password. New voters must first complete 
                      registration at the Metropolis City clerk's office or online portal before logging in.
                    </p>
                    <ul className={styles['step-checklist']}>
                      <li>Have your Voter ID card or registration number ready</li>
                      <li>Use a private device and a secure Wi-Fi connection</li>
                      <li>Two-factor authentication (2FA) is required for all accounts</li>
                      <li>Sessions expire after 15 minutes of inactivity for your safety</li>
                    </ul>
                  </div>
                </div>
                {/* Add Step 2 & 3 similarly */}
              </div>
              <div className={styles['cta-box']}>
                <div className={styles['cta-text']}>
                  <h3>Ready to cast your vote?</h3>
                  <p>Active elections are open now. Your ballot takes less than 5 minutes.</p>
                </div>
                <Link href="/vote_now" className={styles['cta-btn']}>
                  Go to Vote Now →
                </Link>
              </div>
            </div>

            {/* Security FAQ Panel */}
            <div className={`${styles.panel} ${activeTab === 'security-faq' ? styles.active : ''}`} id="security-faq">
              <p className={styles['faq-intro']}>
                Your privacy and ballot integrity are our top priority. Here are answers to the most common security questions from Metropolis voters.
              </p>
              <div className={styles['faq-grid']}>
                <div
                  className={`${styles['faq-card']} ${openFaqs['1'] ? styles.open : ''}`}
                  onClick={() => toggleFaq('1')}
                  data-help-animate
                >
                  <div className={styles['faq-q-row']}>
                    <div className={styles['faq-q-icon']}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </div>
                    <span className={styles['faq-q-text']}>Can someone change my vote after I submit it?</span>
                    <svg className={styles['faq-chevron']} viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                  <div className={styles['faq-answer']}>
                    <p>No. Once you confirm your ballot, it is cryptographically sealed and written to an immutable audit log.</p>
                  </div>
                </div>
                {/* Add more FAQ cards */}
              </div>
            </div>

            {/* Contact Support Panel */}
            <div className={`${styles.panel} ${activeTab === 'contact-support' ? styles.active : ''}`} id="contact-support">
              <div className={styles['contact-grid']}>
                <div className={styles['form-card']}>
                  <h3>Report a Bug or Issue</h3>
                  <p className={styles['form-sub']}>Describe what happened and we'll investigate.</p>
                  <div className={styles['form-row']}>
                    <label>Your Name</label>
                    <input type="text" placeholder="Full name" />
                  </div>
                  {/* Add more form fields */}
                  <div className={styles['form-footer']}>
                    <button className={styles['submit-btn']} type="button">Send Report</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FIXED STATUS BAR */}
        <footer className={styles.statusbarWrapper}>
          <div className={styles.statusbar}>
            <div className={styles['statusbar-dot']}></div>
            <span className={styles['statusbar-text']}>
              System Online · Support Available · Response within 24 hrs
            </span>
          </div>
        </footer>

        <HelpAnimations />
      </div>
    </>
  );
}
