import type { Config } from 'drizzle-kit';

// Detect which DB URL to use
// Priority:
// 1. DB_LOCAL=true -> local file
// 2. TURSO_DATABASE_URL -> cloud
// 3. Fallback -> local file (safe default if env vars missing)
const url = process.env.DB_LOCAL ? 'file:data/documents.db' : (process.env.TURSO_DATABASE_URL || 'file:data/documents.db');

export default {
    schema: './lib/db/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
    dbCredentials: {
        url,
        authToken: process.env.TURSO_AUTH_TOKEN,
    },
} satisfies Config;