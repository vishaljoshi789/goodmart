import { createContext, useState, ReactNode } from "react";

interface ContextType {
  user: {};
  isAuth: boolean;
  setIsAuth: () => void;
  token: string;
  setToken: () => void;
  logout: () => void;
  login: () => void;
  register: () => void;
}

const GMContext = createContext<ContextType | undefined>(undefined);

const GMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  let ContextData = {
    user: {},
    isAuth: false,
    setIsAuth: () => {},
    token: "",
    setToken: () => {},
    logout: () => {},
    login: () => {},
    register: () => {},
  };

  return (
    <GMContext.Provider value={ContextData}>{children}</GMContext.Provider>
  );
};

export { GMContext, GMProvider };
