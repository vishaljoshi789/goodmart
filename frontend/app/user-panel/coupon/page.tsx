"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { BsGift } from "react-icons/bs";
import { TbTicket } from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { MdRedeem } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { toast } from "sonner";

export default function Coupon() {
  let [coupons, setCoupons] = useState([]);
  const api = useAxios();
  const getCoupons = async () => {
    let response = await api.get("/getCoupon/");
    // console.log(response.data);
    if (response.status === 200) {
      setCoupons(response.data);
    }
  };
  const redeemCoupon = async (couponCode: string) => {
    let response = await api.post("/redeemCoupon/", { couponCode });
    console.log(response);
    if (response.status === 200) {
      toast.success("Coupon Redeemed!");
    } else {
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };
  useEffect(() => {
    getCoupons();
  }, []);

  return (
    <div className="p-5 w-full">
      <div className="flex justify-between w-full">
        <h1 className="text-red-500 text-2xl font-bold">Your Coupons</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-extrabold bg-green-500 hover:bg-green-700 focus:bg-green-700 flex gap-3">
              <MdRedeem />
              <span>Redeem Coupon</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>Redeem Coupon</DialogTitle>
              <DialogDescription>
                Enter the coupon code to redeem your coupon
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right whitespace-nowrap">
                  Coupon Code
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  placeholder="********"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Redeem</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="coupons flex gap-5 flex-wrap py-5">
        {coupons.map((coupon: any) => (
          <div className="group [perspective:1000px] w-fit" key={coupon.id}>
            <div className="relative w-32 h-32 md:w-40 md:h-40 duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              <div
                className={`absolute inset-0 ${
                  coupon.is_used ? "bg-gray-500" : "bg-blue-500"
                } text-white flex items-center justify-center rounded-lg [backface-visibility:hidden]`}
              >
                <BsGift className="text-4xl" />
              </div>

              <div className="absolute inset-0 bg-green-500 flex flex-col justify-evenly items-center p-3 rounded-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <span
                  className="bg-gray-200 md:p-2 h-fit text-xs cursor-pointer"
                  onClick={(e) => {
                    navigator.clipboard.writeText(coupon.code);
                    toast.success("Code Copied!");
                  }}
                >
                  {coupon.code}
                </span>
                <TbTicket className="text-4xl md:text-9xl text-white" />
                <Dialog>
                  <DialogTrigger className="bg-white text-black rounded-lg shadow-xl p-2  duration-200 hover:shadow-md">
                    Details
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{coupon.title}</DialogTitle>
                      <DialogDescription>
                        {coupon.description}

                        <br />
                      </DialogDescription>
                      <br />
                      <div>
                        Valid Till:{" "}
                        {new Date(coupon.expiry_date).toLocaleDateString()}
                      </div>
                      {coupon.is_used && (
                        <div className="text-red-500">Coupon Used</div>
                      )}
                      {coupon.type == "REDEEMABLE" && (
                        <DialogClose
                          className="bg-green-500 hover:bg-green-700 mt-5 text-primary-foreground shadow h-9 px-4 py-2 w-fit inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                          onClick={() => redeemCoupon(coupon.code)}
                        >
                          Redeem
                        </DialogClose>
                      )}
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
