"use client";
import { useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import NotFoundPage from "../web/404";
import { GMContext } from "@/app/(utils)/context/GMContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const VendorRoute = ({ children, ...rest }: { children: ReactNode }) => {
  const { userInfo } = useContext(GMContext);
  let [isMounted, setIsMounted] = useState(false);
  let router = useRouter();

  useEffect(() => {
    if (!userInfo?.VendorInfo) {
      toast.error("Complete your KYC to access your Vendor Profile.");
      router.push("/user-panel/");
    }
    if (userInfo?.VendorInfo && userInfo.VendorInfo.status !== "Approved") {
      toast.warning(`KYC is in ${userInfo.VendorInfo.status} state.`);
      router.push("/user-panel/");
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);
  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full">
      {userInfo?.user_type == "Product Vendor" &&
      userInfo?.VendorInfo &&
      userInfo?.VendorInfo.status == "Approved" ? (
        children
      ) : (
        <NotFoundPage />
      )}
    </div>
  );
};

export default VendorRoute;
