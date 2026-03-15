/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GITHUB_USERNAME?: string;
  readonly PUBLIC_MAPBOX_TOKEN?: string;
  readonly PUBLIC_MAPBOX_LIGHT_STYLE?: string;
  readonly PUBLIC_MAPBOX_DARK_STYLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
