import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '../test/utils';
import { UserList } from './UserList';
import { useGithubStore } from '../store/github';
import type { GitHubUser } from '../types';

describe('UserList', () => {
    const mockUsers: GitHubUser[] = [
        { id: 1, login: 'user1', html_url: 'https://github.com/user1' },
        { id: 2, login: 'user2', html_url: 'https://github.com/user2' },
    ];

    beforeEach(() => {
        // Reset store before each test
        useGithubStore.setState({
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
        });
    });

    it('renders list of users', () => {
        render(<UserList users={mockUsers} />);
        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('user2')).toBeInTheDocument();
    });

    it('renders nothing when users array is empty', () => {
        const { container } = render(<UserList users={[]} />);
        expect(container.firstChild).toBeNull();
    });

    it('highlights selected user', () => {
        // Set selected user in store
        useGithubStore.setState({
            search: {
                term: '',
                lastSearchedTerm: '',
                isLoading: false,
                error: null,
                users: mockUsers,
            },
            repositories: {
                items: [],
                isLoading: false,
                selectedUser: 'user1',
            },
        });

        render(<UserList users={mockUsers} />);
        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
        expect(buttons[1]).toHaveAttribute('aria-expanded', 'false');
    });
});
