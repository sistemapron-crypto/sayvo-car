import React, { useEffect, useState } from 'react';
import { getStoreConfig } from '../../services/storeService';

interface RonimotorsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const RonimotorsLogo: React.FC<RonimotorsLogoProps> = ({
  className = '',
}) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [logoTamanho, setLogoTamanho] = useState(160);

  useEffect(() => {
    getStoreConfig()
      .then((config) => {
        setLogoUrl(config.logoUrl || '');
        setLogoTamanho(config.logoTamanho || 160);
      })
      .catch((error) => {
        console.error('Erro ao carregar logo da loja:', error);
      });
  }, []);

  if (!logoUrl) {
    return null;
  }

  return (
    <div
      className={`flex items-center select-none bg-transparent ${className}`}
      style={{
        width: `${logoTamanho}px`,
        backgroundColor: 'transparent',
      }}
    >
      <img
        src={logoUrl}
        alt="Logo da loja"
        className="w-full h-auto object-contain bg-transparent"
        style={{
          backgroundColor: 'transparent',
        }}
      />
    </div>
  );
};