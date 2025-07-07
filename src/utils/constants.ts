
export const APP_CONFIG = {
  name: 'HubSpot Analytics Dashboard',
  version: '1.0.0',
  apiTimeout: 30000,
  maxRetries: 3,
  pagination: {
    defaultPageSize: 50,
    maxPageSize: 100,
  },
} as const;

export const HUBSPOT_CONFIG = {
  baseUrl: 'https://api.hubapi.com',
  endpoints: {
    contacts: '/crm/v3/objects/contacts',
    companies: '/crm/v3/objects/companies',
    deals: '/crm/v3/objects/deals',
  },
} as const;

export const UI_CONFIG = {
  debounceMs: 300,
  animationDuration: 200,
  toastDuration: 5000,
} as const;

export const STORAGE_KEYS = {
  hubspotApiKey: 'hubspot_api_key',
  theme: 'app_theme',
  userPreferences: 'user_preferences',
} as const;
