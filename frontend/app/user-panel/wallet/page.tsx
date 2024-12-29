"use client";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function Wallet() {
  const api = useAxios();
  const router = useRouter();
  const [balance, setBalance] = React.useState("0");
  const [transactions, setTransactions] = React.useState([]);
  const [passcode, setPasscode] = React.useState("");
  const [passcodeVerified, setPasscodeVerified] = React.useState(false);

  const getWallet = async () => {
    let response = await api.get("/getWallet/");
    console.log(response.data);
    if (response.status === 200) {
      setBalance(response.data.balance);
      setTransactions(response.data.transactions);
      console.log(response.data);
    } else {
      if (response.data.error === "Wallet Not Found") {
        toast.error(response.data.error);
        router.push("/user-panel/wallet/create");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  const verifyPasscode = async () => {
    let response = await api.post("/verifyPasscode/", { passcode });
    if (response.status === 200) {
      setPasscodeVerified(true);
    } else {
      toast.error("Invalid Passcode!");
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-200 p-5">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">My Wallet</h1>
      {passcodeVerified ? (
        <div className="text-center w-full flex flex-col items-center gap-5 my-5">
          <div className="bg-white shadow-xl rounded-lg p-6 mx-auto w-full">
            <div className="text-normal md:text-2xl font-semibold flex justify-between">
              <span className="text-red-500">GOODMART POINTS:</span>
              <span className="text-green-500">
                {parseFloat(balance).toFixed(2)} points
              </span>
            </div>
          </div>
          <div className="bg-white shadow-xl rounded-lg p-6 mx-auto w-full">
            <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
            <ul className="space-y-2">
              {transactions.map((transaction: any) => (
                <li
                  key={transaction.id}
                  className="text-xs md:text-lg bg-gray-100 p-4 rounded-md flex justify-between items-center transition-transform transform hover:scale-105"
                >
                  <span className="md:font-medium">
                    {transaction.description}
                  </span>
                  <span className="text-gray-600">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </span>
                  {transaction.transaction_type == "CREDIT" ? (
                    <span className="md:font-medium text-green-500">
                      +{transaction.amount} points
                    </span>
                  ) : (
                    <span className="md:font-medium text-red-500">
                      -{transaction.amount} points
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <Card className="shadow-xl w-fit mx-auto my-20">
          <CardHeader>
            <CardTitle>Enter Passcode</CardTitle>
            <CardDescription>
              Enter your 6 digit Passcode to access your Wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InputOTP
              maxLength={6}
              value={passcode}
              onChange={(e) => setPasscode(e)}
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
              onClick={verifyPasscode}
            >
              Verify Passcode
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
