export interface Friend {
    id: string;
    name: string;
    avatar: string;
    url: string;
    github: string;
    tags: string[];
}

export const friends: Friend[] = [
    {
        id: 'dan',
        name: 'Dan Abramov',
        avatar: 'https://github.com/gaearon.png',
        url: 'https://overreacted.io',
        github: 'https://github.com/gaearon',
        tags: ['React', 'Redux', 'JavaScript'],
    },
    {
        id: 'evan',
        name: 'Evan You',
        avatar: 'https://github.com/yyx990803.png',
        url: 'https://evanyou.me',
        github: 'https://github.com/yyx990803',
        tags: ['Vue', 'Vite', 'Open Source'],
    },
    {
        id: 'guillermo',
        name: 'Guillermo Rauch',
        avatar: 'https://github.com/rauchg.png',
        url: 'https://rauchg.com',
        github: 'https://github.com/rauchg',
        tags: ['Next.js', 'Vercel', 'Node.js'],
    },
    {
        id: 'anthony',
        name: 'Anthony Fu',
        avatar: 'https://github.com/antfu.png',
        url: 'https://antfu.me',
        github: 'https://github.com/antfu',
        tags: ['Vue', 'Vite', 'UnoCSS'],
    },
    {
        id: 'sindre',
        name: 'Sindre Sorhus',
        avatar: 'https://github.com/sindresorhus.png',
        url: 'https://sindresorhus.com',
        github: 'https://github.com/sindresorhus',
        tags: ['Node.js', 'npm', 'TypeScript'],
    },
    {
        id: 'sarah',
        name: 'Sarah Drasner',
        avatar: 'https://github.com/sdras.png',
        url: 'https://sarahdrasnerdesign.com',
        github: 'https://github.com/sdras',
        tags: ['Animations', 'Vue', 'SVG'],
    },
    {
        id: 'wes',
        name: 'Wes Bos',
        avatar: 'https://github.com/wesbos.png',
        url: 'https://wesbos.com',
        github: 'https://github.com/wesbos',
        tags: ['JavaScript', 'React', 'Education'],
    },
    {
        id: 'theo',
        name: 'Theo Browne',
        avatar: 'https://github.com/t3dotgg.png',
        url: 'https://t3.gg',
        github: 'https://github.com/t3dotgg',
        tags: ['TypeScript', 'Next.js', 'tRPC'],
    },
];
