"use client";

import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { useContext, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LinkIcon, Share } from "lucide-react";
import { Share1Icon } from "@radix-ui/react-icons";

export default function Referral() {
  const api = useAxios();
  const { userInfo, setUserInfo } = useContext(GMContext);
  const [referral, setReferral] = useState("");
  const [myReferral, setMyReferral] = useState([]);
  const searchParams = useSearchParams();
  const userID = searchParams.get("id");

  const getUserInfo = async () => {
    const response = await api.get("getUserInfo/");
    console.log(response.data);
    setUserInfo(response.data);
    localStorage.setItem("userInfo", JSON.stringify(response.data));
  };

  const getMyReferral = async () => {
    const response = await api.get(`getMyReferral?id=${userID}`);
    console.log(response.data);
    setMyReferral(response.data);
  };

  useEffect(() => {
    getUserInfo();
    getMyReferral();
  }, [userID]);

  const addReferral = async () => {
    const response = await api.post("addReferral/", { referral });
    if (response.status == 200) {
      toast.success("Referral Added Successfully");
      getUserInfo();
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-5 w-full">
      <div className="flex gap-5 my-2">
        <h1 className="font-extrabold text-2xl text-red-500">Referral</h1>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/referral-share?id=${userInfo?.user_id}`
            );
            toast.success("Link Copied");
          }}
        >
          <LinkIcon />
        </Button>
      </div>

      <div>
        {!userInfo?.referral && (
          <Alert className="bg-yellow-300">
            <AlertTitle>Referral Pending</AlertTitle>
            <AlertDescription>
              Press the button below add your referral.
            </AlertDescription>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="my-2" variant={"secondary"}>
                  Add Referral
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-left">Add Referral</DialogTitle>
                  <DialogDescription className="font-light text-xs text-left">
                    Enter the User ID of the user
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                  <Input
                    type="text"
                    value={referral}
                    onChange={(e) => setReferral(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <Button
                    className="w-fit bg-green-500 hover:bg-green-600"
                    onClick={addReferral}
                  >
                    Add
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </Alert>
        )}
      </div>
      <div className="space-y-2 w-full">
        {userID && userID != userInfo?.user_id && (
          <span>Showing Referral for {userID}</span>
        )}
        {myReferral.map((ref: any) => (
          <Link
            href={`/user-panel/referral?id=${ref.user_id}`}
            key={ref.id}
            className="text-xs md:text-lg bg-gray-100 p-4 rounded-md flex justify-between items-center transition-transform transform hover:scale-105 w-full"
          >
            <span className="md:font-medium">{ref.name}</span>

            <span className="text-gray-600">{ref.user_id}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
