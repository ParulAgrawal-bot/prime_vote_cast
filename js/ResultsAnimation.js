'use client';

import { useEffect } from 'react';

export default function ResultsAnimations() {
  useEffect(() => {
    // Animate all bars on load
    const animateBars = () => {
      document.querySelectorAll('[data-w]').forEach(el => {
        const targetWidth = el.dataset.w;
        el.style.transition = 'width 1.5s ease-out 0.3s';
        el.style.width = targetWidth;
      });
    };

    // Fade up animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = `fadeUp 0.6s ${index * 0.1}s both`;
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.1 });

    // Observe elements for animation
    setTimeout(() => {
      document.querySelectorAll('[data-results-animate]').forEach((el) => {
        observer.observe(el);
      });
      animateBars();
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
