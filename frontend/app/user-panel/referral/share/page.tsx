"use client";
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
import { useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export default function ReferralShare() {
  const api = useAxios();
  const user_id = useSearchParams().get("id");
  const addReferral = async () => {
    const response = await api.post("addReferral/", { referral: user_id });
    if (response.status == 200) {
      toast.success("Referral Added Successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
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
  );
}
