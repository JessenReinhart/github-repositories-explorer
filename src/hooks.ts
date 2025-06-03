import { useCallback, useState } from 'react';
import { getUserRepos, searchUsers } from './services/githubService';
import { GitHubRepo, GitHubUser } from './types';

export interface UseGitHubSearchReturn {
    search: {
        term: string;
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

export const useGitHubSearch = (): UseGitHubSearchReturn => {
    const [search, setSearch] = useState<UseGitHubSearchReturn['search']>({
        term: '',
        isLoading: false,
        error: null,
        users: [],
    });

    const [repositories, setRepositories] = useState<UseGitHubSearchReturn['repositories']>({
        items: [],
        isLoading: false,
        selectedUser: null,
    });

    const setSearchTerm = (term: string) => {
        setSearch((prev) => ({ ...prev, term }));
    };

    const handleSearch = useCallback(async () => {
        if (!search.term.trim()) {
            setSearch((prev) => ({
                ...prev,
                error: 'Please enter a username to search.',
                users: [],
            }));
            setRepositories({ items: [], isLoading: false, selectedUser: null });
            return;
        }

        setSearch((prev) => ({ ...prev, isLoading: true, error: null, users: [] }));
        setRepositories({ items: [], isLoading: false, selectedUser: null });

        try {
            const foundUsers = await searchUsers(search.term);
            setSearch((prev) => ({
                ...prev,
                users: foundUsers,
                isLoading: false,
                error:
                    foundUsers.length === 0
                        ? `No users found for "${search.term}".`
                        : null,
            }));
        } catch (err) {
            setSearch((prev) => ({
                ...prev,
                error: err instanceof Error ? err.message : 'Failed to fetch users.',
                users: [],
                isLoading: false,
            }));
        }
    }, [search.term]);

    const handleUserSelect = useCallback(
        async (login: string) => {
            if (repositories.selectedUser === login) {
                setRepositories({ items: [], isLoading: false, selectedUser: null });
                return;
            }

            setRepositories((prev) => ({ ...prev, isLoading: true, selectedUser: login, items: [] }));

            try {
                const userRepos = await getUserRepos(login);
                setRepositories((prev) => ({ ...prev, items: userRepos, isLoading: false }));
            } catch (err) {
                setSearch((prev) => ({
                    ...prev,
                    error:
                        err instanceof Error
                            ? err.message
                            : `Failed to fetch repositories for ${login}.`,
                }));
                setRepositories((prev) => ({ ...prev, items: [], isLoading: false }));
            }
        },
        [repositories.selectedUser],
    );

    return {
        search,
        repositories,
        setSearchTerm,
        handleSearch,
        handleUserSelect,
    };
};
