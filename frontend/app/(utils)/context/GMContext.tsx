"use client";
import { createContext, ReactNode, useState } from "react";

import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface GMContextType {
  authToken: { access: string; refresh: string } | null;
  setAuthToken: Dispatch<
    SetStateAction<{ access: string; refresh: string } | null>
  >;
  logout: () => void;
  baseURL: string;
  progress: number;
  setProgress: Dispatch<SetStateAction<number>>;
  userInfo: {
    id: number;
    name: string;
    email: string;
    phone_no: string;
    user_id: string;
    user_type: string;
    email_verified: boolean;
    phone_verified: boolean;
    p_address: string;
    date_joined: string;
    last_login: string;
    status: boolean;
  } | null;
  setUserInfo: Dispatch<
    SetStateAction<{
      id: number;
      name: string;
      email: string;
      phone_no: string;
      user_id: string;
      user_type: string;
      email_verified: boolean;
      phone_verified: boolean;
      p_address: string;
      date_joined: string;
      last_login: string;
      status: boolean;
    } | null>
  >;
}

export type { GMContextType };

const GMContext = createContext<GMContextType>({
  authToken: null,
  setAuthToken: () => {},
  logout: () => {},
  baseURL: "",
  progress: 0,
  setProgress: () => {},
  userInfo: null,
  setUserInfo: () => {},
});

const GMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  let router = useRouter();
  let [authToken, setAuthToken] = useState<{
    access: string;
    refresh: string;
  } | null>(
    typeof window !== "undefined" && localStorage.getItem("accessToken")
      ? JSON.parse(
          (typeof window !== "undefined" &&
            localStorage.getItem("accessToken")) ||
            "{}"
        )
      : null
  );
  let [userInfo, setUserInfo] = useState<{
    id: number;
    name: string;
    email: string;
    phone_no: string;
    user_id: string;
    user_type: string;
    email_verified: boolean;
    phone_verified: boolean;
    p_address: string;
    date_joined: string;
    last_login: string;
    status: boolean;
  } | null>(
    typeof window !== "undefined" && localStorage.getItem("userInfo")
      ? JSON.parse(
          (typeof window !== "undefined" && localStorage.getItem("userInfo")) ||
            "{}"
        )
      : null
  );

  let [progress, setProgress] = useState(0);

  let userLogout = () => {
    setAuthToken(null);
    typeof window !== "undefined" && localStorage.removeItem("accessToken");
    typeof window !== "undefined" && localStorage.removeItem("userInfo");
    router.push("/auth/login");
  };

  let ContextData: GMContextType = {
    authToken,
    setAuthToken,
    logout: userLogout,
    baseURL: "http://127.0.0.1:8000",
    progress,
    setProgress,
    userInfo,
    setUserInfo,
  };

  return (
    <GMContext.Provider value={ContextData}>{children}</GMContext.Provider>
  );
};

export { GMContext, GMProvider };
