const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
}

export interface SplitItem {
  participant_wallet: string;
  amount: string;
}

export interface Split {
  id: string;
  tokenAddress: string;
  items: SplitItem[];
  meta: {
    description: string;
  };
  status: 'pending' | 'approved' | 'settled';
  payer: string;
  createdAt: string;
  txHash?: string;
  approvalCount?: number;
  totalApprovals?: number;
}

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Requisição falhou' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async initiateSIWE(): Promise<{ message: string }> {
    return this.request('/auth/siwe/initiate', { method: 'POST' });
  }

  async verifySIWE(message: string, signature: string): Promise<{ token: string }> {
    return this.request('/auth/siwe/verify', {
      method: 'POST',
      body: JSON.stringify({ message, signature }),
    });
  }

  async linkTelegram(username: string): Promise<void> {
    return this.request('/auth/link-telegram', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  }

  // Tokens
  async getTokens(): Promise<Token[]> {
    return this.request('/tokens');
  }

  // Allowances
  async getAllowance(tokenAddress: string): Promise<{ allowance: string }> {
    return this.request(`/users/me/allowance?token=${tokenAddress}`);
  }

  // Splits
  async createSplit(data: {
    tokenAddress: string;
    items: SplitItem[];
    meta: { description: string };
  }): Promise<Split> {
    return this.request('/splits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMySplits(): Promise<Split[]> {
    return this.request('/splits?payer=me');
  }

  async getPendingDebts(): Promise<Split[]> {
    return this.request('/splits?participant=me&status=pending');
  }

  async getAllSplits(): Promise<Split[]> {
    return this.request('/splits?user=me&status=all');
  }

  async getApprovalIntent(splitId: string): Promise<{
    domain: any;
    types: any;
    message: any;
  }> {
    return this.request(`/splits/${splitId}/approve-intent`, { method: 'POST' });
  }

  async submitSignature(splitId: string, signature: string): Promise<void> {
    return this.request(`/splits/${splitId}/signatures`, {
      method: 'POST',
      body: JSON.stringify({ signature }),
    });
  }

  async settleSplit(splitId: string): Promise<{ txHash: string }> {
    return this.request(`/splits/${splitId}/settle`, { method: 'POST' });
  }
}

export const api = new ApiClient();
