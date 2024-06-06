import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useContext } from "react";

const LockContext = createContext();

export const LockProvider = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <LockContext.Provider value={{ isLocked, setIsLocked }}>
      {children}
    </LockContext.Provider>
  );
};

export const checkLock = (setIsLocked) => {
  AsyncStorage.getItem("date")
    .then((date) => {
      if (date == new Date().getDate()) {
        return setIsLocked(true);
      }
      AsyncStorage.removeItem("date");
    })
    .catch(() => setIsLocked(false));
};

export const useLock = () => useContext(LockContext);
