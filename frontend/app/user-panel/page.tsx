"use client";
import type { NextPage } from "next";
import UserCard from "@/components/user/UserCard";
import useAxios from "../(utils)/hooks/useAxios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UserDashboardSkeleton } from "@/components/user/skeleton/UserDashboard";

const Home: NextPage = () => {
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
  }
  let api = useAxios();
  let [user, setUser] = useState<User | null>(null);
  let [loading, setLoading] = useState(true);
  let getUserInfo = async () => {
    let response = await api.get("/getUserInfo/");
    if (response.status === 200) {
      setUser(response.data);
      setLoading(false);
    } else {
      toast.error("Error getting user info");
    }
  };
  let verifyMail = async () => {
    toast.loading("Sending Verification Email");
    let response = await api.get("/sendVerificationEmail/");
    if (response.status === 200) {
      toast.success("Verification Email Sent");
    } else {
      toast.error("Error sending verification email");
    }
    toast.dismiss();
  };

  useEffect(() => {
    getUserInfo();
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
  }, [loading]);

  return user === null ? (
    <UserDashboardSkeleton />
  ) : (
    <div className="flex-1 p-6 bg-gray-100">
      <h1 className="lg:text-3xl text-xl font-bold mb-6">User Profile</h1>
      <div className="flex justify-center w-full">
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
          verifyMail={verifyMail}
        />
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">More Information</h2>
        <p className="text-gray-700">
          Here you can add more detailed information about the user.
        </p>
      </div>
    </div>
  );
};

export default Home;
