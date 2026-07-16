"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { gsap } from "gsap";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function safeAnim(
  vars: gsap.TweenVars,
  fallbackVars?: gsap.TweenVars
): gsap.TweenVars {
  if (prefersReducedMotion()) return fallbackVars ?? { duration: 0, opacity: 1 };
  return vars;
}

export function fadeInUp(el: gsap.TweenTarget, delay = 0) {
  return gsap.fromTo(
    el,
    { opacity: 0, y: 12 },
    safeAnim({ opacity: 1, y: 0, duration: 0.35, delay, ease: "power2.out" })
  );
}

export function fadeIn(el: gsap.TweenTarget, delay = 0) {
  return gsap.fromTo(
    el,
    { opacity: 0 },
    safeAnim({ opacity: 1, duration: 0.3, delay, ease: "power2.out" })
  );
}

export function scaleIn(el: gsap.TweenTarget, delay = 0) {
  return gsap.fromTo(
    el,
    { opacity: 0, scale: 0.85 },
    safeAnim({ opacity: 1, scale: 1, duration: 0.35, delay, ease: "back.out(1.5)" })
  );
}

export function slideInLeft(el: gsap.TweenTarget, delay = 0) {
  return gsap.fromTo(
    el,
    { opacity: 0, x: -280 },
    safeAnim({ opacity: 1, x: 0, duration: 0.3, delay, ease: "power3.out" })
  );
}

export function staggerFadeInUp(
  container: Element | null,
  childSelector: string,
  stagger = 0.04
) {
  if (!container) return;
  const children = container.querySelectorAll(childSelector);
  if (!children.length) return;
  return gsap.fromTo(
    children,
    { opacity: 0, y: 10 },
    safeAnim({
      opacity: 1,
      y: 0,
      duration: 0.3,
      stagger,
      ease: "power2.out",
    })
  );
}

export function staggerFadeIn(
  container: Element | null,
  childSelector: string,
  stagger = 0.03
) {
  if (!container) return;
  const children = container.querySelectorAll(childSelector);
  if (!children.length) return;
  return gsap.fromTo(
    children,
    { opacity: 0 },
    safeAnim({ opacity: 1, duration: 0.25, stagger, ease: "power2.out" })
  );
}

export function hoverScale(el: Element) {
  const mm = gsap.matchMedia();
  mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
    gsap.to(el, { scale: 1.02, duration: 0.2, ease: "power1.out", paused: true });
    el.addEventListener("mouseenter", () => gsap.to(el, { scale: 1.02, duration: 0.2, ease: "power2.out", overwrite: "auto" }));
    el.addEventListener("mouseleave", () => gsap.to(el, { scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" }));
  });
  return () => mm.revert();
}

export function hoverTapScale(el: Element) {
  const mm = gsap.matchMedia();
  mm.add("(hover: hover) and (prefers-reduced-motion: no-preference)", () => {
    el.addEventListener("mouseenter", () => gsap.to(el, { scale: 1.03, duration: 0.2, ease: "power2.out", overwrite: "auto" }));
    el.addEventListener("mouseleave", () => gsap.to(el, { scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" }));
    el.addEventListener("mousedown", () => gsap.to(el, { scale: 0.97, duration: 0.1, ease: "power1.out", overwrite: "auto" }));
    el.addEventListener("mouseup", () => gsap.to(el, { scale: 1.03, duration: 0.15, ease: "power1.out", overwrite: "auto" }));
  });
  return () => mm.revert();
}

export function useAnimatedPresence(show: boolean, exitDuration = 300) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), exitDuration);
      return () => clearTimeout(timer);
    }
  }, [show, exitDuration]);

  const onExitComplete = useCallback(() => {
    // noop — handled by effect
  }, []);

  return { shouldRender, animatingIn: show, onExitComplete };
}
