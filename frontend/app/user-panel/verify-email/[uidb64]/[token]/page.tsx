"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GMContext } from "@/app/(utils)/context/GMContext";

export default function VerifyEmail({
  params,
}: {
  params: { uidb64: string; token: string };
}) {
  let { baseURL } = useContext(GMContext);
  const { uidb64, token } = params;
  let router = useRouter();
  let [status, setStatus] = useState<string>("Verifying Email");

  let verifyEmail = async () => {
    toast.loading("Verifying Email");
    try {
      let response = await fetch(`${baseURL}/verify-email/${uidb64}/${token}`);
      if (response.status == 200) {
        toast.success("Email Verified");
        setStatus("Your Email is successfully Verified!!!");
      } else if (response.status == 400) {
        toast.error("Error verifying email");
        setStatus("Error verifying email");
      } else {
        toast.error("Error verifying email");
        setStatus("Error verifying email");
      }
    } catch (e) {
      toast.error("Invalid Token");
    }
    toast.dismiss();
  };

  useEffect(() => {
    verifyEmail();
  }, []);
  return (
    <div className="flex items-center justify-center w-full h-full flex-col gap-5">
      <span className="text-red-500 font-bold text-xl"> Goodmart</span>
      <span>{status}</span>
    </div>
  );
}
