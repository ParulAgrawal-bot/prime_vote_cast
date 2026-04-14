"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home", exact: true },
  { href: "/elections", label: "Elections" },
  { href: "/vote_now", label: "Vote Now" },
  { href: "/results", label: "Results" },
  { href: "/help", label: "Help" },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  const isActive = useCallback(
    (href: string, exact?: boolean) => {
      if (exact) return pathname === href;
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname]
  );

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700&display=swap');

        .navbar {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          font-family: 'DM Sans', sans-serif;
        }

        .navbar-inner {
          margin: 12px auto 20px;
          max-width: 1200px;
          width: calc(100% - 48px);
          background: rgba(10, 10, 14, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.04) inset;
        }

        .logo {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6ee7b7, #3b82f6);
          box-shadow: 0 0 10px rgba(110, 231, 183, 0.5);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-links a {
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 6px 12px;
          border-radius: 8px;
          transition: color 0.2s, background 0.2s;
        }

        .nav-links a:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.07);
        }

        .nav-links a.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.12);
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-signin {
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-signin:hover {
          color: #fff;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.06);
        }

        .btn-signup {
          background: linear-gradient(135deg, #6ee7b7 0%, #3b82f6 100%);
          color: #0a0a0e;
          border: none;
          padding: 8px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 12px rgba(110, 231, 183, 0.25);
        }

        .btn-signup:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(110, 231, 183, 0.4);
        }

        .user-button-wrapper {
          display: flex;
          align-items: center;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          color: rgba(255,255,255,0.7);
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 85px;
          left: 20px;
          right: 20px;
          background: rgba(10, 10, 14, 0.97);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          z-index: 49;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .mobile-menu.open {
          display: flex;
        }

        .mobile-menu a, .mobile-menu button {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          padding: 10px 14px;
          border-radius: 10px;
          transition: all 0.2s;
          border: none;
          background: none;
          cursor: pointer;
        }

        .mobile-menu a:hover, .mobile-menu button:hover {
          color: #fff;
          background: rgba(255,255,255,0.07);
        }

        .mobile-menu a.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }

        .mobile-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 4px 0;
        }

        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 4px;
        }

        .mobile-actions .btn-signin,
        .mobile-actions .btn-signup {
          width: 100%;
          text-align: center;
          padding: 11px 18px;
          font-size: 14px;
        }

        @media (max-width: 1024px) {
          .navbar-inner { width: calc(100% - 32px); }
          .nav-links a { padding: 6px 10px; font-size: 13px; }
        }

        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-actions { display: none; }
          .mobile-toggle { display: flex; }
        }

        @media (max-width: 480px) {
          .navbar-inner { width: calc(100% - 24px); margin: 10px auto 16px; padding: 0 14px; height: 56px; }
          .mobile-menu { left: 12px; right: 12px; top: 78px; }
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <Link href="/" className="logo">
            <span className="logo-dot" />
            PrimeCast Vote
          </Link>

          {/* Desktop nav links */}
          <ul className="nav-links">
            {NAV_ITEMS.map(({ href, label, exact }) => (
              <li key={href}>
                <Link href={href} className={isActive(href, !!exact) ? "active" : undefined}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop auth actions */}
          <div className="nav-actions">
            {isSignedIn ? (
              <div className="user-button-wrapper">
                <UserButton/>
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="btn-signin">Sign in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-signup">Get started</button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="8" x2="21" y2="8" />
                <line x1="3" y1="16" x2="21" y2="16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {NAV_ITEMS.map(({ href, label, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={isActive(href, !!exact) ? "active" : undefined}
            >
              {label}
            </Link>
          ))}

          <div className="mobile-divider" />

          <div className="mobile-actions">
            {isSignedIn ? (
              <div className="user-button-wrapper">
                <UserButton/>
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="btn-signin" onClick={() => setMenuOpen(false)}>Sign in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-signup" onClick={() => setMenuOpen(false)}>Get started</button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}