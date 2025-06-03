import type { GitHubUser, GitHubRepo, ApiGitHubUserSearchResponse, ApiGitHubRepo, ApiGitHubUser } from '../types';

const GITHUB_API_BASE_URL = 'https://api.github.com';

async function handleResponse<T,>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown API error' }));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const searchUsers = async (query: string): Promise<GitHubUser[]> => {
  const response = await fetch(
    `${GITHUB_API_BASE_URL}/search/users?q=${encodeURIComponent(query)}&per_page=5`,
  );
  const data = await handleResponse<ApiGitHubUserSearchResponse>(response);
  return data.items.map((user: ApiGitHubUser) => ({
    id: user.id,
    login: user.login,
    html_url: user.html_url,
  }));
};

export const getUserRepos = async (username: string): Promise<GitHubRepo[]> => {
  const response = await fetch(
    `${GITHUB_API_BASE_URL}/users/${username}/repos?sort=updated&direction=desc`,
  );
  const data = await handleResponse<ApiGitHubRepo[]>(response);
  return data.map((repo: ApiGitHubRepo) => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    html_url: repo.html_url,
    stargazers_count: repo.stargazers_count,
  }));
};
