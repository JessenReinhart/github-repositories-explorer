export interface GitHubUser {
  login: string;
  id: number;
  html_url: string; 
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
}

// Raw API response types (subset of fields)
export interface ApiGitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface ApiGitHubUserSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: ApiGitHubUser[];
}

export interface ApiGitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  owner: {
    login: string;
  };
}
