import { useEffect, useRef, useState } from "react";
import { useTranslations } from "../../i18n/utils";
import { externalServices } from "../../lib/externalServices";

interface MapCardProps {
  lang: string;
  isDark: boolean;
}

type MapboxModule = {
  accessToken: string;
  Map: new (options: Record<string, unknown>) => MapboxMap;
};

type MapboxMap = {
  addControl: (control: unknown, position?: string) => void;
  getContainer: () => HTMLElement;
  on: (
    event: string,
    handler: (event?: { error?: { status?: number } }) => void,
  ) => void;
  off: (
    event: string,
    handler: (event?: { error?: { status?: number } }) => void,
  ) => void;
  remove: () => void;
  resize: () => void;
  setStyle: (style: string) => void;
  touchZoomRotate: {
    disableRotation: () => void;
  };
};

declare global {
  interface Window {
    mapboxgl?: MapboxModule;
  }
}

const MAPBOX_VERSION = "3.18.0";
const MAPBOX_SCRIPT_URL = `https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_VERSION}/mapbox-gl.js`;
const MAPBOX_CSS_URL = `https://api.mapbox.com/mapbox-gl-js/v${MAPBOX_VERSION}/mapbox-gl.css`;
const GUANGZHOU_CENTER: [number, number] = [113.2644, 23.1291];

let mapboxLoader: Promise<MapboxModule> | null = null;

const ensureMapboxCss = () => {
  if (document.getElementById("mapbox-gl-css")) return;

  const link = document.createElement("link");
  link.id = "mapbox-gl-css";
  link.rel = "stylesheet";
  link.href = MAPBOX_CSS_URL;
  document.head.appendChild(link);
};

const loadMapbox = async () => {
  if (typeof window === "undefined") {
    throw new Error("Mapbox can only be loaded in the browser.");
  }

  ensureMapboxCss();

  if (window.mapboxgl) {
    return window.mapboxgl;
  }

  if (mapboxLoader) {
    return mapboxLoader;
  }

  mapboxLoader = new Promise<MapboxModule>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-mapbox-gl="true"]',
    );

    const handleLoad = () => {
      if (window.mapboxgl) {
        resolve(window.mapboxgl);
        return;
      }

      reject(new Error("Mapbox loaded without exposing window.mapboxgl."));
    };

    const handleError = () => {
      reject(new Error("Failed to load Mapbox GL JS."));
    };

    if (existingScript) {
      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = MAPBOX_SCRIPT_URL;
    script.async = true;
    script.dataset.mapboxGl = "true";
    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    document.body.appendChild(script);
  }).catch((error) => {
    mapboxLoader = null;
    throw error;
  });

  return mapboxLoader;
};

export default function MapCard({ lang, isDark }: MapCardProps) {
  const t = useTranslations(lang);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<MapboxMap | null>(null);
  const styleRef = useRef(
    isDark
      ? externalServices.mapbox.darkStyle
      : externalServices.mapbox.lightStyle,
  );
  const [status, setStatus] = useState<
    "loading" | "ready" | "missing-token" | "error"
  >(externalServices.mapbox.token ? "loading" : "missing-token");

  useEffect(() => {
    if (!externalServices.mapbox.token) {
      setStatus("missing-token");
      return;
    }

    setStatus("loading");

    if (!mapRef.current || mapInstance.current) {
      return;
    }

    let cancelled = false;

    const mountMap = async () => {
      try {
        const mapboxgl = await loadMapbox();
        if (cancelled || !mapRef.current || mapInstance.current) return;

        mapboxgl.accessToken = externalServices.mapbox.token;
        styleRef.current = isDark
          ? externalServices.mapbox.darkStyle
          : externalServices.mapbox.lightStyle;

        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: styleRef.current,
          center: GUANGZHOU_CENTER,
          zoom: 10.8,
          pitch: 34,
          bearing: -18,
          antialias: true,
          attributionControl: false,
          cooperativeGestures: false,
        });

        const handleLoad = () => {
          if (cancelled) return;

          map.resize();
          setStatus("ready");
        };

        const handleError = (event?: { error?: { status?: number } }) => {
          if (cancelled) return;

          if (event?.error?.status === 401 || event?.error?.status === 403) {
            setStatus("error");
          }
        };

        map.on("load", handleLoad);
        map.on("error", handleError);
        map.touchZoomRotate.disableRotation();

        mapInstance.current = map;
      } catch (error) {
        console.error("Failed to initialize Mapbox map:", error);
        if (!cancelled) {
          setStatus("error");
        }
      }
    };

    mountMap();

    const handleResize = () => {
      mapInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const nextStyle = isDark
      ? externalServices.mapbox.darkStyle
      : externalServices.mapbox.lightStyle;

    if (styleRef.current === nextStyle) return;

    styleRef.current = nextStyle;
    mapInstance.current?.setStyle(nextStyle);
  }, [isDark]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, rgba(56,189,248,0.18), transparent 42%), linear-gradient(160deg, rgba(15,23,42,0.08), rgba(99,102,241,0.06))",
        }}
      />

      <div
        ref={mapRef}
        className={`absolute inset-0 transition-opacity duration-500 ${
          status === "ready" ? "opacity-100" : "opacity-0"
        }`}
      />

      {status !== "ready" && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.14) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(59,130,246,0.2),transparent_38%)]" />
          <div className="absolute left-1/2 top-[44%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/55 backdrop-blur-sm shadow-[0_18px_34px_rgba(37,99,235,0.2)] dark:border-slate-700 dark:bg-slate-950/55">
            <div className="absolute inset-3 rounded-full bg-[var(--color-accent)]/20" />
            <div className="absolute inset-[18px] rounded-full bg-[var(--color-accent)]" />
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-3 left-3 z-10">
        <div className="flex items-center gap-1.5 rounded-full border border-white/50 bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-950/65 dark:text-slate-300">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {t("bento.location")}
        </div>
      </div>
    </div>
  );
}
