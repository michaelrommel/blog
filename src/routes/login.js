import crypto from 'crypto';
const target = 'https://github.com/login/oauth/authorize';

export async function get() {
  const sessionId = crypto.randomUUID();

  return {
    status: 302,
    headers: {
      location:
        target +
        `?client_id=${import.meta.env.VITE_CLIENT_ID}&state=${sessionId}`
    }
  };
}
