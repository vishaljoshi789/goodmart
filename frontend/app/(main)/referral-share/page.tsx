"use client";
import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { toast } from "sonner";

export default function ReferralShare() {
  const api = useAxios();
  const { authToken } = useContext(GMContext);
  const router = useRouter();
  const user_id = useSearchParams().get("id");
  const addReferral = async () => {
    const response = await api.post("addReferral/", { referral: user_id });
    if (response.status == 200) {
      toast.success("Referral Added Successfully");
    } else {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    if (!user_id) {
      toast.error("Invalid User ID");
    }
    if (!authToken) {
      router.push(`/auth/register?referral=${user_id}`);
    }
  });

  return (
    authToken && (
      <div className="w-full">
        <Card className="w-fit shadow-2xl mx-auto my-10">
          <CardHeader>
            <CardTitle>Add Referral</CardTitle>
            <CardDescription>User that you want to refer to.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Are Your absolutly sure you want to refer USER ID <b>{user_id}</b>
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={addReferral}>Add Referral</Button>
          </CardFooter>
        </Card>
      </div>
    )
  );
}
