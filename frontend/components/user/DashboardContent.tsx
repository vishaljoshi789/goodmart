import { GMContext, GMContextType } from "@/app/(utils)/context/GMContext";
import Link from "next/link";
import { useContext } from "react";
import { BsBox, BsShop } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { TbTicket } from "react-icons/tb";

export default function DashboardContent() {
  let { userInfo } = useContext<GMContextType>(GMContext);
  const options =
    userInfo && userInfo.user_type == "Customer"
      ? [
          { Shop: "/", icon: <BsShop className="text-4xl" /> },
          {
            Coupen: "/user-panel/coupen/",
            icon: <TbTicket className="text-4xl" />,
          },
        ]
      : userInfo && userInfo.user_type == "Product Vendor"
      ? [
          {
            Products: "/user-panel/vendor/products/",
            icon: <BsBox className="text-4xl" />,
          },
          { Shop: "/", icon: <BsShop className="text-4xl" /> },
          {
            Coupen: "/user-panel/coupen/",
            icon: <TbTicket className="text-4xl" />,
          },
        ]
      : [];
  return (
    <div className="flex w-full gap-10 flex-wrap my-10 p-5">
      {options.map((option, index) => {
        return (
          <div key={index}>
            <Link
              href={Object.values(option)[0]}
              className="flex flex-col items-center justify-center p-5 text-2xl bg-white shadow-lg rounded-lg w-40"
            >
              {Object.values(option)[1]}
              <p>{Object.keys(option)[0]}</p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
