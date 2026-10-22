/**
 * Safe localStorage wrapper with try/catch and error boundary fallback.
 */

export function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window === 'undefined') return defaultValue;
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[AgriSense Storage] Failed to read key "${key}":`, error);
    return defaultValue;
  }
}

export function safeSetItem<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined') return false;
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[AgriSense Storage] Failed to write key "${key}":`, error);
    return false;
  }
}

export function safeRemoveItem(key: string): boolean {
  try {
    if (typeof window === 'undefined') return false;
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[AgriSense Storage] Failed to remove key "${key}":`, error);
    return false;
  }
}

export function safeClearAll(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.warn('[AgriSense Storage] Failed to clear storage:', error);
    return false;
  }
}
