import React, { createContext, useState, useContext } from 'react';

const LockContext = createContext();

export const LockProvider = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <LockContext.Provider value={{ isLocked, setIsLocked }}>
      {children}
    </LockContext.Provider>
  );
};

export const useLock = () => useContext(LockContext);
