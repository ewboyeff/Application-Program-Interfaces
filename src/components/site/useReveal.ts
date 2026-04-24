import { useEffect, useRef } from "react";

/**
 * Adds an IntersectionObserver to fade-in elements with the `reveal` class
 * when they enter the viewport. Returns a ref to attach to the section root.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>(".reveal");
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    targets.forEach((t, i) => {
      t.style.transitionDelay = `${Math.min(i * 80, 400)}ms`;
      io.observe(t);
    });

    return () => io.disconnect();
  }, []);

  return ref;
}