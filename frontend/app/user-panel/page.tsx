"use client";
import type { NextPage } from "next";
import UserCard from "@/components/user/UserCard";
import useAxios from "../(utils)/hooks/useAxios";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { UserDashboardSkeleton } from "@/components/user/skeleton/UserDashboard";
import { GMContext } from "../(utils)/context/GMContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MdError, MdPending } from "react-icons/md";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardContent from "@/components/user/DashboardContent";
import Image from "next/image";
import Advertisement from "@/components/web/Ad";

interface User {
  name: string;
  email: string;
  user_id: string;
  phone_no: string;
  p_address: string;
  date_joined: string;
  last_login: string;
  email_verified: boolean;
  phone_verified: boolean;
  user_type: string;
  VendorInfo: any;
}

const Home: NextPage = () => {
  let { setUserInfo } = useContext(GMContext);
  let api = useAxios();
  let { baseURL } = useContext(GMContext);
  let [user, setUser] = useState<User | null>(null);
  let [loading, setLoading] = useState(true);
  let [profileFound, setProfileFound] = useState(true);

  const [ad, setAd] = useState<any>(null);

  const getAd = async () => {
    const response = await fetch(`${baseURL}/getAdsByPage/User/`);
    const data = await response.json();
    setAd(data);
  };

  let getUserInfo = async () => {
    let response = await api.get("/getUserInfo/");
    if (response.status === 200) {
      console.log(response.data);
      setUser(response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      setUserInfo(response.data);
      setLoading(false);
    } else {
      toast.error("Error getting user info");
    }
  };

  let getUserDetails = async () => {
    let response = await api.get("/getUserDetails/");
    if (response.status === 200) {
      setProfileFound(true);
    } else {
      setProfileFound(false);
    }
  };

  useEffect(() => {
    getUserInfo();
    getUserDetails();
  }, []);

  useEffect(() => {
    let date = document.querySelectorAll(".date");
    date.forEach((e: Element) => {
      const date = new Date((e as HTMLElement).innerText);

      // Options for formatting the date
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
        // second: "2-digit",
      };
      // Convert to a readable format
      const readableDate = date.toLocaleDateString("en-US", options);

      (e as HTMLElement).innerText = readableDate;
    });
    getAd();
  }, [loading]);

  return user === null ? (
    <UserDashboardSkeleton />
  ) : (
    <div className="w-full">
      {user.user_type == "Product Vendor" && !user?.VendorInfo ? (
        <Alert className="bg-red-500 text-white">
          <MdError className="!text-red-900 text-2xl" />
          <AlertTitle className="font-bold">KYC Incomplete</AlertTitle>
          <AlertDescription>
            Complete your KYC to proceed with your Vendor Profile
            <Link className=" ml-10" href="/user-panel/kyc-verification">
              <Button className="bg-white text-red-500 hover:bg-gray-200">
                Complete Your KYC
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      ) : user.user_type == "Product Vendor" &&
        user.VendorInfo.status == "Pending" ? (
        <Alert className="bg-yellow-500 text-white">
          <MdPending className="!text-red-900 text-2xl" />
          <AlertTitle className="font-bold">KYC Pending</AlertTitle>
          <AlertDescription>
            Your KYC is in <b>Pending</b> state, Please wait until your KYC gets
            approved.
          </AlertDescription>
        </Alert>
      ) : user.user_type == "Product Vendor" &&
        user.VendorInfo.status == "Rejected" ? (
        <Alert className="bg-red-500 text-white">
          <MdError className="!text-red-900 text-2xl" />
          <AlertTitle className="font-bold">KYC Rejected</AlertTitle>
          <AlertDescription>
            Your KYC is <b>Rejected</b>
          </AlertDescription>
        </Alert>
      ) : (
        user.VendorInfo &&
        user.VendorInfo.qr == null && (
          <Alert className="bg-yellow-500 text-white">
            <MdError className="!text-red-900 text-2xl" />
            <AlertTitle className="font-bold">
              Vendor Profile Incomplete
            </AlertTitle>
            <AlertDescription>
              Complete your Vendor Profile and add your Shop Info
              <Link
                className=" ml-10"
                href="/user-panel/vendor/business-details"
              >
                <Button className="bg-white text-red-500 hover:bg-gray-200">
                  Complete Your Profile
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )
      )}

      {!profileFound && user.user_type == "Customer" && (
        <Alert className="bg-red-500 text-white">
          <MdError className="!text-red-900 text-2xl" />
          <AlertTitle className="font-bold">Profile Not Completed</AlertTitle>
          <AlertDescription>
            Complete your Profile to place your orders
            <Link className=" ml-10" href="/user-panel/profile">
              <Button className="bg-white text-red-500 hover:bg-gray-200">
                Complete Your Profile
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}
      {ad && ad.image && (
        <Advertisement
          imageUrl={baseURL + ad?.image}
          linkUrl={ad?.link}
          imageAlt={ad?.page}
        />
      )}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="lg:text-3xl text-xl font-bold mb-6">User Profile</h1>
        <div className="flex justify-center w-full h-full gap-10 flex-wrap">
          <UserCard
            name={user.name}
            email={user.email}
            phone_no={user.phone_no}
            username={user.user_id}
            address={user.p_address}
            date_joined={user.date_joined}
            last_login={user.last_login}
            email_verified={user.email_verified}
            phone_verified={user.phone_verified}
          />
          {user.VendorInfo && user.VendorInfo.qr && (
            <>
              <div className="qr bg-gray-600 lg:w-1/3 w-full rounded-lg flex justify-center items-center text-white">
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  src={baseURL + user.VendorInfo.qr}
                  alt="qr code"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="qr bg-white w-full lg:w-1/3 flex justify-center items-center">
                Orders
              </div>
            </>
          )}
        </div>
        <DashboardContent />
      </div>
    </div>
  );
};

export default Home;
