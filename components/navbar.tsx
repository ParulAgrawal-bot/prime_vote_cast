"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly exact?: boolean; // Safe optional boolean definition
}

// 2. Attach the NavItem array type definition directly here instead of using 'as const'
const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "🏠 Home", exact: true },
  { href: "/elections", label: "🗳️ Elections" },
  { href: "/vote_now", label: "✓ Vote" },
  { href: "/results", label: "📊 Results" },
  { href: "/help", label: "❓ Help" },
];

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.navbar-container')) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [menuOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .navbar-container {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          font-family: 'DM Sans', sans-serif;
          padding: 0 var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }

        .navbar-inner {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(30, 60, 114, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md) var(--spacing-lg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          box-shadow: var(--shadow-md);
          transition: var(--transition-fast);
        }

        .navbar-inner:hover {
          box-shadow: var(--shadow-lg);
          border-color: rgba(30, 60, 114, 0.15);
        }

        .logo {
          font-family: 'DM Sans', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--primary-dark);
          text-decoration: none;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          transition: var(--transition-fast);
        }

        .logo:hover {
          opacity: 0.8;
        }

        .logo-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-blue) 100%);
          box-shadow: 0 0 12px rgba(110, 231, 183, 0.4);
          animation: pulse 2s ease-in-out infinite;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-links a {
          color: var(--gray-600);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 8px 14px;
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
          white-space: nowrap;
        }

        .nav-links a:hover {
          color: var(--primary);
          background: rgba(30, 60, 114, 0.08);
        }

        .nav-links a.active {
          color: var(--primary);
          background: rgba(30, 60, 114, 0.12);
          font-weight: 600;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: auto;
        }

        .btn-signin {
          background: transparent;
          color: var(--primary);
          border: 1.5px solid var(--primary);
          padding: 8px 20px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-signin:hover {
          background: var(--primary);
          color: white;
          transform: translateY(-2px);
        }

        .btn-signup {
          background: linear-gradient(135deg, var(--accent-green) 0%, var(--accent-blue) 100%);
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: var(--transition-fast);
          box-shadow: 0 4px 12px rgba(110, 231, 183, 0.3);
        }

        .btn-signup:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(110, 231, 183, 0.4);
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
          color: var(--primary);
          font-size: 24px;
          transition: var(--transition-fast);
        }

        .mobile-toggle:hover {
          opacity: 0.7;
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 78px;
          left: var(--spacing-md);
          right: var(--spacing-md);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(30, 60, 114, 0.15);
          border-radius: var(--radius-lg);
          padding: var(--spacing-md);
          z-index: 99;
          flex-direction: column;
          gap: 6px;
          box-shadow: var(--shadow-xl);
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }

        .mobile-menu.open {
          display: flex;
        }

        .mobile-menu a,
        .mobile-menu button {
          color: var(--gray-600);
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
          border: none;
          background: none;
          cursor: pointer;
          text-align: left;
        }

        .mobile-menu a:hover,
        .mobile-menu button:hover {
          color: var(--primary);
          background: rgba(30, 60, 114, 0.08);
        }

        .mobile-menu a.active {
          color: var(--primary);
          background: rgba(30, 60, 114, 0.12);
          font-weight: 600;
        }

        .mobile-divider {
          height: 1px;
          background: rgba(30, 60, 114, 0.1);
          margin: 8px 0;
        }

        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 8px;
        }

        .mobile-actions .btn-signin,
        .mobile-actions .btn-signup {
          width: 100%;
          text-align: center;
          padding: 12px 16px;
          font-size: 14px;
        }

        @media (max-width: 1024px) {
          .navbar-inner {
            padding: var(--spacing-md) var(--spacing-md);
          }
          .nav-links a {
            padding: 8px 12px;
            font-size: 13px;
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .nav-actions {
            display: none;
          }
          .mobile-toggle {
            display: flex;
          }
          .navbar-inner {
            height: 56px;
          }
          .navbar-container {
            padding: 0 var(--spacing-sm);
            margin-bottom: var(--spacing-sm);
          }
          .mobile-menu {
            left: var(--spacing-sm);
            right: var(--spacing-sm);
            top: 70px;
          }
        }

        @media (max-width: 480px) {
          .navbar-inner {
            padding: var(--spacing-sm) var(--spacing-md);
            height: 52px;
          }
          .logo {
            font-size: 16px;
          }
          .logo-dot {
            width: 8px;
            height: 8px;
          }
          .navbar-container {
            padding: 0 var(--spacing-sm);
            margin-bottom: var(--spacing-sm);
          }
          .mobile-menu {
            left: 8px;
            right: 8px;
            top: 68px;
            padding: 12px;
            gap: 4px;
          }
          .mobile-menu a,
          .mobile-menu button {
            padding: 10px 12px;
            font-size: 14px;
          }
        }
      `}</style>

      <nav className="navbar-container">
        <div className="navbar-inner">
          <Link href="/" className="logo">
            <span className="logo-dot"></span>
            <span>PrimeVote</span>
          </Link>

      <ul className="nav-links">
  {NAV_ITEMS.map((item) => {
    // 2. Safely cast or extract 'exact' using 'in' validation to satisfy the compiler
    const exactMatch = "exact" in item ? item.exact : false;
    
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          className={isActive(item.href, exactMatch) ? "active" : ""}
        >
          {item.label}
        </Link>
      </li>
    );
  })}
</ul>

          <div className="nav-actions">
            {!isSignedIn ? (
              <>
                <SignInButton>
                  <button className="btn-signin">Sign In</button>
                </SignInButton>
                <SignUpButton>
                  <button className="btn-signup">Sign Up</button>
                </SignUpButton>
              </>
            ) : (
              <div className="user-button-wrapper">
                <UserButton />
              </div>
            )}
          </div>

          <button
            className="mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href, item.exact) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}

          <div className="mobile-divider"></div>

          <div className="mobile-actions">
            {!isSignedIn ? (
              <>
                <SignInButton>
                  <button className="btn-signin">Sign In</button>
                </SignInButton>
                <SignUpButton>
                  <button className="btn-signup">Sign Up</button>
                </SignUpButton>
              </>
            ) : (
              <UserButton />
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
