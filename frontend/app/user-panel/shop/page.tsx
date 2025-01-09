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

export default function Shop() {
  const [shops, setShops] = React.useState([]);
  const { baseURL } = useContext(GMContext);
  const api = useAxios();
  const getShops = async () => {
    const response = await api.get("/getShops/");
    console.log(response.data);
    setShops(response.data);
  };

  useEffect(() => {
    getShops();
  }, []);

  return (
    <div className="w-full md:p-5 p-2">
      <h1 className="font-extrabold text-2xl">NearBy Shops</h1>
      <div className="shops flex w-full md:p-10 p-5 flex-col">
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
    </div>
  );
}
