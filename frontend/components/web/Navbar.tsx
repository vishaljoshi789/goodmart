import Image from "next/image";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

export default function Navbar() {
  return (
    <div className="bg-red-700 flex justify-between items-center p-5">
      <div className="flex items-center gap-3">
        {/* <Image
          src="/images/logo.gif"
          alt="Logo"
          sizes="100vw"
          width={0}
          height={0}
          className="bg-white rounded-full w-10 h-10"
        /> */}
        <Link href={`/`} className="text-white font-bold font-carterOne">
          GOODMART
        </Link>
      </div>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <FaUser className="text-red-500" />
          </MenubarTrigger>
          <MenubarContent className="text-red-500">
            <MenubarItem className="hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white">
              Login
            </MenubarItem>
            <MenubarItem className="hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white">
              Register
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem className="hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white">
              Dashboard
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem className="hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white">
              Logout
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
