import React from 'react';
import { Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // If already installed or browser hasn't prompted, don't display
  if (isInstalled || !isInstallable || variant === 'banner') {
    return null;
  }

  return (
    <button
      onClick={() => install()}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition shadow-xs active:scale-95"
      title="ProMarket ilovasini o'rnatish"
    >
      <Smartphone className="w-4 h-4 text-indigo-600" />
      <span className="hidden sm:inline">Ilovani o'rnatish</span>
      <span className="sm:hidden">Ilova</span>
    </button>
  );
};
