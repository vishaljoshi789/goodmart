"use client";
import useAxios from "@/app/(utils)/hooks/useAxios";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Checkout() {
  let api = useAxios();
  let [address, setAddress] = useState([]);
  let [selectedAddress, setSelectedAddress] = useState(null);

  let getAddress = async () => {
    let response = await api.get("/getUserAddress/");
    setAddress(response.data);
  };
  let addAddress = async (e: any) => {
    e.preventDefault();
    let response = await api.post("/addUserAddress/", {
      address: e.target.street_address.value,
      city: e.target.city.value,
      state: e.target.state.value,
      pin: e.target.zip_code.value,
      name: e.target.name.value,
      phone: e.target.contact.value,
    });
    if (response.status == 201) {
      getAddress();
    }
    console.log(response.data);
  };

  useEffect(() => {
    getAddress();
  }, []);
  return (
    <div className="font-[sans-serif] bg-white p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="address py-10">
          <h2 className="text-2xl font-extrabold text-[#333] inline-block">
            Address
          </h2>
          <div className="flex flex-col gap-5">
            <RadioGroup
              name="address"
              onClick={(e: any) => setSelectedAddress(e.target.value)}
            >
              {address.map((e: any) => (
                <div
                  className="flex items-center space-x-2 px-5 bg-gray-300"
                  key={e.id}
                >
                  <RadioGroupItem value={e.id} id={e.id} />
                  <Label htmlFor={e.id} className="w-full h-full p-5">
                    <div className="text-xl">Deliver to - {e.name}</div>
                    <div>
                      {`${e.address}, ${e.city}, ${e.state} (${e.pin})`}
                    </div>
                    <div>Contact - {e.phone}</div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <Dialog>
              <DialogTrigger className="w-fit bg-primary text-white py-2 px-3 rounded-md font-bold text-sm">
                +Add Address
              </DialogTrigger>
              <DialogContent className="bg-primary text-white">
                <DialogHeader>
                  <DialogTitle>Add Address</DialogTitle>
                </DialogHeader>
                <form className="grid flex-1 gap-2" onSubmit={addAddress}>
                  <Label htmlFor="name" className="sr-only">
                    Name
                  </Label>
                  <Input id="name" placeholder="Name" />
                  <Label htmlFor="contact" className="sr-only">
                    Contact
                  </Label>
                  <Input id="contact" placeholder="Contact" />
                  <Label htmlFor="street_address" className="sr-only">
                    Street Address
                  </Label>
                  <Input id="street_address" placeholder="Street Address" />
                  <Label htmlFor="city" className="sr-only">
                    City
                  </Label>
                  <Input id="city" placeholder="City" />
                  <Label htmlFor="state" className="sr-only">
                    State
                  </Label>
                  <Input id="state" placeholder="State" />
                  <Label htmlFor="zip_code" className="sr-only">
                    Zip Code
                  </Label>
                  <Input id="zip_code" placeholder="Zip Code" />
                  <DialogClose
                    className="bg-white text-black hover:text-primary p-1 rounded-md"
                    type="submit"
                  >
                    Add
                  </DialogClose>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* <div>
          <h2 className="text-2xl font-extrabold text-[#333] inline-block">
            Payment Method
          </h2>

          {vendor.map((e: any, index: number) => (
            <div key={index}>{e}</div>
          ))}
          <div className="flex flex-col gap-5">
            <RadioGroup
              name="payment_mode"
              onClick={(e: any) => setSelectedPM(e.target.value)}
            >
              <div className="flex items-center space-x-2 px-5 bg-gray-300">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online" className="w-full h-full p-5">
                  Online
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-gray-300 px-5">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="w-full h-full p-5">
                  Cash On Delivery
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div> */}

        <div className="my-5 flex justify-center items-center gap-5 flex-col">
          {selectedAddress ? (
            <></>
          ) : (
            <span className="text-red-400 w-full">
              *Select Address before Proceeding
            </span>
          )}
          <Link
            href={
              selectedAddress
                ? {
                    pathname: "/checkout/billing",
                    query: {
                      address: selectedAddress,
                    },
                  }
                : ""
            }
          >
            <Button className="font-bold">Continue</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
