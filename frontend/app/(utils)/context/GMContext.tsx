"use client";
import { createContext, ReactNode, useEffect, useState } from "react";

import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { get } from "http";
import useAxios from "../hooks/useAxios";

interface UserInfoType {
  id: number;
  name: string;
  email: string;
  phone_no: string;
  user_id: string;
  user_type: string;
  email_verified: boolean;
  phone_verified: boolean;
  aadhar_verified: boolean;
  pan_verified: boolean;
  p_address: string;
  date_joined: string;
  last_login: string;
  status: boolean;
}

interface AccessTokenType {
  access: string;
  refresh: string;
}

interface GMContextType {
  authToken: AccessTokenType | null;
  setAuthToken: Dispatch<SetStateAction<AccessTokenType | null>>;
  logout: () => void;
  baseURL: string;
  progress: number;
  setProgress: Dispatch<SetStateAction<number>>;
  userInfo: UserInfoType | null;
  setUserInfo: Dispatch<SetStateAction<UserInfoType | null>>;
  // cartCount: number | null;
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
  // cartCount: null,
});

const GMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // let baseURL = "http://192.168.1.5:8000";
  let baseURL = "http://127.0.0.1:8000";

  let router = useRouter();
  let [authToken, setAuthToken] = useState<AccessTokenType | null>(
    typeof window !== "undefined" && localStorage.getItem("accessToken")
      ? JSON.parse(
          (typeof window !== "undefined" &&
            localStorage.getItem("accessToken")) ||
            "{}"
        )
      : null
  );

  let [userInfo, setUserInfo] = useState<UserInfoType | null>(
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

  // let [cartCount, setCartCount] = useState<number | null>(null);
  // let getCartCount = async () => {
  //   let response = await fetch(`${baseURL}/getCartCount/`, {
  //     headers: {
  //       Authorization: `Bearer ${authToken?.access}`,
  //     },
  //   });
  //   if (response.status == 200) {
  //     let data = await response.json();
  //     setCartCount(data.cartCount);
  //   }
  // };
  // useEffect(() => {
  //   if (authToken) {
  //     getCartCount();
  //     console.log("Cart Count Updated");
  //   }
  // }, [authToken]);

  let ContextData: GMContextType = {
    authToken,
    setAuthToken,
    logout: userLogout,
    baseURL,
    progress,
    setProgress,
    userInfo,
    setUserInfo,
    // cartCount,
  };

  return (
    <GMContext.Provider value={ContextData}>{children}</GMContext.Provider>
  );
};

export { GMContext, GMProvider };
