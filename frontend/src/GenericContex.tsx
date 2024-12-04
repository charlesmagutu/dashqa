import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the generic context type
interface GenericContextType<T> {
  selectedItem: T | null;
  setSelectedItem: (item: T | null) => void;
}

// Create the generic context
const GenericContext = createContext<GenericContextType<any> | undefined>(undefined);

// Create the generic provider component
export const GenericProvider = <T,>({ children }: { children: ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  return (
    <GenericContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </GenericContext.Provider>
  );
};

// Create a custom hook for consuming the context
export const useGenericContext = <T,>(): GenericContextType<T> => {
  const context = useContext(GenericContext);
  if (!context) {
    throw new Error('useGenericContext must be used within a GenericProvider');
  }
  return context;
};
