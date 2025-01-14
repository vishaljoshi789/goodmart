"use client";
import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useContext, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GrAdd } from "react-icons/gr";

export default function Shop() {
  const [shops, setShops] = React.useState([]);
  const [address, setAddress] = React.useState([]);
  const { baseURL } = useContext(GMContext);
  const api = useAxios();

  const getAddress = async () => {
    const response = await api.get("/getUserAddress/");
    console.log(response.data);
    setAddress(response.data);
    response.data.length > 0 && getShops(response.data[0].pin);
  };

  const getShops = async (e: any) => {
    const response = await api.get("/getShops?pin=" + e);
    console.log(response.data);
    setShops(response.data);
  };

  const addAddress = async (e: any) => {
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
      getShops(response.data.pin);
    }
    console.log(response.data);
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <div className="w-full md:p-5 p-2">
      <h1 className="font-extrabold text-2xl">NearBy Shops</h1>
      {address.length > 0 ? (
        <div className="shops flex w-full md:p-10 p-5 flex-col">
          <div className="flex gap-2 my-3 items-center justify-between">
            <span className="font-bold">Address</span>
            <Select onValueChange={(e) => getShops(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Address" />
              </SelectTrigger>
              <SelectContent>
                {address.map((add: any) => (
                  <SelectItem value={add.pin} key={add.id}>
                    {add.address + " " + `(${add.pin})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-green-500 p-3">
                  <GrAdd />
                </Button>
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
            </Dialog> */}
          </div>
          {shops.map((shop: any) => (
            <div
              key={shop.id}
              className="shop w-full bg-red-500 flex flex-col lg:flex-row shadow-xl hover:shadow-sm ease-in-out transition-all"
            >
              <div className="w-full lg:w-1/3 bg-gray-500 h-52">
                <Image
                  src={baseURL + shop.logo}
                  alt={shop.firm}
                  className="object-cover w-full h-full"
                  width={0}
                  height={0}
                  sizes="100%"
                />
              </div>
              <div className="bg-gray-200 w-full p-3 flex flex-col justify-evenly">
                <h1 className="font-bold">{shop.firm}</h1>
                <span className="font-extralight">{shop.description}</span>
                <p className="text-gray-500">
                  {shop.address.landmark}, {shop.address.address},{" "}
                  {shop.address.city}, {shop.address.pin}
                </p>
                <div className="flex gap-5 my-5">
                  <Link href={`/shop?id=${shop.id}`}>
                    <Button className="bg-green-500 hover:bg-green-600 shadow-xl hover:shadow-sm">
                      View Shop
                    </Button>
                  </Link>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="bg-gray-700 hover:bg-gray-600 shadow-xl hover:shadow-sm">
                        View QR
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="bg-white p-5">
                        <Image
                          src={baseURL + shop.qr}
                          alt={shop.firm}
                          className="object-cover w-full h-full"
                          width={0}
                          height={0}
                          sizes="100%"
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Alert>
          <AlertTitle>No Address Found</AlertTitle>
          <AlertDescription className="text-gray-500">
            Add Your address to get the shop Nearby You
          </AlertDescription>
          <div>
            <Dialog>
              <DialogTrigger className="w-fit bg-primary text-white py-2 px-3 rounded-md font-bold text-sm">
                Add Address
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
        </Alert>
      )}
    </div>
  );
}
