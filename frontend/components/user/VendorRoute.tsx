"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import NotFoundPage from "../web/404";
import { GMContext } from "@/app/(utils)/context/GMContext";

const VendorRoute = ({ children, ...rest }: { children: ReactNode }) => {
  const router = useRouter();
  const { userInfo } = useContext(GMContext);
  let [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }

  return (
    <div>
      {userInfo?.user_type == "Product Vendor" ? children : <NotFoundPage />}
    </div>
  );
};

export default VendorRoute;
