import { describe, it, expect } from 'vitest';
import { render, screen } from '../test/utils';
import { RepositoryList } from './RepositoryList';
import type { GitHubRepo } from '../types';

describe('RepositoryList', () => {
    const mockRepos: GitHubRepo[] = [
        {
            id: 1,
            name: 'repo-1',
            description: 'First test repository',
            html_url: 'https://github.com/testuser/repo-1',
            stargazers_count: 10,
        },
        {
            id: 2,
            name: 'repo-2',
            description: 'Second test repository',
            html_url: 'https://github.com/testuser/repo-2',
            stargazers_count: 20,
        },
    ];

    it('renders a list of repositories', () => {
        render(<RepositoryList repos={mockRepos} />);

        // Should render all repository names
        expect(screen.getByText('repo-1')).toBeInTheDocument();
        expect(screen.getByText('repo-2')).toBeInTheDocument();

        // Should render all repository descriptions
        expect(screen.getByText('First test repository')).toBeInTheDocument();
        expect(screen.getByText('Second test repository')).toBeInTheDocument();

        // Should render all star counts
        expect(screen.getByText('10')).toBeInTheDocument();
        expect(screen.getByText('20')).toBeInTheDocument();

        // Should render correct number of repository items
        const repoItems = screen.getAllByRole('link');
        expect(repoItems).toHaveLength(2);
    });

    it('renders empty div when no repositories are provided', () => {
        const { container } = render(<RepositoryList repos={[]} />);

        // Should render the container div but with no items
        expect(container.firstChild).toBeInTheDocument();
        expect(container.firstChild?.childNodes).toHaveLength(0);
    });
});
