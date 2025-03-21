"use client";
import { createContext, ReactNode, useState } from "react";

import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

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
  referral: any;
  VendorInfo: any;
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
  cartCount: number | null;
  getCartCount: () => void;
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
  cartCount: null,
  getCartCount: () => {},
});

const GMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

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

  let [cartCount, setCartCount] = useState<number | null>(null);

  let userLogout = () => {
    setAuthToken(null);
    typeof window !== "undefined" && localStorage.removeItem("accessToken");
    typeof window !== "undefined" && localStorage.removeItem("userInfo");
    router.push("/auth/login");
  };

  let getCartCount = async () => {
    if (authToken) {
      let response = await fetch(`${baseURL}/getCartCount/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken.access}`,
        },
      });
      if (response.status == 200) {
        let data = await response.json();
        setCartCount(data.cartCount);
      }
    }
  };

  let ContextData: GMContextType = {
    authToken,
    setAuthToken,
    logout: userLogout,
    baseURL,
    progress,
    setProgress,
    userInfo,
    setUserInfo,
    cartCount,
    getCartCount,
  };

  return (
    <GMContext.Provider value={ContextData}>{children}</GMContext.Provider>
  );
};

export { GMContext, GMProvider };
