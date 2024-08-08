"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import NotFoundPage from "../web/404";
import { GMContext } from "@/app/(utils)/context/GMContext";

const AuthRoute = ({ children, ...rest }: { children: ReactNode }) => {
  let router = useRouter();
  const { authToken } = useContext(GMContext);
  let [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (!authToken) {
      router.push("/auth/login");
    }
  }, []);
  if (!isMounted) {
    return null;
  }

  return <div>{authToken ? children : <NotFoundPage />}</div>;
};

export default AuthRoute;
