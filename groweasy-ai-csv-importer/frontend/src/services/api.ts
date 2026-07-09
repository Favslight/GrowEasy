import type { ImportResponse } from '@/types/csv';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const parseErrorMessage = async (response: Response): Promise<string> => {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;
  return payload?.message ?? 'The server could not process this request. Please try again.';
};

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    let response: Response;
    try {
      response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      throw new Error('Unable to reach the server. Check your connection and API URL.');
    }

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }

    return response.json() as Promise<T>;
  },

  post: async <T>(endpoint: string, data: unknown): Promise<T> => {
    let response: Response;
    try {
      response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      throw new Error('Unable to reach the server. Check your connection and API URL.');
    }

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }

    return response.json() as Promise<T>;
  },
};

export const importCsv = async (file: File): Promise<ImportResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/import`, {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw new Error('Network error — unable to reach the API. Verify the backend is running and NEXT_PUBLIC_API_URL is correct.');
  }

  const payload = (await response.json().catch(() => null)) as
    | ImportResponse
    | { success: false; message: string }
    | null;

  if (!response.ok || !payload || payload.success !== true) {
    const message =
      payload && 'message' in payload && payload.message
        ? payload.message
        : response.status === 503
          ? 'AI service is not configured on the server. Contact your administrator.'
          : 'The server could not process this file. Please try again.';
    throw new Error(message);
  }

  return payload;
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get<{ status: string }>('/health');
    return response.status === 'ok';
  } catch {
    return false;
  }
};
