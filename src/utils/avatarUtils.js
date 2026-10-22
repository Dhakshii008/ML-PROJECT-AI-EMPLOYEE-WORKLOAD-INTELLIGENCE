/**
 * Profile Avatar & Image Upload Utility
 * Supports initials fallback avatars with futuristic gradients and validates user photo uploads.
 */

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
export const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Extracts uppercase initials from an employee name.
 * e.g. "Arjun Kumar" -> "AK"
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string' || !name.trim()) return 'EM';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generates an SVG Data URL gradient avatar featuring employee initials.
 */
export function getInitialsAvatar(name) {
  const initials = getInitials(name);
  const cleanName = (name || 'Employee').trim();

  // Curated vibrant cyberpunk / futuristic gradient pairs
  const gradients = [
    { id: 'grad_cyan_indigo', c1: '#06b6d4', c2: '#6366f1' }, // Cyan -> Indigo
    { id: 'grad_violet_pink', c1: '#8b5cf6', c2: '#ec4899' }, // Violet -> Pink
    { id: 'grad_blue_emerald', c1: '#3b82f6', c2: '#10b981' }, // Blue -> Emerald
    { id: 'grad_amber_rose', c1: '#f59e0b', c2: '#ef4444' }, // Amber -> Rose
    { id: 'grad_fuchsia_purple', c1: '#d946ef', c2: '#7c3aed' }, // Fuchsia -> Purple
    { id: 'grad_teal_cyan', c1: '#14b8a6', c2: '#0ea5e9' }, // Teal -> Sky
  ];

  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const grad = gradients[Math.abs(hash) % gradients.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="${grad.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${grad.c1}"/>
        <stop offset="100%" stop-color="${grad.c2}"/>
      </linearGradient>
      <radialGradient id="specular_${grad.id}" cx="35%" cy="25%" r="65%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
        <stop offset="60%" stop-color="#ffffff" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <filter id="glow_${grad.id}" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <rect width="200" height="200" rx="44" fill="url(#${grad.id})"/>
    <rect width="200" height="200" rx="44" fill="url(#specular_${grad.id})"/>
    <rect width="194" height="194" x="3" y="3" rx="41" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2"/>
    <text x="50%" y="54%" font-family="'Outfit', system-ui, -apple-system, sans-serif" font-weight="800" font-size="78" fill="#ffffff" text-anchor="middle" dominant-baseline="middle" letter-spacing="2">
      ${initials}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Validates selected file for type and size.
 * Returns { valid: boolean, error: string | null }
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  // Check extension and MIME type
  const extension = file.name.split('.').pop()?.toLowerCase();
  const isValidExtension = extension && SUPPORTED_EXTENSIONS.includes(extension);
  const isValidMime = SUPPORTED_MIME_TYPES.includes(file.type) || (file.type === '' && isValidExtension);

  if (!isValidExtension || !isValidMime) {
    return {
      valid: false,
      error: 'Please upload a JPG, PNG or WEBP image.'
    };
  }

  // Check file size (max 5 MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Image size must be less than 5 MB.'
    };
  }

  return { valid: true, error: null };
}

/**
 * Reads a File into a Data URL (base64 string).
 */
export function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
