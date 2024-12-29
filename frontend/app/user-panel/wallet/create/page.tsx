"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreateWallet() {
  const api = useAxios();
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const handleChange = (e: any) => {
    setPasscode(e);
  };
  const getWallet = async () => {
    let response = await api.get("/getWallet/");
    console.log(response);
    if (response.status === 200) {
      //   console.log(response.data);
      router.push("/user-panel/wallet");
    }
  };

  const createWallet = async () => {
    let response = await api.post("/createWallet/", { passcode });
    if (response.status === 200) {
      router.push("/user-panel/wallet");
    } else {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col gap-5 w-full items-center pt-24">
      <h2 className="text-2xl font-extrabold text-gray-700">Create Wallet</h2>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Enter Passcode</CardTitle>
          <CardDescription>
            Set a 6 digit Passcode for your Wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InputOTP
            maxLength={6}
            value={passcode}
            onChange={(e) => handleChange(e)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </CardContent>
        <CardFooter>
          <Button
            className="bg-green-500 hover:bg-green-600 shadow-xl hover:shadow-md"
            onClick={createWallet}
          >
            Create Wallet
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
