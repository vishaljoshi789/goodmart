"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { GMContext } from "@/app/(utils)/context/GMContext";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmail() {
  let { baseURL } = useContext(GMContext);
  let path = useSearchParams();
  let router = useRouter();
  const user_id = path.get("user_id");
  const [otp, setOtp] = useState<string>("");
  const [resetOTPTimer, setResetOTPTimer] = useState<number>(60);

  const verifyEmail = async () => {
    try {
      let res = await fetch(`${baseURL}/verify-email/${user_id}/${otp}/`);
      let data = await res.json();
      if (res.status === 200) {
        toast.success("Email Verified Successfully");
        router.push(`/auth/login`);
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const resendOTP = async () => {
    const res = await fetch(`${baseURL}/resend-verfication-mail/${user_id}/`);
    if (res.status === 200) {
      toast.success("OTP Sent Successfully");
      setResetOTPTimer(60);
      resetOTPTimerFunc();
    } else {
      toast.error("Something went wrong");
    }
  };

  const resetOTPTimerFunc = () => {
    let interval = setInterval(() => {
      setResetOTPTimer((prev) => prev - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
    }, 60000);
  };

  useEffect(() => {
    if (!user_id) {
      toast.error("Invalid Link");
      router.push(`/`);
    }
  }, []);
  useEffect(() => {
    resetOTPTimerFunc();
  }, []);
  return (
    <div className="flex items-center justify-center w-full h-[90vh] flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Enter Your Verification Code</CardTitle>
          <CardDescription>
            Enter the verification code sent on your Registered Email ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InputOTP maxLength={6} value={otp} onChange={(e) => setOtp(e)}>
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
        <CardFooter className="flex flex-col items-start gap-5">
          <div className="flex justify-between w-full">
            <Button onClick={verifyEmail}>Verify Email</Button>
            <div className="flex gap-2 items-center">
              <Button
                variant={"link"}
                disabled={resetOTPTimer != 0}
                onClick={resendOTP}
              >
                Resend OTP
              </Button>
              <span className="font-bold text-sm text-red-500">
                {resetOTPTimer}
              </span>{" "}
            </div>
          </div>
          <p>The verification code is only valid for 15 minutes</p>
        </CardFooter>
      </Card>
    </div>
  );
}
