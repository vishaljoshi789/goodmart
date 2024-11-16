"use client";

import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const api = useAxios();

  let getOrders = async () => {
    let response = await api.get("/getOrders/");
    if (response.status == 200) {
      setOrders(response.data);
      console.log(response.data);
    }
  };
  const formatReadableDate = (isoTimestamp: any) => {
    const date = new Date(isoTimestamp);
    return date.toLocaleString(); // Adjusts to the user's local time zone
  };
  const getItemsNumber = (order: any) => {
    let items = 0;
    order.sub_orders.forEach((suborder: any) => {
      suborder.items.forEach((item: any) => {
        items += item.quantity;
      });
    });
    return items;
  };
  useEffect(() => {
    getOrders();
  }, []);
  return (
    <div className="flex flex-col-reverse p-2 gap-5">
      {orders.map((order: any) => (
        <div className="bg-gray-200 rounded-md" key={order.id}>
          <div className="flex md:items-center justify-between p-2 flex-col md:flex-row gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex gap-5 items-center">
                <h1 className="text-xl font-semibold">Order Id: {order.id}</h1>
                <p className="text-sm font-bold whitespace-nowrap">
                  Items: {getItemsNumber(order)}
                </p>
              </div>
              <p className="text-sm">
                Date: {formatReadableDate(order.added_on)}
              </p>

              <p className="text-sm">
                {" "}
                Delivering To:{" "}
                {`${order.address.name}, ${order.address.address}, ${order.address.city} (${order.address.pin})`}
              </p>
              <p className="text-sm"> Phone: {`${order.address.phone}`}</p>
            </div>
            <div>
              <Link href={`view?id=${order.id}`}>
                <Button>View Order</Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
