/**
 * Auth client stub
 * This is a placeholder for better-auth or your authentication solution
 */

interface SessionData {
  session?: {
    token?: string;
  };
}

interface AuthClient {
  getSession: () => Promise<{ data: SessionData | null }>;
}

/**
 * Stub auth client
 * Replace this with your actual authentication implementation (e.g., better-auth, NextAuth, etc.)
 */
export const authClient: AuthClient = {
  async getSession() {
    // Return null for now - implement actual session retrieval here
    return { data: null };
  },
};
