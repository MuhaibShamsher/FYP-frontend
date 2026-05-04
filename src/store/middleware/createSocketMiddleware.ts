import { logout } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import { buildAuthedWsUrl, ensureAccessToken } from './wsAuth';
import type { Middleware, ActionCreatorWithPayload, ActionCreator } from '@reduxjs/toolkit';


export interface SocketMiddlewareConfig {
  // Prefix used in every console.debug/console.error line. e.g.'[WS-SCAN]'
  logPrefix: string;

  
  // The Redux action that triggers socket.open(). Payload MUST be the resource ID (scanId, …).
  openAction: ActionCreatorWithPayload<string>;

  
  // Additional actions besides logout that should close the socket. e.g. [scanReset, clearActiveIds]
  closeActions: ActionCreator<any>[];

  
  // Builds the WS path from the resource ID. e.g. id => /ws/scans/${id}/
  buildPath: (id: string) => string;


  // Called on every non-connection_established message.
  // Return 'close' to tear the socket down after handling, 'keep' to leave it open.
  onMessage: (msg: any, dispatch: any, id: string) => 'close' | 'keep';

  
  // Return true when reconnect should be attempted after a normal (non-4001) close.
  shouldReconnect: (state: any, id: string) => boolean;

  
  // Called when 4001 + token refresh both fail e.g. dispatch => dispatch(scanReset())
  onAuthFailure: (dispatch: any) => void;


  // After redux-persist REHYDRATE, return the ID to reconnect or null.
  // e.g.  state => state.scanSession?.isScanning ? state.scanSession.scanId : null
  getPersistedId: (state: any) => string | null;


  // How long (ms) to wait before a reconnect attempt. Default: 3000
  reconnectDelay?: number;
}


export function createSocketMiddleware(config: SocketMiddlewareConfig): Middleware {
  const {
    logPrefix,
    openAction,
    closeActions,
    buildPath,
    onMessage,
    shouldReconnect,
    onAuthFailure,
    getPersistedId,
    reconnectDelay = 3000,
  } = config;

  let socket: WebSocket | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  const closeSocket = (): void => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    if (socket) {
      socket.close();
      socket = null;
    }
  };

  const openSocket = (id: string, dispatch: any, getState: () => any): void => {
    if (socket || !id) return;

    const token = ((getState() as any)?.auth?.token as string | null) ?? null;
    if (!token) {
      void ensureAccessToken(dispatch, getState).then((refreshed) => {
        if (refreshed) openSocket(id, dispatch, getState);
      });
      return;
    }

    socket = new WebSocket(buildAuthedWsUrl(buildPath(id), token));

    socket.onopen = () => {
      console.debug(`${logPrefix} Connected:`, id);
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data as string);

        // Server always sends this first — nothing to do
        if (msg?.type === 'connection_established') {
          console.debug(`${logPrefix} Established:`, id);
          return;
        }

        const decision = onMessage(msg, dispatch, id);
        if (decision === 'close') closeSocket();
      } catch (err) {
        console.error(`${logPrefix} Parse error:`, err);
      }
    };

    socket.onclose = (event: CloseEvent) => {
      console.debug(`${logPrefix} Closed — code:`, event.code, '| reason:', event.reason);
      socket = null;

      // 4001 = auth failure → attempt token refresh once, then retry or logout
      if (event.code === 4001) {
        void (async () => {
          const refreshed = await ensureAccessToken(dispatch, getState, {
            forceRefresh: true,
          });

          if (refreshed && shouldReconnect(getState(), id)) {
            openSocket(id, dispatch, getState);
            return;
          }

          toast.error('Session expired. Please log in again.');
          dispatch(logout());
          onAuthFailure(dispatch);
          closeSocket();
        })();
        return;
      }

      // Any other close — reconnect if the domain slice still wants this socket
      if (shouldReconnect(getState(), id) && !reconnectTimeout) {
        reconnectTimeout = setTimeout(() => {
          reconnectTimeout = null;
          openSocket(id, dispatch, getState);
        }, reconnectDelay);
      }
    };

    socket.onerror = (err: Event) => {
      console.error(`${logPrefix} Error:`, err);
      toast.error(`${logPrefix} connection lost.`);
      socket?.close();
    };
  };


  const middleware: Middleware = ({ dispatch, getState }) => (next) => (action: any) => {
    const result = next(action);

    if (openAction.match(action)) {
      closeSocket();
      openSocket(action.payload as string, dispatch, getState);
    }

    for (const closeAction of closeActions) {
      const matchFn = (closeAction as any)?.match;
      if (typeof matchFn === 'function' && matchFn(action)) {
        closeSocket();
        break;
      }
    }

    if (logout.match(action)) {
      closeSocket();
    }

    if (action.type === 'persist/REHYDRATE') {
      setTimeout(() => {
        const id = getPersistedId(getState());
        if (id) {
          console.debug(`${logPrefix} Reconnecting to persisted session:`, id);
          openSocket(id, dispatch, getState);
        }
      }, 300);
    }

    return result;
  };

  return middleware;
}
