import type { Middleware } from '@reduxjs/toolkit';
import { baseApi } from '@/apis';
import {
  scanStarted,
  scanProgressUpdated,
  scanReset,
} from '../slices/scanSessionSlice';
import { toast } from 'sonner';

let socket: WebSocket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
const RECONNECT_DELAY = 3000;

const getWsUrl = (path: string) => {
  const baseUrl = import.meta.env.VITE_WS_BASE_URL as string;
  if (!baseUrl) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}${path}`;
  }
  return `${baseUrl}${path}`;
};

const closeSocket = () => {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  if (socket) {
    socket.close();
    socket = null;
  }
};

const openSocket = (scanId: string, dispatch: any, getState: () => any) => {
  if (socket || !scanId) return;

  const url = getWsUrl(`/ws/scans/${scanId}/`);
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.debug('[WS-SCAN] Global Socket Connected:', scanId);
  };

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg?.type === 'scan_update' && msg.data) {
        dispatch(scanProgressUpdated(msg.data));

        if (msg.data.status === 'completed') {
          toast.success(`Scan ${scanId} completed`);
          dispatch(
            baseApi.util.invalidateTags(['Assets', 'Scans', 'Statistics'])
          );
          closeSocket();
        } else if (msg.data.status === 'failed') {
          toast.error(`Scan failed: ${msg.data.error || 'Unknown error'}`);
          closeSocket();
        }
      }
    } catch (err) {
      console.error('[WS-SCAN] Parse error:', err);
    }
  };

  socket.onclose = () => {
    console.debug('[WS-SCAN] Global Socket Closed');
    socket = null;

    const state = getState();
    if (
      state.scanSession.isScanning &&
      state.scanSession.scanId === scanId &&
      !reconnectTimeout
    ) {
      reconnectTimeout = setTimeout(() => {
        reconnectTimeout = null;
        openSocket(scanId, dispatch, getState);
      }, RECONNECT_DELAY);
    }
  };

  socket.onerror = (err) => {
    console.error('[WS-SCAN] Global Socket Error:', err);
    toast.error('Real-time connection lost. Try restarting.');
    socket?.close();
  };
};

export const scanSocketMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action: any) => {
    const result = next(action);

    if (scanStarted.match(action)) {
      closeSocket();
      openSocket(action.payload, dispatch, getState);
    }

    if (scanReset.match(action)) {
      closeSocket();
    }

    if (action.type === 'persist/REHYDRATE') {
      setTimeout(() => {
        const state = getState() as any;
        if (state.scanSession?.isScanning && state.scanSession?.scanId) {
          console.debug(
            '[WS-SCAN] Reconnecting to persisted scan:',
            state.scanSession.scanId
          );
          openSocket(state.scanSession.scanId, dispatch, getState);
        }
      }, 100);
    }

    return result;
  };
