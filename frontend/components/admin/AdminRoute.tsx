"use client";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { GMAdminContext } from "../../app/(utils)/context/GMAdminContext";
import { ReactNode } from "react";
import NotFoundPage from "../web/404";

const AdminRoute = ({ children, ...rest }: { children: ReactNode }) => {
  const router = useRouter();
  const { isAdmin, loading } = useContext(GMAdminContext);

  useEffect(() => {
    if (!isAdmin && !loading) {
      router.push("/");
    }
  }, [loading]);

  return <>{isAdmin ? children : <NotFoundPage />}</>;
};

export default AdminRoute;
