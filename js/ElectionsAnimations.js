'use client';

import { useEffect } from 'react';

export default function ElectionsAnimations() {
  useEffect(() => {
    // Animate poll bars
    const animateBars = () => {
      document.querySelectorAll('[data-w]').forEach(el => {
        const targetWidth = el.dataset.w;
        el.style.transition = 'width 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s';
        el.style.width = targetWidth;
      });
    };

    // Intersection observer for fade-up
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = `fadeUp 0.8s ${index * 0.1}s both`;
        }
      });
    }, { threshold: 0.1 });

    // Start animations after short delay
    const timeoutId = setTimeout(() => {
      animateBars();
      document.querySelectorAll('[data-election-animate]').forEach((el) => {
        observer.observe(el);
      });
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return null;
}
