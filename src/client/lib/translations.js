const loggedMissingKeys = new Set();

const t = (key) => {
  if (window.TRUDESK_TRANSLATIONS && window.TRUDESK_TRANSLATIONS[key] !== undefined) {
    return window.TRUDESK_TRANSLATIONS[key];
  }
  
  if (window.TRUDESK_TRANSLATIONS && !loggedMissingKeys.has(key)) {
    loggedMissingKeys.add(key);
    console.warn(`[i18n] Missing translation key: "${key}"`);
  }
  
  return key
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/^\w/, c => c.toUpperCase());
};

export default t;
