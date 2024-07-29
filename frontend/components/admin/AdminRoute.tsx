"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { GMAdminContext } from "../../app/(utils)/context/GMAdminContext";
import { ReactNode } from "react";

const AdminRoute = ({ children, ...rest }: { children: ReactNode }) => {
  const router = useRouter();
  const { isAdmin, loading } = useContext(GMAdminContext);

  useEffect(() => {
    if (!isAdmin && !loading) {
      router.push("");
    }
  }, [isAdmin]);

  return <div>{isAdmin ? children : null}</div>;
};

export default AdminRoute;
