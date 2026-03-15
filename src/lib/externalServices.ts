const readEnv = (value: string | undefined, fallback = '') => {
  const normalized = value?.trim() || '';

  if (!normalized) {
    return fallback;
  }

  if (normalized.startsWith('YOUR_') || normalized.includes('example')) {
    return fallback;
  }

  return normalized;
};

export const externalServices = {
  github: {
    username: readEnv(import.meta.env.PUBLIC_GITHUB_USERNAME, 'rover0'),
  },
  mapbox: {
    token: readEnv(import.meta.env.PUBLIC_MAPBOX_TOKEN),
    lightStyle: readEnv(
      import.meta.env.PUBLIC_MAPBOX_LIGHT_STYLE,
      'mapbox://styles/mapbox/streets-v12',
    ),
    darkStyle: readEnv(
      import.meta.env.PUBLIC_MAPBOX_DARK_STYLE,
      'mapbox://styles/mapbox/dark-v11',
    ),
  },
};
