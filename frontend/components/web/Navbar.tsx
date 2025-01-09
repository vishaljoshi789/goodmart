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
import { useContext, useEffect, useState } from "react";
import { GMContext } from "@/app/(utils)/context/GMContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IoMdCart, IoMdSearch } from "react-icons/io";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter, useSearchParams } from "next/navigation";

export default function Navbar() {
  let router = useRouter();
  let { authToken, logout } = useContext(GMContext);
  let path = useSearchParams();
  let q = path.get("q");
  let [search, setSearch] = useState("");

  return (
    <div>
      <div className="bg-red-700 lg:flex justify-between items-center p-5 gap-20 hidden">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.gif"
            alt="Logo"
            sizes="100vw"
            width={0}
            height={0}
            className="bg-white rounded-full md:w-16 md:h-16 w-10 h-10"
          />
          <Link
            href={`/`}
            className="text-white font-bold font-carterOne text-2xl hidden md:block"
          >
            GOODMART
          </Link>
        </div>
        <form
          className="md:flex hidden items-center bg-white rounded-md shadow-md w-full"
          onSubmit={(e) => {
            e.preventDefault();
            search != "" && router.push(`/products?q=${search}`);
          }}
        >
          <Input
            type="text"
            placeholder="Search your Products"
            className="rounded-r-none w-full"
            name="q"
            defaultValue={q || ""}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            type="submit"
            className="rounded-l-none bg-red-500 hover:bg-red-600"
          >
            <IoMdSearch className="text-xl" />
          </Button>
        </form>
        <div className="flex gap-2 items-center">
          <div className="block md:hidden">
            <Popover>
              <PopoverTrigger className="px-4 py-2 bg-white text-red-500 rounded-md">
                <IoMdSearch className="text-xl" />
              </PopoverTrigger>
              <PopoverContent>
                <form
                  className="flex items-center bg-white rounded-md shadow-md border"
                  onSubmit={(e) => {
                    e.preventDefault();
                    search != "" && router.push(`/products?q=${search}`);
                  }}
                >
                  <Input
                    type="text"
                    placeholder="Search your Products"
                    className="rounded-r-none"
                    name="q"
                    defaultValue={q || ""}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="rounded-l-none bg-red-500 hover:bg-red-600"
                  >
                    <IoMdSearch className="text-xl" />
                  </Button>
                </form>
              </PopoverContent>
            </Popover>
          </div>

          <Link
            href={"/cart"}
            className="text-red-500 bg-white py-2 px-4 rounded-md text-xl flex"
          >
            <IoMdCart />
            {/* {cartCount && (
            <span className="bg-red-500 text-white rounded-full absolute text-xs w-4 h-4 text-center translate-x-3 translate-y-2">
              {cartCount}
            </span>
          )} */}
          </Link>

          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="">
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
      </div>
      <div className="flex gap-3 lg:hidden p-2">
        <div className="flex items-center gap-3">
          <Link href={`/`} className="">
            <Image
              src="/images/logo.gif"
              alt="Logo"
              sizes="100vw"
              width={0}
              height={0}
              className="bg-white md:w-16 md:h-16 w-10 h-10"
            />
          </Link>
        </div>
        <form
          className="flex items-center bg-white rounded-md shadow-md w-full"
          onSubmit={(e) => {
            e.preventDefault();
            search != "" && router.push(`/products?q=${search}`);
          }}
        >
          <Input
            type="text"
            placeholder="Search your Products"
            className="rounded-r-none w-full"
            name="q"
            defaultValue={q || ""}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            type="submit"
            className="rounded-l-none bg-red-500 hover:bg-red-600"
          >
            <IoMdSearch className="text-xl" />
          </Button>
        </form>
      </div>
    </div>
  );
}
