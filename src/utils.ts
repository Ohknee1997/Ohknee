export const STORE_BUTTON_LABELS = 'ohknee.buttonLabels.v1';
export const STORE_DATA = 'ohknee.editor.cards.v1';
export const STORE_CARDS = STORE_DATA;
export const STORE_ORDER = 'ohknee.editor.order.v1';
export const STORE_CUSTOM = 'ohknee.editor.custom.v1';
export const STORE_TABS = 'ohknee.editor.tabs.v1';
export const STORE_HEADER = 'ohknee.editor.header.v1';
export const STORE_DETAIL = 'ohknee.editor.detail.v1';
export const STORE_VIBE = 'ohk_vibe';

export function getFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore in private browsing, sandbox iframe, or quota limits
  }
}

export function deleteFromStorage(key: string): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.setItem(key, value);
    } catch {
      // safe noop
    }
  },
  removeItem(key: string): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.removeItem(key);
    } catch {
      // safe noop
    }
  },
  getSession(key: string): string | null {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return null;
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setSession(key: string, value: string): void {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return;
      window.sessionStorage.setItem(key, value);
    } catch {
      // safe noop
    }
  },
  removeSession(key: string): void {
    try {
      if (typeof window === 'undefined' || !window.sessionStorage) return;
      window.sessionStorage.removeItem(key);
    } catch {
      // safe noop
    }
  },
};


export function initialsOf(name: string): string {
  return (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}

export function hexToRgbTriplet(hex: string): string | null {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex || '');
  if (!m) return null;
  return `${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)}`;
}

export function tripletToHex(triplet: string): string {
  const p = (triplet || '').split(',').map((n) => {
    return Math.max(0, Math.min(255, parseInt(n, 10) || 0));
  });
  if (p.length !== 3) return '#34d399';
  return '#' + p.map((n) => ('0' + n.toString(16)).slice(-2)).join('');
}

export function copyTextToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => resolve(true))
        .catch(() => fallbackCopy(text, resolve));
    } else {
      fallbackCopy(text, resolve);
    }
  });
}

function fallbackCopy(text: string, resolve: (success: boolean) => void) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    resolve(ok);
  } catch {
    resolve(false);
  }
}
