import apiClient from './api';

// These are real public GitHub accounts, not generated demo identities.
// Profile details are refreshed from GitHub's public REST API at runtime.
export const FEATURED_GITHUB_DEVELOPERS = [
  { login: 'torvalds', label: 'Linus Torvalds' },
  { login: 'gaearon', label: 'Dan Abramov' },
  { login: 'sindresorhus', label: 'Sindre Sorhus' },
  { login: 'yyx990803', label: 'Evan You' },
  { login: 'kentcdodds', label: 'Kent C. Dodds' },
  { login: 'bradtraversy', label: 'Brad Traversy' },
  { login: 'ThePrimeagen', label: 'ThePrimeagen' },
  { login: 'joshwcomeau', label: 'Josh Comeau' },
  { login: 'addyosmani', label: 'Addy Osmani' },
  { login: 'wesbos', label: 'Wes Bos' },
  { login: 'shadcn', label: 'shadcn' },
  { login: 'tj', label: 'TJ Holowaychuk' },
];

const GITHUB_API_BASE = 'https://api.github.com';

function fallbackProfile({ login, label }) {
  return {
    id: login,
    login,
    name: label,
    avatar_url: `https://github.com/${login}.png`,
    html_url: `https://github.com/${login}`,
    bio: '',
    company: null,
    location: null,
    blog: '',
    followers: null,
    public_repos: null,
    isLive: false,
  };
}

async function fetchGithubProfile(login, signal) {
  const response = await apiClient.get(`${GITHUB_API_BASE}/users/${encodeURIComponent(login)}`, {
    signal,
    headers: { Accept: 'application/vnd.github+json' },
  });
  return { ...response.data, isLive: true };
}

/** Load a curated set of real public profiles, retaining working links if GitHub is rate-limited. */
export async function getFeaturedGithubProfiles(signal) {
  const profiles = await Promise.all(FEATURED_GITHUB_DEVELOPERS.map(async (developer) => {
    try {
      return await fetchGithubProfile(developer.login, signal);
    } catch (error) {
      if (signal?.aborted) throw error;
      return fallbackProfile(developer);
    }
  }));
  return profiles;
}

/** Search GitHub for genuine public accounts when the featured list doesn't match. */
export async function searchGithubProfiles(query, signal) {
  const response = await apiClient.get(`${GITHUB_API_BASE}/search/users`, {
    params: { q: `${query} type:user`, per_page: 12, sort: 'followers', order: 'desc' },
    signal,
    headers: { Accept: 'application/vnd.github+json' },
  });

  const candidates = (response.data?.items || []).filter((item) => item.type === 'User').slice(0, 12);
  // Search results provide real login/avatar/profile URLs. Hydrate only a few entries
  // with their public profile metadata to avoid exhausting GitHub's unauthenticated limit.
  const hydrated = await Promise.all(candidates.map(async (candidate, index) => {
    if (index >= 5) {
      return { ...candidate, name: candidate.login, isLive: false, isSearchResult: true };
    }
    try {
      return { ...(await fetchGithubProfile(candidate.login, signal)), isSearchResult: true };
    } catch (error) {
      if (signal?.aborted) throw error;
      return { ...candidate, name: candidate.login, isLive: false, isSearchResult: true };
    }
  }));

  return hydrated;
}
