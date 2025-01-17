"use client";
import { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { toast } from "sonner";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit, FaLockOpen } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GMContext } from "@/app/(utils)/context/GMContext";

interface User {
  id: number;
  user_id: string;
  email: string;
  phone_no: string;
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
}

const AdminPage: NextPage = () => {
  let api = useAxios();
  const [users, setUsers] = useState<User[]>([]);
  let { setAuthToken } = useContext(GMContext);
  let getUsers = async () => {
    let response = await api.get("/admin/users/");
    if (response.status === 200) {
      setUsers(response.data);
    } else {
      toast.error("Failed to fetch users");
    }
  };
  let login_user = async (userId: number) => {
    let response = await api.get(`/admin/loginUser/${userId}/`);
    if (response.status === 200) {
      setAuthToken(response.data);
      localStorage.setItem("accessToken", JSON.stringify(response.data));
      toast.success("User logged in successfully");
      window.location.href = "/user-panel";
    } else {
      toast.error("Failed to login");
    }
  };
  useEffect(() => {
    getUsers();
    toast.success("Users fetched successfully");
  }, []);

  const handleToggleStatus = async (userId: number) => {
    let response = await api.get(`/admin/toggleUserStatus/${userId}/`);
    if (response.status === 200) {
      toast.success("Status toggled successfully");
      getUsers();
    } else {
      toast.error("Failed to toggle status");
    }
  };

  const handleEdit = (userId: number) => {
    // Implement edit functionality
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDelete = async (userId: number) => {
    let response = await api.get(`/admin/deleteUser/${userId}/`);
    if (response.status === 200) {
      toast.success("User deleted successfully");
      getUsers();
    } else {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="mx-auto p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-r">S.No.</th>
            <th className="py-2 px-4 border-b border-r">User ID</th>
            <th className="py-2 px-4 border-b border-r">Name</th>
            <th className="py-2 px-4 border-b border-r">Email</th>
            <th className="py-2 px-4 border-b border-r">Phone Number</th>
            <th className="py-2 px-4 border-b border-r">Status</th>
            <th className="py-2 px-4 border-b border-r">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.user_id}>
              <td className="py-2 px-4 border-b border-r text-center">
                {index + 1}
              </td>
              <td className="py-2 px-4 border-b border-r text-center">
                {user.user_id}
              </td>
              <td className="py-2 px-4 border-b border-r text-center">
                {user.name}
              </td>
              <td className="py-2 px-4 border-b border-r text-center">
                {user.email}
              </td>
              <td className="py-2 px-4 border-b border-r text-center">
                {user.phone_no}
              </td>
              <td className="py-2 px-4 border-b border-r text-center">
                <Switch
                  checked={user.status ? true : false}
                  onClick={() => handleToggleStatus(user.id)}
                />
              </td>
              <td className="py-2 px-4 border-b flex justify-evenly">
                <Link
                  href={`/securepanel/users/edit?id=${user.id}`}
                  className="px-4 py-2 bg-blue-500 text-white"
                >
                  <FaEdit className="text-xl" />
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger className="px-4 py-2 bg-red-500 text-white">
                    <MdDeleteForever className="text-xl" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger className="px-4 py-2 bg-yellow-500 text-white">
                    <FaLockOpen className="text-xl" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure to login as this user?
                      </AlertDialogTitle>
                      <AlertDialogDescription></AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-green-500"
                        onClick={() => login_user(user.id)}
                      >
                        Login
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Link href={`/securepanel/users/view?id=${user.id}`}>
                  <button className="px-4 py-2 bg-green-500 text-white">
                    <FaRegEye className="text-xl" />
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
