"use client";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: number;
  user_id: string;
  email: string;
  phone_no: string;
  email_verified: boolean;
  phone_verified: boolean;
  name: string;
  dob: string;
  gender: string;
  mother: string;
  father: string;
  pan_certificate: string;
  aadhar_certificate: string;
  bank_certificate: string;
  pan: string;
  aadhar: string;
  bank_account: string;
  bank: string;
  ifsc: string;
  account_holder: string;
  payment: number;
  payment_mode: string;
  payment_detail: string;
  payment_date: string;
  green_date_time: string;
  nop: number;
  nopp: number;
  ewallet: number;
  level: number;
  sponsor: string;
  parent: string;
  position: number;
  parents: string;
  child: number;
  donation: number;
  p_address: string;
  landmark: string;
  category: string;
  pan_approve: number;
  epin: string;
  status: number;
  otp: number;
  otp_verified: number;
  token: string;
  passcode: number;
  pass_otp: number;
  pass_verified: number;
  verify_datetime: string;
  business_updated: number;
  last_login: string;
  ip_add: string;
  user_type: string;
  added_on: string;
  modify_on: string;
  modify_by: number;
  p_pin: string;
  city: string;
  state: string;
  photograph: string;
  gst: string;
  notice: number;
  joining_product: number;
  login_status: number;
  login_token: string;
  ip_address: string;
  login_otp: string;
  asso_with: string;
  asso_left: string;
  asso_right: string;
  asso_direct: string;
  pre_asso_list: string;
  left_points: number;
  right_points: number;
  bb_points: number;
  product_capping: number;
  wallet_status: boolean;
  date_joined: string;
}

export default function UserView() {
  let api = useAxios();
  let path = useSearchParams();
  let id = path.get("id");
  let [user, setUser] = useState<User | null>(null);
  let [loading, setLoading] = useState(true);
  let getUser = async () => {
    toast.loading("Loading User Details...");
    let response = await api.get(`/admin/getUser/${id}`);
    if (response.status === 200) {
      setUser(response.data);
      toast.success("User Details Loaded Successfully");
    } else {
      toast.error("Failed to fetch user");
    }
    toast.dismiss();
    setLoading(false);
  };
  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    dateTime();
  }, [loading]);
  let dateTime = () => {
    let date = document.querySelectorAll(".date");
    date.forEach((e) => {
      const date = new Date((e as HTMLElement).innerText);

      // Options for formatting the date
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      // Convert to a readable format
      const readableDate = date.toLocaleDateString("en-US", options);

      (e as HTMLElement).innerText = readableDate;
    });
  };
  return (
    <div>
      {user && (
        <div className="bg-white overflow-hidden shadow rounded-lg border">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              User Profile ID - {id}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500"></p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.name}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.email} {user.email_verified ? "✅" : "❌"}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Phone number
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.phone_no} {user.phone_verified ? "✅" : "❌"}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {/* {user.address.street_address}, {user.address.city} */}
                  <br />
                  {/* {user.address.state}, {user.address.zip_code} */}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.user_type}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.gender}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.status ? "✅" : "❌"}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Date Joined
                </dt>
                <dd className="date mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.date_joined}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Last Login
                </dt>
                <dd className="date mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user.last_login}
                </dd>
              </div>
              {/* {user.user.role == "Vendor" && ( */}
              <>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Store Name
                  </dt>
                  <dd className=" mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {/* {user.store_name} */}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Store Description
                  </dt>
                  <dd className=" mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {/* {user.store_description} */}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">GST</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {/* {user.gst} */}
                  </dd>
                </div>
                <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Aadhar</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {/* {user.aadhar} */}
                  </dd>
                </div>
              </>
              {/* )} */}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
