'use client';

import { useEffect } from 'react';

export default function ResultsAnimations() {
  useEffect(() => {
    // Animate all bars on load and when data updates
    const animateBars = () => {
      document.querySelectorAll('[data-w]').forEach(el => {
        const targetWidth = el.dataset.w;
        // Reset animation
        el.style.transition = 'none';
        el.style.width = '0%';
        // Trigger animation
        setTimeout(() => {
          el.style.transition = 'width 1.5s ease-out 0.3s';
          el.style.width = targetWidth;
        }, 10);
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
    const setupAnimations = () => {
      document.querySelectorAll('[data-results-animate]').forEach((el) => {
        observer.observe(el);
      });
      animateBars();
    };

    // Run with a slight delay to ensure DOM is ready
    setTimeout(setupAnimations, 100);

    // Watch for DOM changes and re-animate bars
    const mutationObserver = new MutationObserver(() => {
      animateBars();
    });

    mutationObserver.observe(document.body, { subtree: true, childList: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
