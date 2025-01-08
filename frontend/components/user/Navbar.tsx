"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";

export default function Navbar() {
  let router = useRouter();
  let path = useSearchParams();

  return (
    <div>
      <div className="flex justify-between items-center p-5 gap-20 border-2 border-gray-300 bg-gray-200">
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={`/`}
            className="text-red-600 flex items-center gap-5 font-extrabold font-carterOne text-3xl "
          >
            <Image
              src="/images/logo.gif"
              alt="Logo"
              sizes="100vw"
              width={0}
              height={0}
              className="bg-gray-200 md:w-16 md:h-16 w-10 h-10"
            />
            <span className="">GOODMART</span>
          </Link>
        </div>
        <div className="flex gap-5">
          <Button
            onClick={() => {
              router.back();
            }}
          >
            <IoChevronBackCircleSharp />
          </Button>
          <Link href={`/user-panel`}>
            <Button>
              <MdDashboard />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
