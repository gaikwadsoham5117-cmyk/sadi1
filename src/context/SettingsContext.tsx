import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';
import { StoreSettings } from '../../server/types.js';

interface SettingsContextType {
  settings: StoreSettings;
  whatsappNumber: string; // cleaned digits for wa.me link
  formattedWhatsApp: string; // readable e.g. +91 93569 51406
  loading: boolean;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: StoreSettings = {
  adminWhatsAppNumber: '919356951406',
  storeName: 'Virasat Silk & Sarees',
  storeEmail: 'orders@virasatsarees.com',
  storePhone: '+91 93569 51406',
  storeAddress: 'Showroom No. 12, Mahadwar Road, Rajarampuri, Kolhapur, Maharashtra 416012'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function cleanWhatsAppDigits(raw: string): string {
  const digits = (raw || '').replace(/[^0-9]/g, '');
  if (digits.length === 10) return '91' + digits;
  return digits || '919356951406';
}

function formatPhoneDisplay(raw: string): string {
  const digits = cleanWhatsAppDigits(raw);
  if (digits.startsWith('91') && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return raw || '+91 93569 51406';
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.data?.settings) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.warn('Could not load store settings, using defaults', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<boolean> => {
    try {
      const res = await api.updateSettings(newSettings);
      if (res.success && res.data?.settings) {
        setSettings(res.data.settings);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update store settings', err);
      return false;
    }
  };

  const whatsappNumber = cleanWhatsAppDigits(settings.adminWhatsAppNumber);
  const formattedWhatsApp = formatPhoneDisplay(settings.adminWhatsAppNumber);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        whatsappNumber,
        formattedWhatsApp,
        loading,
        updateSettings,
        refreshSettings: fetchSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
