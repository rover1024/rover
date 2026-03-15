import { motion } from "framer-motion";
import {
  lazy,
  Suspense,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useTranslations } from "../../i18n/utils";
import { setTheme } from "../../lib/theme";
import MapCard from "./MapCard";
import TechGlobe from "./TechGlobe";
import { techBadges, TechLogoIcon } from "./techLogos";

const CarScene = lazy(() => import("./CarScene"));

type BentoCardId =
  | "profile"
  | "globe"
  | "project1"
  | "car"
  | "theme"
  | "map"
  | "photo"
  | "project2"
  | "techstack"
  | "project3";

interface BentoHomeProps {
  avatarUrl: string;
  name: string;
  githubUrl: string;
  lang: string;
}

interface BentoCardDefinition {
  id: BentoCardId;
  className: string;
  content: ReactNode;
}

const CARD_ORDER: BentoCardId[] = [
  "profile",
  "globe",
  "project1",
  "car",
  "theme",
  "map",
  "photo",
  "project2",
  "techstack",
  "project3",
];

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.05,
      duration: 0.45,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

const DOG_AVATAR_URL = "/avatar.avif";

const avatarSpring = {
  type: "spring",
  stiffness: 120,
  damping: 14,
  mass: 0.9,
} as const;

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

function ToggleIcon({ toggled }: { toggled: boolean }) {
  return (
    <motion.svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: toggled ? 180 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <path d="M3 12a9 9 0 0 0 15.5 6.36L21 16" />
      <path d="M21 12A9 9 0 0 0 5.5 5.64L3 8" />
      <path d="M3 8V3" />
      <path d="M21 16v5" />
    </motion.svg>
  );
}

