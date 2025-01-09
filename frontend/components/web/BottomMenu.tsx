"use client";
import React from "react";
import { IoHomeOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { BiPackage } from "react-icons/bi";
import { GrLocation } from "react-icons/gr";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BottomMenu() {
  let path = usePathname();
  return (
    <div className="fixed bottom-0 w-full text-black z-50 flex items-center lg:hidden bg-red-200 border-y-2 border-gray-300 p-2">
      <ul className="flex justify-evenly w-full ">
        <li
          className={`border-2 ${
            path == "/" ? `border-gray-500` : `border-transparent`
          } rounded-md hover:bg-gray-200 w-24`}
        >
          <Link
            href={"/"}
            className="flex justify-center items-center flex-col"
          >
            <IoHomeOutline className="text-xl" />
            <span className="text-xs">Home</span>
          </Link>
        </li>
        <li
          className={`border-2 ${
            path == "/shop" || path == "/user-panel/shop"
              ? `border-gray-500`
              : `border-transparent`
          } rounded-md hover:bg-gray-200 w-24`}
        >
          <Link
            href={"/user-panel/shop"}
            className="flex justify-center items-center flex-col"
          >
            <GrLocation className="text-xl" />
            <span className="text-xs whitespace-nowrap">Shop</span>
          </Link>
        </li>

        <li
          className={`border-2 ${
            path == "/cart" ? `border-gray-500` : `border-transparent`
          } rounded-md hover:bg-gray-200 w-24`}
        >
          <Link
            href={"/cart"}
            className="flex justify-center items-center flex-col"
          >
            <AiOutlineShoppingCart className="text-xl" />
            <span className="text-xs">Cart</span>
          </Link>
        </li>
        <li
          className={`border-2 ${
            path == "/user-panel/orders"
              ? `border-gray-500`
              : `border-transparent`
          } rounded-md hover:bg-gray-200 w-24`}
        >
          <Link
            href={"/user-panel/orders"}
            className="flex justify-center items-center flex-col"
          >
            <BiPackage className="text-xl" />
            <span className="text-xs">Order</span>
          </Link>
        </li>
        <li
          className={`border-2 ${
            path == "/user-panel" ? `border-gray-500` : `border-transparent`
          } rounded-md hover:bg-gray-200 w-24`}
        >
          <Link
            href={"/user-panel"}
            className="flex justify-center items-center flex-col"
          >
            <FiUser className="text-xl" />
            <span className="text-xs">Account</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
