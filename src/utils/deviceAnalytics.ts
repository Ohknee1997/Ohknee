import { getFromStorage, saveToStorage } from '../utils';
import { logActivity } from './activityLogger';
import { logTrafficEvent } from './trafficTracker';

export const STORE_DEVICE_VISITORS = 'ohknee_device_visitors_analytics_v1';
export const STORE_CURRENT_DEVICE_ID = 'ohknee_current_device_id_v2';

export interface DeviceClickEvent {
  target: string;
  tag: string;
  text?: string;
  context?: string;
  timestamp: string;
}

export interface DeviceVisitorRecord {
  deviceId: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  platform: string;
  screenResolution: string;
  firstSeen: string;
  lastSeen: string;
  totalClicks: number;
  clicks: DeviceClickEvent[];
  guestbookSignature?: {
    slot: number;
    name: string;
    signedAt: string;
  };
  visitedTabs: Record<string, number>;
  clickedOffers: Record<string, number>;
  clickedSocials: Record<string, number>;
}

// Generate or retrieve persistent unique device ID
export function getOrCreateDeviceId(): string {
  try {
    let devId = localStorage.getItem(STORE_CURRENT_DEVICE_ID);
    if (!devId) {
      const screenInfo = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'unknown';
      const userAgentSnippet = typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 20) : '';
      const randomPart = Math.random().toString(36).substring(2, 9);
      const hash = btoa(`${screenInfo}_${userAgentSnippet}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
      devId = `dev_${Date.now().toString(36)}_${hash}_${randomPart}`;
      localStorage.setItem(STORE_CURRENT_DEVICE_ID, devId);
    }
    return devId;
  } catch {
    return 'dev_' + Math.random().toString(36).substring(2, 10);
  }
}

// Detect hardware/device platform
function detectDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  const ua = navigator.userAgent || '';
  if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua) || (width >= 640 && width < 1024)) {
    return 'tablet';
  }
  if (/Mobi|Android|iPhone|iPod/i.test(ua) || width < 640) {
    return 'mobile';
  }
  return 'desktop';
}

function detectBrowser(): string {
  if (typeof navigator === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Edge') || ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Web Browser';
}

// Get all tracked device visitors
export function getAllDeviceVisitors(): Record<string, DeviceVisitorRecord> {
  return getFromStorage<Record<string, DeviceVisitorRecord>>(STORE_DEVICE_VISITORS, {});
}

// Get or register current device visitor record
export function getOrCreateCurrentDevice(): DeviceVisitorRecord {
  const deviceId = getOrCreateDeviceId();
  const all = getAllDeviceVisitors();

  if (all[deviceId]) {
    const existing = all[deviceId];
    existing.lastSeen = new Date().toISOString();
    all[deviceId] = existing;
    saveToStorage(STORE_DEVICE_VISITORS, all);
    return existing;
  }

  const newRecord: DeviceVisitorRecord = {
    deviceId,
    deviceType: detectDeviceType(),
    browser: detectBrowser(),
    platform: typeof navigator !== 'undefined' ? navigator.platform || 'unknown' : 'unknown',
    screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'unknown',
    firstSeen: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    totalClicks: 0,
    clicks: [],
    visitedTabs: { hero: 1 },
    clickedOffers: {},
    clickedSocials: {},
  };

  all[deviceId] = newRecord;
  saveToStorage(STORE_DEVICE_VISITORS, all);
  return newRecord;
}

// Record a click event for the active device
export function recordDeviceClick(clickInfo: {
  targetId?: string;
  targetTag?: string;
  text?: string;
  context?: string;
}): void {
  try {
    const deviceId = getOrCreateDeviceId();
    const all = getAllDeviceVisitors();
    const device = all[deviceId] || getOrCreateCurrentDevice();

    const timestamp = new Date().toISOString();
    const cleanText = (clickInfo.text || '').trim().slice(0, 60);
    const target = clickInfo.targetId || clickInfo.targetTag || 'element';

    const clickEvent: DeviceClickEvent = {
      target,
      tag: clickInfo.targetTag || 'click',
      text: cleanText || undefined,
      context: clickInfo.context || window.location.pathname,
      timestamp,
    };

    device.totalClicks = (device.totalClicks || 0) + 1;
    device.lastSeen = timestamp;
    
    // Maintain up to 200 most recent click records per device
    device.clicks = [clickEvent, ...(device.clicks || [])].slice(0, 200);

    // Track specific social or offer interactions
    if (target.includes('phone-app-btn-')) {
      const socialId = target.replace('phone-app-btn-', '');
      device.clickedSocials = device.clickedSocials || {};
      device.clickedSocials[socialId] = (device.clickedSocials[socialId] || 0) + 1;
    }

    if (clickInfo.context && clickInfo.context.startsWith('tab:')) {
      const tabName = clickInfo.context.replace('tab:', '');
      device.visitedTabs = device.visitedTabs || {};
      device.visitedTabs[tabName] = (device.visitedTabs[tabName] || 0) + 1;
    }

    all[deviceId] = device;
    saveToStorage(STORE_DEVICE_VISITORS, all);

    // Also dispatch event for live listeners
    window.dispatchEvent(new CustomEvent('ohknee:device_click', { detail: { deviceId, click: clickEvent } }));
  } catch (err) {
    console.error('Error recording device click:', err);
  }
}

// Record a guestbook signature associated with the unique device
export function recordDeviceSignature(slot: number, name: string): void {
  try {
    const deviceId = getOrCreateDeviceId();
    const all = getAllDeviceVisitors();
    const device = all[deviceId] || getOrCreateCurrentDevice();

    const signedAt = new Date().toISOString();
    device.guestbookSignature = {
      slot,
      name,
      signedAt,
    };
    device.lastSeen = signedAt;

    all[deviceId] = device;
    saveToStorage(STORE_DEVICE_VISITORS, all);

    // Log to Master Audit Activity Log
    logActivity({
      eventType: 'button_click',
      fieldId: `guestbook_slot_${slot}`,
      fieldName: `Guestbook Signed (Line #${slot})`,
      value: `Signed by: "${name}" on Device: ${deviceId}`,
      context: 'Notebook Paper Register',
      username: name,
    });

    // Log to traffic tracker
    logTrafficEvent('click_link', {
      offerName: 'Guestbook Signature',
      promoCode: `Slot #${slot}: ${name}`,
      tabId: 'guestbook',
    });

    window.dispatchEvent(new CustomEvent('ohknee:device_signed', { detail: { deviceId, slot, name } }));
  } catch (err) {
    console.error('Error recording device signature:', err);
  }
}

// Global click tracking initialization
let isGlobalTrackerInitialized = false;

export function initGlobalDeviceTracker(): void {
  if (typeof window === 'undefined' || isGlobalTrackerInitialized) return;
  isGlobalTrackerInitialized = true;

  // Initialize device profile on startup
  getOrCreateCurrentDevice();

  window.addEventListener(
    'click',
    (e: MouseEvent) => {
      try {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // Find nearest clickable ancestor or element itself
        const interactive = target.closest('button, a, input, select, textarea, [role="button"], [id]') as HTMLElement | null;
        const elem = interactive || target;

        const targetId = elem.id || undefined;
        const targetTag = elem.tagName.toLowerCase();
        const text = (elem.innerText || elem.getAttribute('aria-label') || elem.getAttribute('title') || '').trim();

        // Avoid logging repeated click noise from the device tracker itself
        if (targetId?.includes('ignore-tracking')) return;

        recordDeviceClick({
          targetId,
          targetTag,
          text: text.length > 50 ? text.slice(0, 50) + '...' : text,
          context: document.title || window.location.pathname,
        });
      } catch {}
    },
    { capture: true, passive: true }
  );
}
