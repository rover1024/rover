import { externalServices } from './externalServices';

const GITHUB_USERNAME = externalServices.github.username;
let cachedUser: GitHubUser | null = null;
let pendingUserRequest: Promise<GitHubUser> | null = null;

export interface GitHubUser {
  avatar_url: string;
  name: string | null;
  bio: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  login: string;
}

const fallbackUser: GitHubUser = {
  avatar_url: `https://github.com/${GITHUB_USERNAME}.png`,
  name: 'Rover',
  bio: 'A passionate developer who loves building beautiful things on the web.',
  html_url: `https://github.com/${GITHUB_USERNAME}`,
  public_repos: 42,
  followers: 128,
  login: GITHUB_USERNAME,
};

export async function fetchGitHubUser(): Promise<GitHubUser> {
  if (cachedUser) {
    return cachedUser;
  }

  if (pendingUserRequest) {
    return pendingUserRequest;
  }

  pendingUserRequest = (async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: {
          Accept: 'application/vnd.github+json',
        },
      });

      if (!response.ok) {
        cachedUser = fallbackUser;
        return fallbackUser;
      }

      const user = (await response.json()) as GitHubUser;
      cachedUser = user;
      return user;
    } catch {
      cachedUser = fallbackUser;
      return fallbackUser;
    } finally {
      pendingUserRequest = null;
    }
  })();

  return pendingUserRequest;
}
