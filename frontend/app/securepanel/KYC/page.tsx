"use client";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { toast } from "sonner";
import { FaRegEye } from "react-icons/fa";
import Link from "next/link";

const KycPage: NextPage = () => {
  let api = useAxios();
  const [kyc, setKyc] = useState<any>([]);
  let getKycs = async () => {
    let response = await api.get("/admin/getKyc/");
    if (response.status === 200) {
      setKyc(response.data);
    } else {
      toast.error("Failed to fetch users");
    }
  };
  useEffect(() => {
    getKycs();
    toast.success("All KYC fetched successfully");
  }, []);

  const handleToggleStatus = async (id: number, status: string) => {
    let response = await api.put(`/admin/updateKycStatus/${id}/${status}/`);
    if (response.status === 200) {
      toast.success("Status toggled successfully");
      getKycs();
    } else {
      toast.error("Failed to toggle status");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-r">S.No.</th>
            <th className="py-2 px-4 border-b border-r">Firm</th>
            <th className="py-2 px-4 border-b border-r">Description</th>
            <th className="py-2 px-4 border-b border-r">User</th>
            <th className="py-2 px-4 border-b border-r">Status</th>
            <th className="py-2 px-4 border-b border-r">Action</th>
          </tr>
        </thead>
        <tbody>
          {kyc.map((item: any, index: number) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b border-r text-center">
                {index + 1}
              </td>
              <td className="py-2 px-4 border-b border-r text-center">
                {item.firm}
              </td>
              <td className="py-2 px-4 border-b border-r text-center">
                {item.description.length > 50
                  ? item.description.slice(0, 50) + "..."
                  : item.description}
              </td>
              <td className="py-2 px-4 border-b border-r text-center text-blue-500">
                <Link href={`users/view?id=${item.user}`}>View</Link>
              </td>
              <td className="py-2 px-4 border-b border-r text-center border">
                <select
                  name=""
                  id=""
                  defaultValue={item.status}
                  onChange={(e) => handleToggleStatus(item.id, e.target.value)}
                  className="p-2 border"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>

              <td className="py-2 px-4 border-b flex justify-evenly">
                <Link href={`/securepanel/kyc/view?id=${item.id}`}>
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

export default KycPage;
