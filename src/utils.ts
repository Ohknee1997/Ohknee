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

export function getAppDeduplicationKey(offer: {
  name?: string;
  domain?: string;
  id?: string;
  code?: string;
  link?: string;
}): string {
  const name = (offer.name || '').toLowerCase().trim();
  const domain = (offer.domain || '')
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, '')
    .split('/')[0];
  const id = (offer.id || '').toLowerCase();

  // 1. Direct App Alias / Canonical Grouping
  if (name.includes('stake') || domain.includes('stake') || id.includes('stake')) return 'stake';
  if (name.includes('freecash') || domain.includes('freecash') || id.includes('freecash')) return 'freecash';
  if (name.includes('gemsloot') || domain.includes('gemsloot') || id.includes('gemsloot')) return 'gemsloot';
  if (name.includes('polymarket') || domain.includes('polymarket') || id.includes('polymarket')) return 'polymarket';
  if (name.includes('draftking') || domain.includes('draftkings') || id.includes('draftkings')) return 'draftkings';
  if (name.includes('tilt') || id.includes('tilt')) return 'tilt';
  if (name.includes('rebet') || domain.includes('rebet') || id.includes('rebet')) return 'rebet';
  if (name.includes('onyx') || domain.includes('onyx') || id.includes('onyx')) return 'onyx';
  if (name.includes('rip rush') || name.includes('riprush') || id.includes('riprush')) return 'riprush';
  if (name.includes('rip') || domain.includes('rips') || id.includes('rips')) return 'rips';
  if (name.includes('kalshi') || domain.includes('kalshi') || id.includes('kalshi')) return 'kalshi';
  if (name.includes('coinbase') || domain.includes('coinbase') || id.includes('coinbase')) return 'coinbase';
  if (name.includes('crown coin') || name.includes('crowncoin') || domain.includes('crowncoins') || id.includes('crowncoins')) return 'crowncoins';
  if (name.includes('lonestar') || name.includes('lone star') || domain.includes('lonestar') || id.includes('lonestar')) return 'lonestar';
  if (name.includes('modo') || domain.includes('modo') || id.includes('modo')) return 'modo';
  if (name.includes('myprize') || name.includes('my prize') || domain.includes('myprize') || id.includes('myprize')) return 'myprize';
  if (name.includes('zula') || domain.includes('zula') || id.includes('zula')) return 'zula';
  if (name.includes('coins back') || name.includes('coinsback') || name.includes('shopback') || domain.includes('shopback')) return 'coinsback';
  if (name.includes('chumba') || domain.includes('chumba')) return 'chumba';
  if (name.includes('luckyland') || domain.includes('luckyland')) return 'luckyland';
  if (name.includes('pulsz') || domain.includes('pulsz')) return 'pulsz';
  if (name.includes('wow vegas') || name.includes('wowvegas') || domain.includes('wowvegas')) return 'wowvegas';
  if (name.includes('high 5') || name.includes('high5') || domain.includes('high5')) return 'high5';
  if (name.includes('mcluck') || domain.includes('mcluck')) return 'mcluck';
  if (name.includes('fortune coin') || name.includes('fortunecoin') || domain.includes('fortunecoin')) return 'fortunecoins';
  if (name.includes('real prize') || name.includes('realprize') || domain.includes('realprize')) return 'realprize';
  if (name.includes('chanced') || domain.includes('chanced')) return 'chanced';
  if (name.includes('spree') || domain.includes('spree')) return 'spree';
  if (name.includes('sportzino') || domain.includes('sportzino')) return 'sportzino';
  if (name.includes('fliff') || domain.includes('fliff')) return 'fliff';
  if (name.includes('sleeper') || domain.includes('sleeper')) return 'sleeper';
  if (name.includes('dabble') || domain.includes('dabble')) return 'dabble';
  if (name.includes('underdog') || domain.includes('underdog')) return 'underdog';
  if (name.includes('prizepick') || domain.includes('prizepick')) return 'prizepicks';
  if (name.includes('fanduel') || domain.includes('fanduel')) return 'fanduel';
  if (name.includes('betmgm') || domain.includes('betmgm')) return 'betmgm';
  if (name.includes('caesars') || domain.includes('caesars')) return 'caesars';
  if (name.includes('kraken') || domain.includes('kraken')) return 'kraken';
  if (name.includes('gemini') || domain.includes('gemini')) return 'gemini';
  if (name.includes('robinhood') || domain.includes('robinhood')) return 'robinhood';
  if (name.includes('webull') || domain.includes('webull')) return 'webull';
  if (name.includes('sofi') || domain.includes('sofi')) return 'sofi';
  if (name.includes('onepay') || name.includes('one pay') || name.includes('one finance') || domain.includes('one.app')) return 'onepay';
  if (name.includes('koinly') || domain.includes('koinly')) return 'koinly';
  if (name.includes('bydfi') || domain.includes('bydfi')) return 'bydfi';
  if (name.includes('metawin') || domain.includes('metawin')) return 'metawin';
  if (name.includes('fetch') || domain.includes('fetch')) return 'fetch';
  if (name.includes('debbie') || domain.includes('debbie')) return 'debbie';
  if (name.includes('joko') || domain.includes('joko')) return 'joko';
  if (name.includes('snaplii') || domain.includes('snaplii')) return 'snaplii';
  if (name.includes('franki') || domain.includes('franki')) return 'franki';
  if (name.includes('myappfree') || domain.includes('myappfree')) return 'myappfree';
  if (name.includes('aven') || domain.includes('aven')) return 'aven';
  if (name.includes('sendwave') || domain.includes('sendwave')) return 'sendwave';
  if (name.includes('moneylion') || domain.includes('moneylion')) return 'moneylion';
  if (name.includes('swagbucks') || domain.includes('swagbucks')) return 'swagbucks';
  if (name.includes('inboxdollar') || domain.includes('inboxdollars')) return 'inboxdollars';

  // 2. Generic normalized key
  if (domain && domain.length > 3) {
    return domain.split('.')[0];
  }

  const cleaned = name
    .replace(/^(the|join|play|get|download)\s+/i, '')
    .replace(
      /\s+(promo|code|bonus|referral|casino|crypto|app|betting|picks|sports|prediction|predictions|club|free spins|squad|cashback|cash back|finance)\b/gi,
      ''
    )
    .replace(/[^a-z0-9]/g, '');

  return cleaned || offer.id || 'unknown';
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
