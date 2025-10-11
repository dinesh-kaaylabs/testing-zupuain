import { useState, useCallback, useEffect } from 'react';
import { useAppSelector } from '../redux';
import { useToast } from '../ui/useToast';
import { useLocalStorage } from '../utils/useLocalStorage';

interface AccountSettingsData {
  notifications: {
    emailNotifications: boolean;
    orderUpdates: boolean;
    promotionalEmails: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    allowDataCollection: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'system';
    itemsPerPage: number;
  };
}

const DEFAULT_SETTINGS: AccountSettingsData = {
  notifications: { emailNotifications: true, orderUpdates: true, promotionalEmails: false },
  privacy: { profileVisibility: 'private', allowDataCollection: true },
  security: { twoFactorEnabled: false, loginAlerts: true },
  preferences: { language: 'en', theme: 'system', itemsPerPage: 12 },
};

interface UseAccountSettingsReturn {
  settings: AccountSettingsData;
  loading: boolean;
  hasChanges: boolean;
  updateSetting: <T extends keyof AccountSettingsData>(
    category: T,
    key: keyof AccountSettingsData[T],
    value: AccountSettingsData[T][keyof AccountSettingsData[T]]
  ) => void;
  saveSettings: () => Promise<boolean>;
  resetSettings: () => void;
  toggleTwoFactor: () => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

export const useAccountSettings = (): UseAccountSettingsReturn => {
  const { user } = useAppSelector((state) => state.auth);
  const { success, error } = useToast();
  
  const [localPreferences, setLocalPreferences] = useLocalStorage(
    'userPreferences', 
    DEFAULT_SETTINGS.preferences
  );
  
  const [settings, setSettings] = useState<AccountSettingsData>(DEFAULT_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<AccountSettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      // TODO: API call - await userApi.getSettings();
      await new Promise(resolve => setTimeout(resolve, 300));
      const loaded = { ...DEFAULT_SETTINGS, preferences: localPreferences };
      setSettings(loaded);
      setOriginalSettings(loaded);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load settings';
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user, localPreferences, error]);

  const updateSetting = useCallback(<T extends keyof AccountSettingsData>(
    category: T, 
    key: keyof AccountSettingsData[T], 
    value: AccountSettingsData[T][keyof AccountSettingsData[T]]
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }));
    
    if (category === 'preferences') {
      setLocalPreferences({ ...settings.preferences, [key]: value });
    }
  }, [settings.preferences, setLocalPreferences]);

  const saveSettings = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      // TODO: API call - await userApi.updateSettings(settings);
      await new Promise(resolve => setTimeout(resolve, 500));
      setOriginalSettings(settings);
      success('Settings saved successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save settings';
      error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [settings, success, error]);

  const toggleTwoFactor = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      // TODO: API call - await authApi.toggleTwoFactor(!settings.security.twoFactorEnabled);
      await new Promise(resolve => setTimeout(resolve, 500));
      const newValue = !settings.security.twoFactorEnabled;
      updateSetting('security', 'twoFactorEnabled', newValue);
      success(newValue ? '2FA enabled' : '2FA disabled');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update 2FA';
      error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [settings.security.twoFactorEnabled, updateSetting, success, error]);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    try {
      // TODO: API call - await authApi.changePassword({ currentPassword, newPassword });
      await new Promise(resolve => setTimeout(resolve, 500));
      success('Password changed successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, error]);

  useEffect(() => {
    if (user) loadSettings();
  }, [user]);

  return {
    settings,
    loading,
    hasChanges: JSON.stringify(settings) !== JSON.stringify(originalSettings),
    updateSetting,
    saveSettings,
    resetSettings: () => {
      setSettings(originalSettings);
      setLocalPreferences(originalSettings.preferences);
    },
    toggleTwoFactor,
    changePassword,
  };
};
