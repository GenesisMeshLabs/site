'use client';
import { useEffect } from 'react';

/**
 * Scroll-reveal observer. Adds `.on` to every `.rv` element as it enters the
 * viewport. Falls back to revealing everything if IntersectionObserver is
 * unavailable, so content is never left invisible.
 */
export default function Reveal() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('.rv'));

    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('on'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('on');
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    targets.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
