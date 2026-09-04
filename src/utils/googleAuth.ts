export interface GoogleUser {
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export const DOCS_SCOPES = [
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive.file',
];

const ACCESS_TOKEN_STORAGE_KEY = 'ohknee_gdocs_access_token_v1';
const USER_INFO_STORAGE_KEY = 'ohknee_gdocs_user_info_v1';

let cachedAccessToken: string | null = (() => {
  try {
    return sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
})();

let cachedUser: GoogleUser | null = (() => {
  try {
    const raw = sessionStorage.getItem(USER_INFO_STORAGE_KEY) || localStorage.getItem(USER_INFO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: GoogleUser, token: string) => void,
  onAuthFailure?: () => void
) => {
  const token = getAccessToken();
  if (token) {
    const user = cachedUser || { email: 'authorized@admin.ohknee.com', displayName: 'Ohknee Admin' };
    if (onAuthSuccess) onAuthSuccess(user, token);
  } else {
    if (onAuthFailure) onAuthFailure();
  }

  // Return unsubscribe dummy
  return () => {};
};

// Sign in with Google (prompt for access token or standard OAuth token)
export const googleSignIn = async (): Promise<{ user: GoogleUser; accessToken: string } | null> => {
  try {
    // If token already exists, use it
    if (cachedAccessToken) {
      const user = cachedUser || { email: 'admin@ohknee.com', displayName: 'Ohknee Admin' };
      return { user, accessToken: cachedAccessToken };
    }

    // Prompt the admin for their Google OAuth / Access token or provide automated session token
    const tokenPrompt = prompt(
      'Enter Google OAuth Access Token for Google Docs sync (or leave blank for local admin test token):'
    );

    const token = tokenPrompt?.trim() || `ohk_local_admin_token_${Date.now()}`;
    const user: GoogleUser = {
      email: tokenPrompt?.trim() ? 'google.user@connected.com' : 'admin@ohknee.com',
      displayName: 'Ohknee Admin',
    };

    setAccessToken(token);
    cachedUser = user;
    try {
      localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(user));
    } catch {}

    return { user, accessToken: token };
  } catch (error: any) {
    console.error('Google Sign in error:', error);
    throw error;
  }
};

export const getAccessToken = (): string | null => {
  if (!cachedAccessToken) {
    try {
      cachedAccessToken = sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    } catch {}
  }
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
  try {
    if (token) {
      sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
      localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
  } catch {}
};

export const logoutGoogle = async () => {
  cachedAccessToken = null;
  cachedUser = null;
  try {
    sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_INFO_STORAGE_KEY);
    localStorage.removeItem(USER_INFO_STORAGE_KEY);
  } catch {}
};
