import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import { logout, updateToken } from '@/store/slices/authSlice';
import type { ApiResponse } from '@/types';

interface RefreshResponse {
  access_token: string;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL as string,
  // credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  // Unified Response Handling
  if (result.data) {
    const response = result.data as ApiResponse;
    
    // Handle success: false cases (even if HTTP status is 200)
    // We only perform JSON unwrapping if it's not a Blob/Binary response
    if (!(result.data instanceof Blob) && response.success === false) {
      return {
        error: {
          status: response.status_code || 400,
          data: response,
        } as FetchBaseQueryError,
      };
    }

    // Automatically unwrap data for successful responses
    if (
      !(result.data instanceof Blob) &&
      Object.prototype.hasOwnProperty.call(response, 'data') &&
      Object.prototype.hasOwnProperty.call(response, 'success')
    ) {
      result.data = response.data;
    }
  }

  // Handle Token Refresh (401 Unauthorized)
  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await rawBaseQuery(
      {
        url: 'auth/token/refresh/',
        method: 'POST',
        body: { refresh: refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const response = refreshResult.data as ApiResponse<RefreshResponse>;
      // Some backends might return just the access token if success is true
      // We handle the structure based on the new standard
      const access_token = response.data?.access_token || (response as any).access;

      if (access_token) {
        api.dispatch(
          updateToken({
            token: access_token,
            refreshToken,
          })
        );
        result = await rawBaseQuery(args, api, extraOptions);
        
        // Re-unwrap the retry result
        if (result.data) {
          const retryResponse = result.data as ApiResponse;
          if (retryResponse.success === false) {
            return {
              error: {
                status: retryResponse.status_code || 400,
                data: retryResponse,
              } as FetchBaseQueryError,
            };
          }
          if (Object.prototype.hasOwnProperty.call(retryResponse, 'data') && 
              retryResponse.success === true) {
            result.data = retryResponse.data;
          }
        }
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Assets',
    'AssetPorts',
    'AssetSummary',
    'Scans',
    'ScanDetails',
    'Statistics',
    'Users',
  ],
  endpoints: () => ({}),
});
