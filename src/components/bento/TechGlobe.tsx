import { useEffect, useRef } from 'react';
import { TechLogoIcon, techBadges } from './techLogos';

const RADIUS = 84;
const BASE_ROTATION = { x: -0.24, y: 0.42 };

function fibonacciSphere(count: number, radius: number) {
  return Array.from({ length: count }, (_, index) => {
    const phi = Math.acos(1 - (2 * (index + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * index;

    return {
      x: Math.cos(theta) * Math.sin(phi) * radius,
      y: Math.cos(phi) * radius * 0.86,
      z: Math.sin(theta) * Math.sin(phi) * radius,
    };
  });
}

export default function TechGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const rotationRef = useRef({ ...BASE_ROTATION });
  const targetRef = useRef({ ...BASE_ROTATION });
  const hoveredRef = useRef(false);
  const positionsRef = useRef(fibonacciSphere(techBadges.length, RADIUS));

  useEffect(() => {
    const animate = (timestamp: number) => {
      const container = containerRef.current;
      if (!container) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }

      const idleY = BASE_ROTATION.y + timestamp * 0.00034;
      const idleX = BASE_ROTATION.x + Math.sin(timestamp * 0.00072) * 0.1;
      const nextTargetX = hoveredRef.current ? targetRef.current.x : idleX;
      const nextTargetY = hoveredRef.current ? targetRef.current.y : idleY;

      rotationRef.current.x += (nextTargetX - rotationRef.current.x) * 0.11;
      rotationRef.current.y += (nextTargetY - rotationRef.current.y) * 0.11;

      const children = container.children;
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);

      for (
        let index = 0;
        index < children.length && index < positionsRef.current.length;
        index += 1
      ) {
        const { x, y, z } = positionsRef.current[index];
        const rotX = x * cosY - z * sinY;
        const rotZ = x * sinY + z * cosY;
        const finalY = y * cosX - rotZ * sinX;
        const finalZ = y * sinX + rotZ * cosX;

        const normalizedZ = (finalZ + RADIUS) / (2 * RADIUS);
        const opacity = 0.14 + normalizedZ * 0.9;
        const scale = 0.52 + normalizedZ * 0.52;
        const tiltY = (rotX / RADIUS) * 16;
        const tiltX = (-finalY / RADIUS) * 12;

        const element = children[index] as HTMLElement;
        element.style.transform = `translate3d(${rotX}px, ${finalY}px, ${finalZ * 0.45}px) scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        element.style.opacity = String(opacity);
        element.style.zIndex = String(Math.round(normalizedZ * 100));
        element.style.filter = `drop-shadow(0 18px 28px rgba(15, 23, 42, ${0.08 + normalizedZ * 0.18}))`;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    hoveredRef.current = true;
    targetRef.current.y = BASE_ROTATION.y + pointerX * 1.05;
    targetRef.current.x = BASE_ROTATION.x - pointerY * 0.72;
  };

  const handlePointerLeave = () => {
    hoveredRef.current = false;
  };

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="absolute inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.18),_transparent_66%)] dark:bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.16),_transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-5 z-10 text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
        Pointer Globe
      </div>
      <div
        ref={containerRef}
        className="relative"
        style={{ width: RADIUS * 2, height: RADIUS * 2, perspective: '900px' }}
      >
        {techBadges.map((badge) => (
          <div
            key={badge.name}
            className="absolute left-1/2 top-1/2 -ml-[24px] -mt-[24px] h-12 w-12 rounded-[1.1rem] border border-white/75 bg-white/90 p-2 shadow-[0_14px_30px_rgba(15,23,42,0.12)] backdrop-blur-md will-change-transform select-none dark:border-slate-800 dark:bg-slate-950/78 dark:shadow-[0_16px_36px_rgba(2,6,23,0.42)]"
            style={{
              background: badge.surface,
              boxShadow: `0 14px 30px ${badge.glow}`,
            }}
            title={badge.name}
            aria-label={badge.name}
          >
            <TechLogoIcon badge={badge} className="h-full w-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
