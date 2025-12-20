import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

// Detect which DB URL to use
const url = process.env.TURSO_DATABASE_URL || process.env.VITE_DATABASE_URL || 'file:data/documents.db';

export default {
    schema: './lib/db/schema.ts',
    out: './drizzle',
    driver: 'turso',
    dbCredentials: {
        url: url,
        authToken: process.env.TURSO_AUTH_TOKEN,
    },
} satisfies Config;
