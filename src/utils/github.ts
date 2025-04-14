interface Bookmark {
  title: string;
  url: string;
  note: string;
}

interface GitHubConfig {
  token: string;
  username: string;
  repository: string;
}

async function getGitHubConfig(): Promise<GitHubConfig> {
  const result = await chrome.storage.sync.get(['githubConfig']);
  if (!result.githubConfig) {
    throw new Error('GitHub configuration not found. Please configure in settings.');
  }
  return result.githubConfig;
}

export async function testGitHubConnection(config: GitHubConfig): Promise<void> {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${config.token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to connect to GitHub. Please check your token.');
  }
}

export async function createGitHubIssue(config: GitHubConfig, title: string, body: string): Promise<void> {
  const response = await fetch(
    `https://api.github.com/repos/${config.username}/${config.repository}/issues`,
    {
      method: 'POST',
      headers: {
        Authorization: `token ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        title,
        body,
        labels: ['bookmark']
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create GitHub issue');
  }
}

export async function saveBookmark(bookmark: Bookmark): Promise<void> {
  const config = await getGitHubConfig();
  const date = new Date();
  const timestamp = date.toLocaleString();
  
  // Format the issue body
  const body = `URL: ${bookmark.url}\n\nTime: ${timestamp}\n\nNote: ${bookmark.note}`;

  try {
    await createGitHubIssue(config, bookmark.title, body);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Failed to save bookmark: ' + error.message);
    }
    throw new Error('Failed to save bookmark: Unknown error');
  }
}

