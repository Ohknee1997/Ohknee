/**
 * githubSyncService.ts
 * Manages syncing and pushing text and image updates directly to GitHub
 * via GitHub REST API with automatic SHA tracking, commit message generation,
 * and live push notifications.
 */

export interface GitHubConfig {
  repo: string; // e.g. "oniamaya/ohknee" or "username/repository"
  branch: string; // default "main"
  token: string; // GitHub Personal Access Token (PAT with repo scope)
  filePath: string; // default "site-content.json"
}

export interface PushResult {
  success: boolean;
  message: string;
  commitSha?: string;
  commitUrl?: string;
  error?: string;
}

const STORAGE_KEY = 'ohk_github_config_v1';
const LAST_SYNC_KEY = 'ohk_github_last_sync_v1';

export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  repo: 'oniamaya998/ohknee',
  branch: 'main',
  token: '',
  filePath: 'site-content.json',
};

export function getGitHubConfig(): GitHubConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_GITHUB_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to read GitHub config:', e);
  }
  return DEFAULT_GITHUB_CONFIG;
}

export function saveGitHubConfig(config: Partial<GitHubConfig>): GitHubConfig {
  const current = getGitHubConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ohknee:github-config-updated', { detail: updated }));
  } catch (e) {
    console.error('Failed to save GitHub config:', e);
  }
  return updated;
}

export function getLastSyncTime(): string | null {
  try {
    return localStorage.getItem(LAST_SYNC_KEY);
  } catch {
    return null;
  }
}

export function notifyPushStatus(
  status: 'idle' | 'pushing' | 'success' | 'error',
  message: string,
  details?: { commitSha?: string; commitUrl?: string }
) {
  window.dispatchEvent(
    new CustomEvent('ohknee:github-push-status', {
      detail: { status, message, ...details },
    })
  );
}

/**
 * Encodes string to UTF-8 base64 safely
 */
function toBase64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return btoa(str);
  }
}

/**
 * Tests connection to GitHub with provided or stored config
 */
export async function testGitHubConnection(config?: GitHubConfig): Promise<{ ok: boolean; message: string }> {
  const cfg = config || getGitHubConfig();
  if (!cfg.token) {
    return { ok: false, message: 'GitHub Personal Access Token is missing.' };
  }
  if (!cfg.repo || !cfg.repo.includes('/')) {
    return { ok: false, message: 'Please enter a valid repository (e.g. username/repo).' };
  }

  const [owner, repo] = cfg.repo.split('/');
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      return { ok: true, message: `Connected to GitHub repository: ${data.full_name}` };
    } else if (res.status === 401) {
      return { ok: false, message: 'Bad credentials: Token is invalid or expired.' };
    } else if (res.status === 404) {
      return { ok: false, message: `Repository ${owner}/${repo} not found or token lacks 'repo' permission.` };
    } else {
      const err = await res.json().catch(() => ({}));
      return { ok: false, message: err.message || `GitHub error status: ${res.status}` };
    }
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Network error connecting to GitHub API.' };
  }
}

/**
 * Pushes updated text and images to GitHub
 */
export async function pushContentToGitHub(
  payload: {
    textData: Record<string, any>;
    imageData?: Record<string, any>;
    offersData?: any[];
    actionDescription?: string;
  }
): Promise<PushResult> {
  const cfg = getGitHubConfig();

  // If no token is configured, notify and return prompt to configure
  if (!cfg.token || !cfg.repo || !cfg.repo.includes('/')) {
    notifyPushStatus(
      'error',
      'GitHub Token or Repository not configured. Please open GitHub Settings to complete push.'
    );
    return {
      success: false,
      message: 'GitHub Token or Repository not configured.',
      error: 'NO_CONFIG',
    };
  }

  const [owner, repo] = cfg.repo.trim().split('/');
  const branch = cfg.branch.trim() || 'main';
  const filePath = cfg.filePath.trim() || 'site-content.json';

  notifyPushStatus('pushing', `Pushing updates to GitHub repository ${owner}/${repo}...`);

  try {
    // 1. Fetch current file SHA if exists
    let existingSha: string | undefined = undefined;
    try {
      const getFileRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${cfg.token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      if (getFileRes.status === 200) {
        const fileData = await getFileRes.json();
        existingSha = fileData.sha;
      }
    } catch (e) {
      console.warn('File does not exist on GitHub yet, creating fresh file:', e);
    }

    // 2. Prepare JSON content
    const fullContent = {
      app: 'OHKNEE.COM',
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Admin (onib)',
      action: payload.actionDescription || 'Admin updated text & image',
      content: {
        text: payload.textData,
        images: payload.imageData || {},
        offers: payload.offersData || [],
      },
    };

    const jsonString = JSON.stringify(fullContent, null, 2);
    const contentBase64 = toBase64(jsonString);

    const commitMessage = `[Admin] ${payload.actionDescription || 'Update text and images'} - ${new Date().toLocaleTimeString()}`;

    // 3. Push commit to GitHub
    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: commitMessage,
        content: contentBase64,
        branch,
        ...(existingSha ? { sha: existingSha } : {}),
      }),
    });

    if (putRes.status === 200 || putRes.status === 201) {
      const resData = await putRes.json();
      const commitSha = resData.commit?.sha?.slice(0, 7) || 'committed';
      const commitUrl = resData.commit?.html_url || `https://github.com/${owner}/${repo}`;
      const timeStr = new Date().toLocaleTimeString();

      try {
        localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      } catch {}

      notifyPushStatus('success', `Pushed to GitHub (${branch}) at ${timeStr}! Commit: ${commitSha}`, {
        commitSha,
        commitUrl,
      });

      return {
        success: true,
        message: `Successfully pushed to GitHub branch ${branch}!`,
        commitSha,
        commitUrl,
      };
    } else {
      const errData = await putRes.json().catch(() => ({}));
      const errorMsg = errData.message || `GitHub returned HTTP ${putRes.status}`;
      notifyPushStatus('error', `GitHub push failed: ${errorMsg}`);
      return {
        success: false,
        message: `GitHub push failed: ${errorMsg}`,
        error: errorMsg,
      };
    }
  } catch (err: any) {
    const errorMsg = err?.message || 'Network error pushing to GitHub';
    notifyPushStatus('error', `GitHub push failed: ${errorMsg}`);
    return {
      success: false,
      message: errorMsg,
      error: errorMsg,
    };
  }
}
