import { Button } from "@/components/ui/button";
import React from "react";
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
} from "@/components/ui/dialog";
import { MdRedeem } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function Coupon() {
  return (
    <div className="p-5 w-full">
      <div className="flex justify-between w-full">
        <h1 className="text-red-500 text-2xl font-bold">Your Coupons</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="font-extrabold text-lg bg-green-500 hover:bg-green-700 focus:bg-green-700 flex gap-3">
              <MdRedeem className="text-2xl" />
              <span>Redeem Coupon</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
        <div className="group [perspective:1000px] w-fit">
          {/* Card wrapper */}
          <div className="relative w-20 h-20 md:w-40 md:h-40 duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front of the card */}
            <div className="absolute inset-0 bg-blue-500 text-white flex items-center justify-center rounded-lg [backface-visibility:hidden]">
              <BsGift className="text-2xl" />
            </div>

            {/* Back of the card */}
            <div className="absolute inset-0 bg-green-500 flex flex-col justify-evenly items-center p-3 rounded-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <span className="bg-gray-200 md:p-2 h-fit">ABCDEFG</span>
              <TbTicket className="text-4xl md:text-9xl text-white" />
            </div>
          </div>
        </div>
        <div className="group [perspective:1000px] w-fit">
          {/* Card wrapper */}
          <div className="relative w-20 h-20 md:w-40 md:h-40 duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front of the card */}
            <div className="absolute inset-0 bg-blue-500 text-white flex items-center justify-center rounded-lg [backface-visibility:hidden]">
              <BsGift className="text-2xl" />
            </div>

            {/* Back of the card */}
            <div className="absolute inset-0 bg-green-500 flex flex-col justify-evenly items-center p-3 rounded-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <span className="bg-gray-200 md:p-2 h-fit">ABCDEFG</span>
              <TbTicket className="text-4xl md:text-9xl text-white" />
            </div>
          </div>
        </div>
        <div className="group [perspective:1000px] w-fit">
          {/* Card wrapper */}
          <div className="relative w-20 h-20 md:w-40 md:h-40 duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front of the card */}
            <div className="absolute inset-0 bg-blue-500 text-white flex items-center justify-center rounded-lg [backface-visibility:hidden]">
              <BsGift className="text-2xl" />
            </div>

            {/* Back of the card */}
            <div className="absolute inset-0 bg-green-500 flex flex-col justify-evenly items-center p-3 rounded-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <span className="bg-gray-200 md:p-2 h-fit">ABCDEFG</span>
              <TbTicket className="text-4xl md:text-9xl text-white" />
            </div>
          </div>
        </div>
        <div className="group [perspective:1000px] w-fit">
          {/* Card wrapper */}
          <div className="relative w-20 h-20 md:w-40 md:h-40 duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front of the card */}
            <div className="absolute inset-0 bg-blue-500 text-white flex items-center justify-center rounded-lg [backface-visibility:hidden]">
              <BsGift className="text-2xl" />
            </div>

            {/* Back of the card */}
            <div className="absolute inset-0 bg-green-500 flex flex-col justify-evenly items-center p-3 rounded-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <span className="bg-gray-200 md:p-2 h-fit">ABCDEFG</span>
              <TbTicket className="text-4xl md:text-9xl text-white" />
            </div>
          </div>
        </div>
        <div className="group [perspective:1000px] w-fit">
          {/* Card wrapper */}
          <div className="relative w-20 h-20 md:w-40 md:h-40 duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front of the card */}
            <div className="absolute inset-0 bg-blue-500 text-white flex items-center justify-center rounded-lg [backface-visibility:hidden]">
              <BsGift className="text-2xl" />
            </div>

            {/* Back of the card */}
            <div className="absolute inset-0 bg-green-500 flex flex-col justify-evenly items-center p-3 rounded-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <span className="bg-gray-200 md:p-2 h-fit">ABCDEFG</span>
              <TbTicket className="text-4xl md:text-9xl text-white" />
            </div>
          </div>
        </div>
        <div className="group [perspective:1000px] w-fit">
          {/* Card wrapper */}
          <div className="relative w-20 h-20 md:w-40 md:h-40 duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front of the card */}
            <div className="absolute inset-0 bg-blue-500 text-white flex items-center justify-center rounded-lg [backface-visibility:hidden]">
              <BsGift className="text-2xl" />
            </div>

            {/* Back of the card */}
            <div className="absolute inset-0 bg-green-500 flex flex-col justify-evenly items-center p-3 rounded-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <span className="bg-gray-200 md:p-2 h-fit">ABCDEFG</span>
              <TbTicket className="text-4xl md:text-9xl text-white" />
            </div>
          </div>
        </div>
        <div className="group [perspective:1000px] w-fit">
          {/* Card wrapper */}
          <div className="relative w-20 h-20 md:w-40 md:h-40 duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front of the card */}
            <div className="absolute inset-0 bg-blue-500 text-white flex items-center justify-center rounded-lg [backface-visibility:hidden]">
              <BsGift className="text-2xl" />
            </div>

            {/* Back of the card */}
            <div className="absolute inset-0 bg-green-500 flex flex-col justify-evenly items-center p-3 rounded-lg [transform:rotateY(180deg)] [backface-visibility:hidden]">
              <span className="bg-gray-200 md:p-2 h-fit">ABCDEFG</span>
              <TbTicket className="text-4xl md:text-9xl text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