export default function BentoHome({
  avatarUrl,
  name,
  githubUrl,
  lang,
}: BentoHomeProps) {
  const t = useTranslations(lang);
  const [isDark, setIsDark] = useState(false);
  const [showAlternateAvatar, setShowAlternateAvatar] = useState(false);

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const cards: Record<BentoCardId, BentoCardDefinition> = {
    profile: {
      id: "profile",
      className: "bento-card bento-profile p-6 flex flex-col",
      content: (
        <>
          <div className="mb-4 flex items-start justify-between gap-4">
            <button
              type="button"
              onClick={() => setShowAlternateAvatar((c) => !c)}
              className="relative h-16 w-16 cursor-pointer md:h-20 md:w-20"
              aria-label="Toggle avatar"
            >
              {/* ripple ring on toggle */}
              <motion.div
                key={showAlternateAvatar ? "ring-a" : "ring-b"}
                className="absolute inset-0 rounded-full border-2 border-[var(--color-accent)]"
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />

              {/* primary avatar */}
              <motion.img
                src={avatarUrl}
                alt={name}
                className="absolute inset-0 h-full w-full rounded-full border border-[var(--color-border)] object-cover"
                style={{ viewTransitionName: "avatar" } as CSSProperties}
                animate={{
                  scale: showAlternateAvatar ? 0.4 : 1,
                  opacity: showAlternateAvatar ? 0 : 1,
                  rotate: showAlternateAvatar ? 360 : 0,
                  filter: showAlternateAvatar ? "blur(6px)" : "blur(0px)",
                }}
                transition={avatarSpring}
              />

              {/* dog avatar */}
              <motion.img
                src={DOG_AVATAR_URL}
                alt="Dog avatar"
                className="absolute inset-0 h-full w-full rounded-full border border-[var(--color-border)] object-cover"
                animate={{
                  scale: showAlternateAvatar ? 1 : 0.4,
                  opacity: showAlternateAvatar ? 1 : 0,
                  rotate: showAlternateAvatar ? 0 : -360,
                  filter: showAlternateAvatar ? "blur(0px)" : "blur(6px)",
                }}
                transition={avatarSpring}
              />
            </button>

            <button
              type="button"
              onClick={() => setShowAlternateAvatar((c) => !c)}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              aria-label="Toggle avatar"
            >
              <ToggleIcon toggled={showAlternateAvatar} />
              Toggle
            </button>
          </div>

          <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
            {t("bento.greeting")}
          </p>
          <h1 className="mb-3 text-2xl font-[family-name:var(--font-display)]">
            <em className="not-italic font-black bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              {name}
            </em>
            <span className="ml-2 text-sm font-normal text-[var(--color-text-muted)]">
              {t("bento.role")}
            </span>
          </h1>
          <p className="mb-5 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {t("bento.bio")}
          </p>

          <div className="flex items-center gap-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bento-social-link"
              aria-label="GitHub"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            <a
              href="https://juejin.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="bento-social-link"
              aria-label="稀土掘金"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="m12 14.316 7.454-5.88-2.022-1.625L12 11.1l-.004.003-5.432-4.288-2.02 1.624 7.452 5.88Zm0-7.247 2.89-2.298L12 2.453l-.004-.005-2.884 2.318 2.884 2.3Zm0 11.266-.005.002-9.975-7.87L0 12.088l.194.156 11.803 9.308 7.463-5.885L24 12.085l-2.023-1.624Z" />
              </svg>
            </a>

            <a
              href="mailto:hello@rover.dev"
              className="bento-social-link"
              aria-label="Email"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </>
      ),
    },
    globe: {
      id: "globe",
      className: "bento-card bento-globe",
      content: <TechGlobe />,
    },
    project1: {
      id: "project1",
      className: "bento-card bento-project1 group cursor-pointer",
      content: (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          />
          <div className="absolute inset-0 opacity-[0.07]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>
          <div className="relative flex h-full flex-col justify-between p-5 text-white">
            <div className="mb-4 text-4xl">🤖</div>
            <div className="mt-auto">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                {t("bento.project.webapp.title")}
              </h3>
              <p className="mt-1 text-sm leading-relaxed opacity-80">
                {t("bento.project.webapp.desc")}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                <ArrowIcon />
              </span>
            </div>
          </div>
        </>
      ),
    },
    car: {
      id: "car",
      className:
        "bento-card bento-car bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_38%)]",
      content: (
        <>
          <Suspense
            fallback={
              <img
                src={isDark ? "/mini-dark.jpg" : "/mini-light.jpg"}
                alt={t("bento.car3d")}
                className="h-full w-full object-cover"
              />
            }
          >
            <CarScene isDark={isDark} />
          </Suspense>
        </>
      ),
    },
    theme: {
      id: "theme",
      className:
        "bento-card bento-theme flex items-center justify-center cursor-pointer",
      content: (
        <button
          type="button"
          onClick={handleThemeToggle}
          className="flex h-full w-full flex-col items-center justify-center gap-4"
          aria-label="Toggle theme"
        >
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full">
            <div
              className="absolute inset-0 rounded-full transition-colors duration-500"
              style={{
                background: isDark
                  ? "radial-gradient(circle, #1e1b4b, #312e81)"
                  : "radial-gradient(circle, #fef3c7, #fbbf24)",
              }}
            />
            <span className="relative text-3xl">{isDark ? "🌙" : "☀️"}</span>
          </div>
          <div
            className="relative h-6 w-12 rounded-full transition-colors duration-300"
            style={{ background: isDark ? "var(--color-accent)" : "#e5e7eb" }}
          >
            <div
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300"
              style={{
                transform: isDark ? "translateX(26px)" : "translateX(2px)",
              }}
            />
          </div>
        </button>
      ),
    },
    map: {
      id: "map",
      className: "bento-card bento-map",
      content: <MapCard lang={lang} isDark={isDark} />,
    },
    photo: {
      id: "photo",
      className: "bento-card bento-photo group",
      content: (
        <>
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop&auto=format"
            alt={t("bento.photography")}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-5 text-white">
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
              {t("bento.photography")}
            </h3>
            <p className="mt-1 text-sm opacity-80">{t("bento.photoDesc")}</p>
          </div>
          <div className="absolute left-4 top-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              <ArrowIcon className="text-white" />
            </span>
          </div>
        </>
      ),
    },
    project2: {
      id: "project2",
      className: "bento-card bento-project2 group cursor-pointer",
      content: (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #F472B6 0%, #FB923C 100%)",
            }}
          />
          <div className="absolute inset-0 opacity-[0.07]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>
          <div className="relative flex h-full flex-col justify-between p-5 text-white">
            <div>
              <div className="mb-3 text-3xl">⚡</div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                {t("bento.project.devkit.title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed opacity-80">
                {t("bento.project.devkit.desc")}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                <ArrowIcon />
              </span>
            </div>
          </div>
        </>
      ),
    },
    techstack: {
      id: "techstack",
      className: "bento-card bento-techstack p-4 flex flex-col",
      content: (
        <>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            {t("bento.techIcons")}
          </h4>
          <div className="grid flex-1 grid-cols-4 place-items-center content-center gap-2.5">
            {techBadges.slice(0, 12).map((badge) => (
              <div
                key={badge.name}
                className="group relative flex aspect-square w-full items-center justify-center rounded-[1.1rem] border border-white/75 bg-white/92 p-2 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_16px_28px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-950/78 dark:hover:shadow-[0_18px_32px_rgba(2,6,23,0.4)]"
                style={{ background: badge.surface }}
                title={badge.name}
                aria-label={`${badge.name} logo`}
              >
                <TechLogoIcon
                  badge={badge}
                  className="h-7 w-7 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[8deg] md:h-8 md:w-8"
                />
              </div>
            ))}
          </div>
        </>
      ),
    },
    project3: {
      id: "project3",
      className: "bento-card bento-project3 group cursor-pointer",
      content: (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
            }}
          />
          <div className="relative flex h-full flex-col justify-between p-5 text-white">
            <div>
              <div className="mb-3 text-3xl">☁️</div>
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                {t("bento.project.cloudrun.title")}
              </h3>
              <p className="mt-1 text-sm leading-relaxed opacity-80">
                {t("bento.project.cloudrun.desc")}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                <ArrowIcon />
              </span>
            </div>
          </div>
        </>
      ),
    },
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 pt-24 md:pb-12 md:pt-28">
      <div className="bento-grid">
        {CARD_ORDER.map((cardId, index) => {
          const card = cards[cardId];

          return (
            <motion.div
              key={card.id}
              className={card.className}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              {card.content}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
