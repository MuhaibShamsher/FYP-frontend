import { updateToken } from '@/store/slices/authSlice';

type RefreshResponse = {
  access?: string;
  access_token?: string;
  data?: {
    access?: string;
    access_token?: string;
  };
  success?: boolean;
};


const resolveWsBaseUrl = (): string => {
  const raw = import.meta.env.VITE_WS_BASE_URL as string;
  if (!raw) throw new Error('VITE_WS_BASE_URL is not defined');

  const u = new URL(raw);

  // Normalise protocol — accept http(s) typos from .env
  if (u.protocol === 'http:') u.protocol = 'ws:';
  if (u.protocol === 'https:') u.protocol = 'wss:';

  // Always upgrade to wss when the app itself is on HTTPS
  if (window.location.protocol === 'https:' && u.protocol === 'ws:') {
    u.protocol = 'wss:';
  }

  return u.toString();
};

export const buildAuthedWsUrl = (path: string, accessToken: string | null): string => {
  const baseUrl = resolveWsBaseUrl();
  const url = new URL(path, baseUrl);
  if (accessToken) url.searchParams.set('token', accessToken);
  return url.toString();
};


export async function refreshAccessToken(refreshToken?: string | null): Promise<string | null> {
  if (!refreshToken) return null;

  const apiBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!apiBase) return null;

  const refreshUrl = new URL('auth/token/refresh/', apiBase).toString();

  const res = await fetch(refreshUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!res.ok) return null;

  const json = (await res.json()) as RefreshResponse;
  if (json?.success === false) return null;

  return (
    json?.data?.access_token ??
    json?.data?.access ??
    json?.access_token ??
    json?.access ??
    null
  );
}


let sharedRefreshInFlight: Promise<string | null> | null = null;

export const ensureAccessToken = async (
  dispatch: any,
  getState: () => any,
  opts?: { forceRefresh?: boolean },
): Promise<string | null> => {
  const state = getState() as any;
  const existing = state?.auth?.token as string | null | undefined;

  if (existing && !opts?.forceRefresh) return existing;

  const refreshToken = state?.auth?.refreshToken as string | null | undefined;
  if (!refreshToken) return null;

  if (!sharedRefreshInFlight) {
    sharedRefreshInFlight = refreshAccessToken(refreshToken).finally(() => {
      sharedRefreshInFlight = null;
    });
  }

  const token = await sharedRefreshInFlight;
  if (token) dispatch(updateToken({ token, refreshToken }));
  return token;
};
