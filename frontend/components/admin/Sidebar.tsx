"use client";
import Link from "next/link";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-gray-800 z-10">
      <button
        className={`absolute md:relative top-5 right-5 z-20 flex flex-col h-10 w-10 border-2 ${
          isOpen ? "border-white" : "border-gray-900"
        } rounded justify-center items-center group md:hidden`}
        onClick={toggleMenu}
      >
        <div
          className={`h-1 w-6 my-1 rounded-full transition ease transform duration-300 ${
            isOpen ? "bg-white rotate-45 translate-y-3" : "bg-black"
          }`}
        />
        <div
          className={`h-1 w-6 my-1 rounded-full transition ease transform duration-300 ${
            isOpen ? "bg-white opacity-0" : "bg-black "
          }`}
        />
        <div
          className={`h-1 w-6 my-1 rounded-full transition ease transform duration-300 ${
            isOpen ? "bg-white -rotate-45 -translate-y-3" : "bg-black "
          }`}
        />
      </button>
      <div
        className={`absolute right-0 a-10 w-fit min-h-screen bg-white flex flex-col items-center justify-center transform${
          isOpen ? "translate-x-0 block" : "translate-x-full hidden md:flex"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:relative`}
      >
        <div className="w-64 min-h-screen bg-gray-800 text-white flex flex-col justify-between">
          <div>
            <div className="p-4 font-bold text-xl">
              <Link href="/securepanel">Admin Dashboard</Link>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Link
                href={"/securepanel/"}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer font-bold"
              >
                <span>Home</span>
              </Link>

              <Link
                href={"/securepanel/users/"}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer font-bold"
              >
                <span>Users</span>
              </Link>

              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-4 py-2 hover:bg-gray-700 cursor-pointer font-bold">
                    Products
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2">
                    <Link
                      href={"/securepanel/product/"}
                      className="px-8 py-2 hover:bg-gray-700 cursor-pointer font-bold"
                    >
                      <span>View Products</span>
                    </Link>
                    <Link
                      href={"/securepanel/product/category"}
                      className="px-8 py-2 hover:bg-gray-700 cursor-pointer font-bold"
                    >
                      <span>Product Categories</span>
                    </Link>
                    <Link
                      href={"/securepanel/product/brand"}
                      className="px-8 py-2 hover:bg-gray-700 cursor-pointer font-bold"
                    >
                      <span>Product Brand</span>
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Link
                href={"/securepanel/kyc"}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer font-bold"
              >
                <span>KYC</span>
              </Link>
              <Link
                href={"/securepanel/setting"}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer font-bold"
              >
                <span>Web Settings</span>
              </Link>
            </div>
          </div>
          <div>
            <div className="mt-6 flex m-5 mb-10">
              <Link
                href={"/securepanel/logout"}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer font-bold bg-blue-500 w-fit rounded-sm"
              >
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
