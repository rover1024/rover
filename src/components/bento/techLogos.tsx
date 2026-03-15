export interface TechBadge {
  name: string;
  asset: string;
  glow: string;
  surface: string;
}

export const techBadges: TechBadge[] = [
  {
    name: 'React',
    asset: '/tech/react.svg',
    glow: 'rgba(97, 218, 251, 0.28)',
    surface: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(97,218,251,0.12))',
  },
  {
    name: 'Vue',
    asset: '/tech/vue.svg',
    glow: 'rgba(79, 192, 141, 0.26)',
    surface: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(79,192,141,0.14))',
  },
  {
    name: 'TypeScript',
    asset: '/tech/typescript.svg',
    glow: 'rgba(49, 120, 198, 0.24)',
    surface: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(49,120,198,0.16))',
  },
  {
    name: 'Go',
    asset: '/tech/go.svg',
    glow: 'rgba(0, 173, 216, 0.24)',
    surface: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(0,173,216,0.12))',
  },
  {
    name: 'Docker',
    asset: '/tech/docker.svg',
    glow: 'rgba(36, 150, 237, 0.26)',
    surface: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(36,150,237,0.13))',
  },
  {
    name: 'Node.js',
    asset: '/tech/nodejs.svg',
    glow: 'rgba(51, 153, 51, 0.26)',
    surface: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(51,153,51,0.13))',
  },
  {
    name: 'HTML5',
    asset: '/tech/html5.svg',
    glow: 'rgba(227, 79, 38, 0.24)',
    surface: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(227,79,38,0.12))',
  },
  {
    name: 'CSS3',
    asset: '/tech/css.svg',
    glow: 'rgba(21, 114, 182, 0.24)',
    surface: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(21,114,182,0.12))',
  },
  {
    name: 'Git',
    asset: '/tech/git.svg',
    glow: 'rgba(240, 80, 50, 0.24)',
    surface: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(240,80,50,0.12))',
  },
  {
    name: 'Kubernetes',
    asset: '/tech/kubernetes.svg',
    glow: 'rgba(50, 108, 229, 0.24)',
    surface: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(50,108,229,0.12))',
  },
  {
    name: 'Rust',
    asset: '/tech/rust.svg',
    glow: 'rgba(51, 65, 85, 0.18)',
    surface: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(30,41,59,0.1))',
  },
  {
    name: 'Python',
    asset: '/tech/python.svg',
    glow: 'rgba(55, 118, 171, 0.24)',
    surface: 'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(55,118,171,0.12))',
  },
];

interface TechLogoIconProps {
  badge: TechBadge;
  className?: string;
}

export function TechLogoIcon({ badge, className }: TechLogoIconProps) {
  return (
    <img
      src={badge.asset}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading="lazy"
      className={className || 'h-full w-full object-contain'}
    />
  );
}
