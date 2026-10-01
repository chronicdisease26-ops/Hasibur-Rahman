import React, { useEffect } from 'react';
import { SiteSettings } from '../types';

interface AdsterraScriptsProps {
  settings: SiteSettings;
}

export const AdsterraScripts: React.FC<AdsterraScriptsProps> = ({ settings }) => {
  useEffect(() => {
    // Clean up previously injected adsterra scripts
    const existingScripts = document.querySelectorAll('.adsterra-dynamic-injected');
    existingScripts.forEach((el) => el.remove());

    // Inject Popunder script if enabled and code provided
    if (settings.adsterraPopunderEnabled && settings.adsterraPopunderCode) {
      try {
        const container = document.createElement('div');
        container.className = 'adsterra-dynamic-injected';
        container.innerHTML = settings.adsterraPopunderCode;
        
        // Execute inner scripts
        const scripts = container.querySelectorAll('script');
        scripts.forEach((oldScript) => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript);
        });
      } catch (err) {
        console.warn('Adsterra Popunder script mounting error:', err);
      }
    }

    // Inject Social Bar script if enabled
    if (settings.adsterraSocialBarEnabled && settings.adsterraSocialBarCode) {
      try {
        const container = document.createElement('div');
        container.className = 'adsterra-dynamic-injected';
        container.innerHTML = settings.adsterraSocialBarCode;

        const scripts = container.querySelectorAll('script');
        scripts.forEach((oldScript) => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
          newScript.textContent = oldScript.textContent;
          document.body.appendChild(newScript);
        });
      } catch (err) {
        console.warn('Adsterra Social Bar script mounting error:', err);
      }
    }

    return () => {
      const dynamicScripts = document.querySelectorAll('.adsterra-dynamic-injected');
      dynamicScripts.forEach((el) => el.remove());
    };
  }, [
    settings.adsterraPopunderEnabled,
    settings.adsterraPopunderCode,
    settings.adsterraSocialBarEnabled,
    settings.adsterraSocialBarCode,
  ]);

  return null;
};
