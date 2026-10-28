```javascript
/**
 * Configuration loader that reads environment variables and provides typed constants.
 */

const requiredEnvVars = [
  'PORT',
  'DATABASE_URL',
  'OPENAI_API_KEY',
  // 'CHROME_EXTENSION_ID' is optional
];

// Validate required environment variables at startup
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  databaseUrl: process.env.DATABASE_URL,
  openAiApiKey: process.env.OPENAI_API_KEY,
  chromeExtensionId: process.env.CHROME_EXTENSION_ID || null,
};

export default config;
```