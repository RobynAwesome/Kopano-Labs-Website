import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Connection = { saveData?: boolean; effectiveType?: string };

type NavigatorWithConnection = Navigator & { connection?: Connection; deviceMemory?: number };

export function startExperienceRuntime() {
  if (typeof window === 'undefined') return () => undefined;

  const nav = navigator as NavigatorWithConnection;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(nav.connection?.saveData);
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const narrow = window.matchMedia('(max-width: 720px)').matches;

  const tier = saveData || cores <= 2 || memory <= 2 ? 'lite' : narrow || cores <= 4 || memory <= 4 ? 'balanced' : 'full';
  const root = document.documentElement;
  root.dataset.experienceTier = tier;
  root.dataset.motion = reducedMotion ? 'reduced' : 'full';
  root.dataset.saveData = saveData ? 'true' : 'false';

  if (reducedMotion || saveData) return () => undefined;

  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {
    gsap.fromTo('.manifesto-band span',
      { opacity: .28, y: 18, filter: 'blur(5px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', stagger: .11, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.manifesto-band', start: 'top 86%' } },
    );

    gsap.utils.toArray<HTMLElement>('.system-card').forEach((card, index) => {
      gsap.fromTo(card,
        { y: 34, opacity: 0, rotateX: 4 },
        { y: 0, opacity: 1, rotateX: 0, duration: .72, delay: Math.min(index * .05, .3), ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 92%', once: true } },
      );
    });

    gsap.fromTo('.split-section::after', {}, {}); // selector is intentionally no-op; pseudo-element stays CSS-driven.
  });

  return () => {
    context.revert();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}
