// Environment variables configuration
export const config = {
  API_URL: (import.meta as any).env?.VITE_API_URL || 'https://bds-be-g9xi.onrender.com/api',
  API_TIMEOUT: Number(((import.meta as any).env?.VITE_API_TIMEOUT) || 10000),

  // App Configuration
  APP_NAME: (import.meta as any).env?.VITE_APP_NAME || 'My React App',
  APP_VERSION: (import.meta as any).env?.VITE_APP_VERSION || '1.0.0',

  // Feature Flags
  ENABLE_ANALYTICS: ((import.meta as any).env?.VITE_ENABLE_ANALYTICS || 'false') === 'true',
  ENABLE_DEBUG: ((import.meta as any).env?.VITE_ENABLE_DEBUG || 'false') === 'true',

  // External Services
  GOOGLE_ANALYTICS_ID: (import.meta as any).env?.VITE_GOOGLE_ANALYTICS_ID,
  SENTRY_DSN: (import.meta as any).env?.VITE_SENTRY_DSN,

  // Development
  MODE: (import.meta as any).env?.MODE || 'development',
  IS_DEVELOPMENT: !!(import.meta as any).env?.DEV,
  IS_PRODUCTION: !!(import.meta as any).env?.PROD,
  IS_TEST: ((import.meta as any).env?.MODE || '').toLowerCase() === 'test',
};

// Validate required environment variables
export const validateEnvironment = () => {
  const requiredVars = ['VITE_API_URL'];

  const envObj = (import.meta as any).env || {};
  const missingVars = requiredVars.filter((varName) => !envObj[varName]);

  if (missingVars.length > 0) {
    console.warn('Missing required environment variables:', missingVars.join(', '));
  }
};

// Export environment check
export const isProduction = config.IS_PRODUCTION;
export const isDevelopment = config.IS_DEVELOPMENT;
