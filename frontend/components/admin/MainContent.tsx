import Link from "next/link";
import React from "react";
import { FaUsers } from "react-icons/fa";
import { AiFillProduct, AiOutlineSafety } from "react-icons/ai";
import { GoGear } from "react-icons/go";

const MainContent: React.FC = () => {
  return (
    <div className="p-4 w-full h-screen">
      <div className="bg-gray-100 shadow-md rounded-lg p-4 w-full h-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-700">
          Welcome to the Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-5">
          <Link
            href={"/securepanel/users"}
            className="card flex flex-col hover:underline bg-white hover:text-gray-700 items-center justify-center p-5 rounded-md shadow-lg hover:shadow-sm transition duration-150 ease-in-out"
          >
            <FaUsers className="text-4xl" />
            <span className="text-xl font-bold">Users</span>
          </Link>
          <Link
            href={"/securepanel/product"}
            className="card flex flex-col hover:underline bg-white hover:text-gray-700 items-center justify-center p-5 rounded-md shadow-lg hover:shadow-sm transition duration-150 ease-in-out"
          >
            <AiFillProduct className="text-4xl" />
            <span className="text-xl font-bold">Products</span>
          </Link>
          <Link
            href={"/securepanel/kyc"}
            className="card flex flex-col hover:underline bg-white hover:text-gray-700 items-center justify-center p-5 rounded-md shadow-lg hover:shadow-sm transition duration-150 ease-in-out"
          >
            <AiOutlineSafety className="text-4xl" />
            <span className="text-xl font-bold">KYC</span>
          </Link>
          <Link
            href={"/securepanel/setting"}
            className="card flex flex-col hover:underline bg-white hover:text-gray-700 items-center justify-center p-5 rounded-md shadow-lg hover:shadow-sm transition duration-150 ease-in-out"
          >
            <GoGear className="text-4xl" />
            <span className="text-xl font-bold">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
