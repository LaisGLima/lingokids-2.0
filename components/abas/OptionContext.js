import React, { createContext, useContext, useState } from 'react';

const OptionContext = createContext();

export const useOption = () => useContext(OptionContext);

export const OptionProvider = ({ children }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleOption = (option) => {
    setSelectedOption(option);
  };

  return (
    <OptionContext.Provider value={{ selectedOption, toggleOption }}>
      {children}
    </OptionContext.Provider>
  );
};
