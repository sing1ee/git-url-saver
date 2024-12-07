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

// Helper function to handle Unicode characters
function utf8ToBase64(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
    function toSolidBytes(_match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    }));
}

// Helper function to decode Base64 to UTF-8
function base64ToUtf8(str: string): string {
  return decodeURIComponent(atob(str).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
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

export async function saveBookmark(bookmark: Bookmark): Promise<void> {
  const config = await getGitHubConfig();
  const date = new Date();
  const fileName = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}.md`;
  
  // Format the bookmark entry
  const timestamp = date.toLocaleString();
  const entry = `\n## [${bookmark.title}](${bookmark.url})\n- Time: ${timestamp}\n- Note: ${bookmark.note}\n`;

  try {
    // Try to get the existing file
    const existingFile = await getFile(config, fileName);
    const content = existingFile ? existingFile + entry : entry;
    
    await updateFile(config, fileName, content, existingFile ? 'update' : 'create');
  } catch (error) {
    throw new Error('Failed to save bookmark: ' + error.message);
  }
}

async function getFile(config: GitHubConfig, path: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.username}/${config.repository}/contents/${path}`,
      {
        headers: {
          Authorization: `token ${config.token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    const data = await response.json();
    return base64ToUtf8(data.content);
  } catch (error) {
    return null;
  }
}

async function updateFile(
  config: GitHubConfig,
  path: string,
  content: string,
  action: 'create' | 'update'
): Promise<void> {
  const existingFile = action === 'update' ? await getFile(config, path) : null;
  const sha = existingFile ? (await fetch(
    `https://api.github.com/repos/${config.username}/${config.repository}/contents/${path}`,
    {
      headers: {
        Authorization: `token ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  ).then(res => res.json())).sha : undefined;

  const response = await fetch(
    `https://api.github.com/repos/${config.username}/${config.repository}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${config.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: action === 'create' ? 'Create bookmark file' : 'Update bookmarks',
        content: utf8ToBase64(content),
        sha,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update file on GitHub');
  }
}