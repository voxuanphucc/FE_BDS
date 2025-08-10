// Environment variables configuration
export const config = {
  // API Configuration
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  
  // App Configuration
  APP_NAME: process.env.REACT_APP_NAME || 'My React App',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Feature Flags
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG: process.env.REACT_APP_ENABLE_DEBUG === 'true',
  
  // External Services
  GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,
  
  // Development
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
};

// Validate required environment variables
export const validateEnvironment = () => {
  const requiredVars = [
    'REACT_APP_API_URL',
  ];

  const missingVars = requiredVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn(
      'Missing required environment variables:',
      missingVars.join(', ')
    );
  }
};

// Export environment check
export const isProduction = config.IS_PRODUCTION;
export const isDevelopment = config.IS_DEVELOPMENT;
