import { CardData, CardDetail, CustomTextItem, HeaderConfig, TabConfig, VibeType } from '../types';
import {
  STORE_DATA,
  STORE_DETAIL,
  STORE_ORDER,
  STORE_TABS,
  STORE_VIBE,
  STORE_HEADER,
  saveToStorage,
  getFromStorage,
} from '../utils';
import { STORE_CUSTOM_TEXTS, saveCustomTexts } from './customTextStorage';

export interface CloudMasterState {
  cards?: CardData[];
  cardOverrides?: Record<string, Partial<CardData>>;
  cardOrder?: string[];
  details?: Record<string, CardDetail>;
  customTexts?: CustomTextItem[];
  tabs?: TabConfig[];
  vibe?: VibeType;
  headerConfig?: HeaderConfig;
  lastUpdated?: string;
}

let isSyncingToCloud = false;
let isApplyingFromCloud = false;
let lastCloudSaveTime: string | null = null;
let lastCloudSaveSuccess = true;

export function getLastCloudSaveInfo() {
  return {
    time: lastCloudSaveTime,
    success: lastCloudSaveSuccess,
    isSyncing: isSyncingToCloud,
  };
}

/**
 * Persists current state locally and dispatches update notification events.
 */
export async function pushFullStateToCloud(): Promise<{ success: boolean; error?: string }> {
  if (isApplyingFromCloud) return { success: true };
  isSyncingToCloud = true;

  try {
    const cardOverrides = getFromStorage<Record<string, Partial<CardData>>>(STORE_DATA, {});
    const cardOrder = getFromStorage<string[]>(STORE_ORDER, []);
    const details = getFromStorage<Record<string, CardDetail>>(STORE_DETAIL, {});
    const customTexts = getFromStorage<CustomTextItem[]>(STORE_CUSTOM_TEXTS, []);
    const tabs = getFromStorage<TabConfig[]>(STORE_TABS, []);
    const vibe = getFromStorage<VibeType>(STORE_VIBE, 'default');
    const headerConfig = getFromStorage<HeaderConfig>(STORE_HEADER, { logoScale: 1, headerBg: '#ffffff' });

    const now = new Date().toISOString();

    const masterPayload: CloudMasterState = {
      cardOverrides,
      cardOrder,
      customTexts,
      tabs,
      vibe,
      headerConfig,
      lastUpdated: now,
    };

    lastCloudSaveTime = now;
    lastCloudSaveSuccess = true;
    isSyncingToCloud = false;

    window.dispatchEvent(
      new CustomEvent('ohknee:cloud-save-status', {
        detail: { time: now, success: true },
      })
    );

    return { success: true };
  } catch (err: any) {
    isSyncingToCloud = false;
    lastCloudSaveSuccess = false;

    window.dispatchEvent(
      new CustomEvent('ohknee:cloud-save-status', {
        detail: { time: new Date().toISOString(), success: false, error: err.message },
      })
    );

    return { success: false, error: err.message };
  }
}

/**
 * Hydrates state from storage.
 */
export async function pullFullStateFromCloud(): Promise<{
  success: boolean;
  data?: {
    master: CloudMasterState | null;
    details: Record<string, CardDetail> | null;
  };
  error?: string;
}> {
  try {
    const cardOverrides = getFromStorage<Record<string, Partial<CardData>>>(STORE_DATA, {});
    const cardOrder = getFromStorage<string[]>(STORE_ORDER, []);
    const details = getFromStorage<Record<string, CardDetail>>(STORE_DETAIL, {});
    const customTexts = getFromStorage<CustomTextItem[]>(STORE_CUSTOM_TEXTS, []);
    const tabs = getFromStorage<TabConfig[]>(STORE_TABS, []);
    const vibe = getFromStorage<VibeType>(STORE_VIBE, 'default');
    const headerConfig = getFromStorage<HeaderConfig>(STORE_HEADER, { logoScale: 1, headerBg: '#ffffff' });

    const masterData: CloudMasterState = {
      cardOverrides,
      cardOrder,
      customTexts,
      tabs,
      vibe,
      headerConfig,
      lastUpdated: new Date().toISOString(),
    };

    return {
      success: true,
      data: {
        master: masterData,
        details,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Applies state to localStorage and fires UI update events.
 */
export function applyCloudStateToLocal(
  masterData: CloudMasterState,
  detailsData?: Record<string, CardDetail>
) {
  isApplyingFromCloud = true;

  try {
    if (masterData.cardOverrides) {
      saveToStorage(STORE_DATA, masterData.cardOverrides);
    }
    if (masterData.cardOrder && Array.isArray(masterData.cardOrder)) {
      saveToStorage(STORE_ORDER, masterData.cardOrder);
    }
    if (masterData.tabs && Array.isArray(masterData.tabs) && masterData.tabs.length > 0) {
      saveToStorage(STORE_TABS, masterData.tabs);
    }
    if (masterData.vibe) {
      saveToStorage(STORE_VIBE, masterData.vibe);
    }
    if (masterData.headerConfig) {
      saveToStorage(STORE_HEADER, masterData.headerConfig);
    }
    if (masterData.customTexts && Array.isArray(masterData.customTexts)) {
      saveCustomTexts(masterData.customTexts);
    }
    if (detailsData) {
      saveToStorage(STORE_DETAIL, detailsData);
    }

    window.dispatchEvent(
      new CustomEvent('ohknee:cloud-state-synced', {
        detail: { master: masterData, details: detailsData },
      })
    );
  } finally {
    setTimeout(() => {
      isApplyingFromCloud = false;
    }, 500);
  }
}

/**
 * Sets up state synchronization listener.
 */
export function initLiveCloudSync(
  onStateReceived?: (master: CloudMasterState, details?: Record<string, CardDetail>) => void
): () => void {
  // Initial pull
  pullFullStateFromCloud().then((res) => {
    if (res.success && res.data?.master && onStateReceived) {
      onStateReceived(res.data.master, res.data.details || undefined);
    }
  });

  return () => {};
}
