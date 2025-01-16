"use client";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const api = useAxios();

  let getOrders = async () => {
    let response = await api.get("/vendor/getVendorOrders/");
    if (response.status == 200) {
      setOrders(response.data);
      console.log(response.data);
    }
  };
  const formatReadableDate = (isoTimestamp: any) => {
    const date = new Date(isoTimestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  useEffect(() => {
    getOrders();
  }, []);
  return (
    <div className="flex flex-col p-2 gap-5 w-full">
      <h1 className="font-bold text-xl my-3 text-red-500">Customer Orders</h1>
      {orders.map((order: any) => (
        <div className="bg-gray-200 rounded-md" key={order.id}>
          <div className="flex md:items-center justify-between p-2 flex-col md:flex-row gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex gap-5 items-center">
                <h1 className="text-xl font-semibold">Order Id: {order.id}</h1>
                <p className="text-sm font-bold whitespace-nowrap">
                  Items: {order.items.length}
                </p>
              </div>
              <p className="text-sm">
                Date: {formatReadableDate(order.added_on)}
              </p>

              <p className="text-sm">
                {" "}
                Delivering To:{" "}
                {`${order.address?.name}, ${order.address?.address}, ${order.address?.city} (${order.address?.pin})`}
              </p>
              <p className="text-sm"> Phone: {`${order.address?.phone}`}</p>
            </div>
            <div className="flex md:flex-col gap-5 items-center">
              <Link href={`order/view?id=${order.id}`}>
                <Button>View Order</Button>
              </Link>
              <p className="text-blue-500 font-bold text-lg">
                Status: {order.status}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
