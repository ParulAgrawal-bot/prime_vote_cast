'use client';

import { useEffect } from 'react';

export default function HelpAnimations() {
  useEffect(() => {
    // Animate step cards on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = `fadeUp 0.8s ${index * 0.2}s both`;
        }
      });
    });

    document.querySelectorAll('[data-help-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
