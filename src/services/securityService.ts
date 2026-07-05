import { supabase } from '../config/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  senderName: string;
  senderEmail: string;
}

export interface StorageConfig {
  bucketName: string;
}

export interface ApiKey {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  lastUsed?: string;
}

export interface ActivityLog {
  id: string;
  type: 'login' | 'config_change' | 'failed_login' | 'api_key_generated' | 'api_key_revoked';
  action: string;
  username?: string;
  ipAddress?: string;
  timestamp: string;
  status: 'success' | 'failure';
  details?: string;
}

// Test Supabase Connection
export const testSupabaseConnection = async (
  url: string,
  anonKey: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('count(*)', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Connection failed' };
  }
};

// Test Storage Connection
export const testStorageConnection = async (
  bucketName: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 1 });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Storage connection failed' };
  }
};

// Test SMTP Connection (backend call)
export const testSMTPConnection = async (config: SMTPConfig): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/test-smtp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });

    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'SMTP test failed' };
  }
};

// Send Test Email
export const sendTestEmail = async (
  recipientEmail: string,
  config: SMTPConfig
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/send-test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientEmail, ...config }),
    });

    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to send test email' };
  }
};

// Generate API Key
export const generateApiKey = async (
  name: string
): Promise<{ success: boolean; key?: string; error?: string }> => {
  try {
    const key = generateSecureKey();
    const response = await fetch('/api/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, key }),
    });

    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to generate API key' };
  }
};

// Revoke API Key
export const revokeApiKey = async (keyId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`/api/api-keys/${keyId}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to revoke API key' };
  }
};

// Get All API Keys
export const getAllApiKeys = async (): Promise<{ success: boolean; keys?: ApiKey[]; error?: string }> => {
  try {
    const response = await fetch('/api/api-keys');
    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch API keys' };
  }
};

// Get Activity Logs
export const getActivityLogs = async (
  filters?: {
    type?: ActivityLog['type'];
    username?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<{ success: boolean; logs?: ActivityLog[]; error?: string }> => {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.username) queryParams.append('username', filters.username);
    if (filters?.startDate) queryParams.append('startDate', filters.startDate);
    if (filters?.endDate) queryParams.append('endDate', filters.endDate);

    const response = await fetch(`/api/activity-logs?${queryParams.toString()}`);
    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch activity logs' };
  }
};

// Change Admin Password
export const changeAdminPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to change password' };
  }
};

// Enable/Disable 2FA
export const toggle2FA = async (enable: boolean): Promise<{ success: boolean; secret?: string; error?: string }> => {
  try {
    const response = await fetch('/api/2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enable }),
    });

    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update 2FA' };
  }
};

// Logout from All Devices
export const logoutAllDevices = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/logout-all-devices', {
      method: 'POST',
    });

    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to logout from all devices' };
  }
};

// Backup Database
export const backupDatabase = async (): Promise<{ success: boolean; backupUrl?: string; error?: string }> => {
  try {
    const response = await fetch('/api/backup', {
      method: 'POST',
    });

    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to create backup' };
  }
};

// Restore Database
export const restoreDatabase = async (backupFile: File): Promise<{ success: boolean; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', backupFile);

    const response = await fetch('/api/restore', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to restore database' };
  }
};

// Helper function to generate secure API key
function generateSecureKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `sk_${result}`;
}

// Save Configuration
export const saveSecurityConfig = async (
  configType: 'supabase' | 'smtp' | 'storage',
  config: any
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/security-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ configType, config }),
    });

    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save configuration' };
  }
};

// Get Configuration
export const getSecurityConfig = async (
  configType: 'supabase' | 'smtp' | 'storage'
): Promise<{ success: boolean; config?: any; error?: string }> => {
  try {
    const response = await fetch(`/api/security-config?type=${configType}`);
    const result = await response.json();
    return result;
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to fetch configuration' };
  }
};
