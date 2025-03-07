"use client";

import { createContext, useContext, ReactNode } from 'react';

type BrandInfo = {
  name: string;
  chatTitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
};

type BrandContextType = {
  brandInfo: BrandInfo;
  subdomain: string;
};

const defaultBrandInfo: BrandInfo = {
  name: 'Gen8 Agent',
  chatTitle: 'Chat with Gen8',
  primaryColor: 'from-blue-600 to-pink-500',
  secondaryColor: 'bg-pink-500',
  accentColor: 'bg-blue-500',
};

const BrandContext = createContext<BrandContextType>({
  brandInfo: defaultBrandInfo,
  subdomain: 'gen8',
});

export const useBrand = () => useContext(BrandContext);

export const BrandProvider = ({ 
  children, 
  subdomain 
}: { 
  children: ReactNode; 
  subdomain: string;
}) => {
  // Get brand info based on subdomain
  const getBrandInfo = (): BrandInfo => {
    switch(subdomain) {
      case 'gen9':
        return {
          name: 'Gen9 Agent',
          chatTitle: 'Chat with Gen9',
          primaryColor: 'from-purple-600 to-blue-500',
          secondaryColor: 'bg-purple-500',
          accentColor: 'bg-blue-500',
        };
      case 'vonguyen':
        return {
          name: 'Vo Nguyen Agent',
          chatTitle: 'Chat with Vo Nguyen',
          primaryColor: 'from-green-600 to-blue-500',
          secondaryColor: 'bg-green-500',
          accentColor: 'bg-blue-500',
        };
      case 'gaa':
        return {
          name: 'GAA Agent',
          chatTitle: 'Chat with GAA',
          primaryColor: 'from-orange-600 to-red-500',
          secondaryColor: 'bg-orange-500',
          accentColor: 'bg-red-500',
        };
      case 'gen8':
      default:
        return defaultBrandInfo;
    }
  };

  const brandInfo = getBrandInfo();

  return (
    <BrandContext.Provider value={{ brandInfo, subdomain }}>
      {children}
    </BrandContext.Provider>
  );
}; 