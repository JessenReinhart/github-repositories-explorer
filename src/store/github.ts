import { create } from 'zustand';
import { GitHubRepo, GitHubUser } from '../types';
import { getUserRepos, searchUsers } from '../services/githubService';

interface GithubState {
    search: {
        term: string;
        lastSearchedTerm: string;
        isLoading: boolean;
        error: string | null;
        users: GitHubUser[];
    };
    repositories: {
        items: GitHubRepo[];
        isLoading: boolean;
        selectedUser: string | null;
    };
    setSearchTerm: (term: string) => void;
    handleSearch: () => Promise<void>;
    handleUserSelect: (login: string) => Promise<void>;
}

export const useGithubStore = create<GithubState>()((set, get) => ({
    search: {
        term: '',
        lastSearchedTerm: '',
        isLoading: false,
        error: null,
        users: [],
    },
    repositories: {
        items: [],
        isLoading: false,
        selectedUser: null,
    },
    setSearchTerm: (term) => {
        set((state) => ({
            search: { ...state.search, term },
        }));
    },
    handleSearch: async () => {
        const { term } = get().search;

        if (!term.trim()) {
            set((state) => ({
                search: {
                    ...state.search,
                    error: 'Please enter a username to search.',
                    users: [],
                    lastSearchedTerm: '',
                },
                repositories: { items: [], isLoading: false, selectedUser: null },
            }));
            return;
        }

        set((state) => ({
            search: {
                ...state.search,
                isLoading: true,
                error: null,
                users: [],
                lastSearchedTerm: term,
            },
            repositories: { items: [], isLoading: false, selectedUser: null },
        }));

        try {
            const foundUsers = await searchUsers(term);
            set((state) => ({
                search: {
                    ...state.search,
                    users: foundUsers,
                    isLoading: false,
                    error: foundUsers.length === 0 ? `No users found for "${term}".` : null,
                },
            }));
        } catch (err) {
            set((state) => ({
                search: {
                    ...state.search,
                    error: err instanceof Error ? err.message : 'Failed to fetch users.',
                    users: [],
                    isLoading: false,
                },
            }));
        }
    },
    handleUserSelect: async (login) => {
        const { selectedUser } = get().repositories;

        if (selectedUser === login) {
            set(() => ({
                repositories: { items: [], isLoading: false, selectedUser: null },
            }));
            return;
        }

        set((state) => ({
            repositories: { ...state.repositories, isLoading: true, selectedUser: login, items: [] },
        }));

        try {
            const userRepos = await getUserRepos(login);
            set((state) => ({
                repositories: { ...state.repositories, items: userRepos, isLoading: false },
            }));
        } catch (err) {
            set((state) => ({
                search: {
                    ...state.search,
                    error: err instanceof Error ? err.message : `Failed to fetch repositories for ${login}.`,
                },
                repositories: { ...state.repositories, items: [], isLoading: false },
            }));
        }
    },
}));
