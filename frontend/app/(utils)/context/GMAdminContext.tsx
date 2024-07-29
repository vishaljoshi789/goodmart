"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import useAxios from "../hooks/useAxios";

interface GMAdminContextType {
  authToken: { access: string; refresh: string } | null;
  setAuthToken: Dispatch<
    SetStateAction<{ access: string; refresh: string } | null>
  >;
  logout: () => void;
  baseURL: string;
  isAdmin: boolean;
  loading?: boolean;
}

export type { GMAdminContextType };

const GMAdminContext = createContext<GMAdminContextType>({
  authToken: null,
  setAuthToken: () => {},
  logout: () => {},
  baseURL: "",
  isAdmin: false,
  loading: true,
});

const GMAdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  let api = useAxios();
  let baseURL = "http://127.0.0.1:8000/admin";
  let router = useRouter();
  let [isAdmin, setIsAdmin] = useState<boolean>(false);
  let [loading, setLoading] = useState<boolean>(true);
  let [authToken, setAuthToken] = useState<{
    access: string;
    refresh: string;
  } | null>(
    JSON.parse(
      (typeof window !== "undefined" && localStorage.getItem("accessToken")) ||
        "{}"
    )
  );

  let isAdminCheck = async () => {
    let response = await api.get(`/admin/isAdmin/`);
    if (response.status === 400) {
      setIsAdmin(false);
    } else {
      setIsAdmin(response.data.is_admin);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authToken) {
      isAdminCheck();
    }
  }, [authToken]);

  let userLogout = () => {
    setAuthToken(null);
    isAdmin = false;
    typeof window !== "undefined" && localStorage.removeItem("accessToken");
    typeof window !== "undefined" && localStorage.removeItem("userInfo");
    router.push("/auth/login");
  };

  let ContextData = {
    authToken,
    setAuthToken,
    logout: userLogout,
    baseURL,
    isAdmin,
    loading,
  };

  return (
    <GMAdminContext.Provider value={ContextData}>
      {children}
    </GMAdminContext.Provider>
  );
};

export { GMAdminContext, GMAdminProvider };
