"use client";
import { GMContext, GMContextType } from "@/app/(utils)/context/GMContext";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { CiShop } from "react-icons/ci";
const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  let { userInfo } = useContext<GMContextType>(GMContext);
  let options =
    userInfo && userInfo.user_type == "Customer"
      ? [
          { Profile: "/user-panel/", icon: <CgProfile /> },
          { Shop: "/", icon: <CiShop /> },
        ]
      : userInfo && userInfo.user_type == "Product Vendor"
      ? [
          { Profile: "/user-panel/", icon: <CgProfile /> },
          { Products: "/user-panel/vendor/products/", icon: <CiShop /> },
          { Shop: "/", icon: <CiShop /> },
        ]
      : [];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
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
        className={`absolute right-0 a-10 w-64 min-h-screen bg-white flex flex-col items-center justify-center transform ${
          isOpen ? "translate-x-0 block" : "translate-x-full hidden md:flex"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:relative`}
      >
        <div className="w-64 min-h-screen bg-gray-800 text-white">
          <div className="p-4 font-bold text-xl">
            <Link href="/user-panel">User Dashboard</Link>
          </div>
          <div className="mt-6">
            {options.map((option, index) => (
              <Link
                href={Object.values(option)[0]}
                key={index}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer font-extrabold flex gap-2 items-center text-xl border-b"
              >
                <>
                  {Object.values(option)[1]}
                  {Object.keys(option)[0]}
                </>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
