/**
 * Generate a browser fingerprint based on available browser/device characteristics
 * This is a simple implementation - for production, consider using a library like FingerprintJS
 */
export const generateFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let canvasFingerprint = '';

  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
    canvasFingerprint = canvas.toDataURL();
  }

  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvasFingerprint.slice(0, 100),
  };

  // Create a simple hash from the fingerprint object
  const fingerprintString = JSON.stringify(fingerprint);
  return simpleHash(fingerprintString);
};

/**
 * Simple hash function to create a consistent fingerprint
 */
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'fp_' + Math.abs(hash).toString(36) + Date.now().toString(36).slice(-4);
};

/**
 * Get or create browser fingerprint from localStorage
 */
export const getBrowserFingerprint = (): string => {
  const storageKey = 'browser_fingerprint';

  // Try to get existing fingerprint
  let fingerprint = localStorage.getItem(storageKey);

  if (!fingerprint) {
    // Generate new fingerprint
    fingerprint = generateFingerprint();
    localStorage.setItem(storageKey, fingerprint);
  }

  return fingerprint;
};
