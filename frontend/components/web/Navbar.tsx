"use client";
import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useContext } from "react";
import { GMContext } from "@/app/(utils)/context/GMContext";

export default function Navbar() {
  let { authToken, logout } = useContext(GMContext);
  return (
    <div className="bg-red-700 flex justify-between items-center p-5">
      <div className="flex items-center gap-3">
        <Image
          src="/images/logo.gif"
          alt="Logo"
          sizes="100vw"
          width={0}
          height={0}
          className="bg-white rounded-full w-16 h-16"
        />
        <Link
          href={`/`}
          className="text-white font-bold font-carterOne text-2xl"
        >
          GOODMART
        </Link>
      </div>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <FaUser className="text-red-500 text-xl" />
          </MenubarTrigger>

          <MenubarContent className="text-red-500">
            {authToken ? (
              <>
                <MenubarItem className="hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white">
                  <Link href={`/user-panel`} className="w-full">
                    Dashboard
                  </Link>
                </MenubarItem>
                <MenubarItem
                  onClick={logout}
                  className="hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white"
                >
                  Logout
                </MenubarItem>
              </>
            ) : (
              <>
                <MenubarItem className="hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white">
                  <Link href={`/auth/login`} className="w-full">
                    Login
                  </Link>
                </MenubarItem>
                <MenubarItem className="hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white">
                  <Link href={`/auth/register`} className="w-full">
                    Register
                  </Link>
                </MenubarItem>
              </>
            )}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
