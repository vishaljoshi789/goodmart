import { GMContext, GMContextType } from "@/app/(utils)/context/GMContext";
import { Users } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import { BsBox, BsBox2, BsShop, BsWallet } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { CiShop } from "react-icons/ci";
import { FaShippingFast } from "react-icons/fa";
import { MdBusiness } from "react-icons/md";
import { TbTicket } from "react-icons/tb";

export default function DashboardContent() {
  let { userInfo } = useContext<GMContextType>(GMContext);
  const options =
    userInfo && userInfo.user_type == "Customer"
      ? [
          { Profile: "/user-panel/", icon: <CgProfile /> },
          { Shop: "/", icon: <CiShop /> },
          { Coupon: "/user-panel/coupon/", icon: <TbTicket /> },
          { Wallet: "/user-panel/wallet/", icon: <BsWallet /> },
          { Orders: "/user-panel/orders/", icon: <BsBox2 /> },
          { Referral: "/user-panel/referral/", icon: <Users /> },
        ]
      : userInfo && userInfo.user_type == "Product Vendor"
      ? [
          { Profile: "/user-panel/", icon: <CgProfile /> },
          { Products: "/user-panel/vendor/products/", icon: <BsBox /> },
          { Shop: "/", icon: <CiShop /> },
          { Coupon: "/user-panel/coupon/", icon: <TbTicket /> },
          {
            "Business Details": "/user-panel/vendor/business-details/",
            icon: <MdBusiness />,
          },
          {
            Shipping: "/user-panel/vendor/shipping/",
            icon: <FaShippingFast />,
          },
          { Wallet: "/user-panel/wallet/", icon: <BsWallet /> },
          { Orders: "/user-panel/orders/", icon: <BsBox2 /> },
          { Referral: "/user-panel/referral/", icon: <Users /> },
        ]
      : [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 w-full gap-5 my-10 p-5">
      {options.map((option, index) => {
        return (
          <div key={index} className="w-full">
            <Link
              href={Object.values(option)[0]}
              className="flex w-full flex-col items-center justify-center p-5 text-xl bg-white shadow-lg rounded-lg"
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
