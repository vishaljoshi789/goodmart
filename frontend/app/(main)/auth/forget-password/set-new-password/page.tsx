"use client";
import { Suspense, useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GMContext } from "@/app/(utils)/context/GMContext";

export default function ForgetPassword() {
  let router = useRouter();
  const api = useAxios();
  const [password, setPassword] = useState("");
  const { authToken } = useContext(GMContext);
  console.log(authToken);

  // 2. Define a submit handler.
  let onSubmit = async () => {
    toast.loading("Please wait...");
    console.log("values");
    let response = await api.post(`/update-password/`, { password: password });

    if (response.status == 200) {
      toast.dismiss();
      toast.success("Password changed successfully.");
      router.push(`/auth/login`);
    } else {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Suspense>
      <div className="flex items-center justify-center">
        <div className="md:w-96 m-auto mt-10">
          <span className="font-bold text-red-500 text-2xl underline">
            Forget Password
          </span>
          <div className="flex gap-5 my-10">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              type="password"
            />
            <Button onClick={onSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
