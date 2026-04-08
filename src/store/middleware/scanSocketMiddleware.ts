import type { Middleware } from '@reduxjs/toolkit';
import { baseApi } from '../apis/baseApi';
import {
  scanStarted,
  scanProgressUpdated,
  scanReset,
} from '../slices/scanSessionSlice';
import { toast } from 'sonner';

let socket: WebSocket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
const RECONNECT_DELAY = 3000;

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL as string;

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

  const url = `${WS_BASE_URL}/ws/scans/${scanId}/`;
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.debug('[WS] Global Socket Connected:', scanId);
  };

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg?.type === 'scan_update' && msg.data) {
        dispatch(scanProgressUpdated(msg.data));

        // Handle global notifications
        if (msg.data.status === 'completed') {
          toast.success(`Scan ${scanId} completed successfully`);
          dispatch(baseApi.util.invalidateTags(['Assets', 'Scans', 'Statistics']));
          closeSocket();
        } else if (msg.data.status === 'failed') {
          toast.error(`Scan ${scanId} failed: ${msg.data.error || 'Unknown error'}`);
          closeSocket();
        }
      }
    } catch (err) {
      console.error('[WS] Parse error:', err);
    }
  };

  socket.onclose = () => {
    console.debug('[WS] Global Socket Closed');
    socket = null;
    
    // Auto-reconnect if scan is still supposed to be running
    const state = getState();
    if (state.scanSession.isScanning && state.scanSession.scanId === scanId && !reconnectTimeout) {
      reconnectTimeout = setTimeout(() => {
        reconnectTimeout = null;
        openSocket(scanId, dispatch, getState);
      }, RECONNECT_DELAY);
    }
  };

  socket.onerror = (err) => {
    console.error('[WS] Global Socket Error:', err);
    toast.error('Real-time connection failed. Try restarting the scan.');
    socket?.close();
  };
};

export const scanSocketMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action: any) => {
    const result = next(action);

    // Handle scan progression
    if (scanStarted.match(action)) {
      closeSocket();
      openSocket(action.payload, dispatch, getState as any);
    }

    if (scanReset.match(action)) {
      closeSocket();
    }

    // Handle Rehydration (Redux Persist)
    if (action.type === 'persist/REHYDRATE') {
      // Use a timeout to ensure state is fully merged before checking
      setTimeout(() => {
        const state = getState() as any;
        if (state.scanSession?.isScanning && state.scanSession?.scanId) {
          console.debug(
            '[WS] Reconnecting to persisted scan:',
            state.scanSession.scanId
          );
          openSocket(state.scanSession.scanId, dispatch, getState as any);
        }
      }, 200);
    }

    return result;
  };
