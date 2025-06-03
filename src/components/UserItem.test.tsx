import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserItem } from './UserItem';
import { useGithubStore } from '../store/github';
import type { GitHubUser } from '../types';

vi.mock('../store/github', () => ({
    useGithubStore: vi.fn(),
}));

describe('UserItem', () => {
    const mockUser: GitHubUser = {
        id: 1,
        login: 'testuser',
        html_url: 'https://github.com/testuser',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders user information', () => {
        const mockOnSelect = vi.fn();
        const mockStore = {
            repositories: {
                items: [],
                isLoading: false,
            },
        };

        (useGithubStore as any).mockImplementation((selector) => selector(mockStore));

        render(
            <UserItem
                user={mockUser}
                isSelected={false}
                onSelect={mockOnSelect}
            />
        );

        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });

    it('shows loading state when selected and loading repositories', () => {
        const mockOnSelect = vi.fn();
        const mockStore = {
            repositories: {
                items: [],
                isLoading: true,
            },
        };

        (useGithubStore as any).mockImplementation((selector) => selector(mockStore));

        render(
            <UserItem
                user={mockUser}
                isSelected={true}
                onSelect={mockOnSelect}
            />
        );

        expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('shows repositories when selected and loaded', () => {
        const mockOnSelect = vi.fn();
        const mockStore = {
            repositories: {
                items: [
                    {
                        id: 1,
                        name: 'test-repo',
                        description: 'Test repository',
                        html_url: 'https://github.com/testuser/test-repo',
                        stargazers_count: 10,
                    },
                ],
                isLoading: false,
            },
        };

        (useGithubStore as any).mockImplementation((selector) => selector(mockStore));

        render(
            <UserItem
                user={mockUser}
                isSelected={true}
                onSelect={mockOnSelect}
            />
        );

        expect(screen.getByText('test-repo')).toBeInTheDocument();
    });

    it('shows no repositories message when selected user has no repos', () => {
        const mockOnSelect = vi.fn();
        const mockStore = {
            repositories: {
                items: [],
                isLoading: false,
            },
        };

        (useGithubStore as any).mockImplementation((selector) => selector(mockStore));

        render(
            <UserItem
                user={mockUser}
                isSelected={true}
                onSelect={mockOnSelect}
            />
        );

        expect(screen.getByText(/no public repositories/i)).toBeInTheDocument();
    });
});
