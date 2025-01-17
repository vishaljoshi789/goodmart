"use client";
import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Orderdetail = () => {
  const api = useAxios();
  const [orders, setOrders] = useState<any>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Tracks when data is loaded
  const [startAnimation, setStartAnimation] = useState(false); // Controls the animation start
  const { baseURL } = useContext(GMContext);
  let order_id = useSearchParams().get("id");

  // Function to get the progress value based on the status
  const getStatusProgress = (status: string) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Approved":
        return 25;
      case "Processing":
        return 50;
      case "Shipped":
        return 75;
      case "Delivered":
        return 100;
      default:
        return 0;
    }
  };

  const getOrder = async () => {
    let response = await api.get(`/admin/getOrderDetails/${order_id}/`);
    if (response.status === 200) {
      console.log(response.data);
      setOrders(response.data);
      setIsLoaded(true); // Mark data as loaded
    }
  };

  const onStatusChange = async (status: string) => {
    let response = await api.post(`/admin/updateOrderStatus/${order_id}/`, {
      status,
    });
    if (response.status === 200) {
      getOrder();
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  // Trigger animation after a 0.5-second delay once the order is loaded
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setStartAnimation(true), 500);
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [isLoaded]);

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>
      <h2 className="text-xl font-semibold">Order ID: {order_id}</h2>

      {orders.map((order: any) => (
        <div key={order.id} className="border rounded-lg p-4 mb-4">
          {new Date(order.added_on).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
          <div key={order.id} className="mt-4 border-t pt-4">
            <h3 className="text-lg font-medium">Suborder ID: {order.id}</h3>

            <p className="text-gray-500">Payment Mode: {order.payment_mode}</p>
            <p className="text-gray-500 mb-5">
              Payment Status: {order.payment_status}
            </p>

            <hr />

            <div className="my-5 text-gray-500">
              <span className="text-md font-bold text-black">
                Delivering To :{" "}
              </span>
              <p className="text-black">
                Name: {order.address.name} <br /> Phone: {order.address.phone}
              </p>
              <p>
                {order.address.address}, {order.address.landmark}
              </p>
              <p>
                {order.address.city}, {order.address.state}{" "}
                {`(${order.address.pin})`}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
              <div
                className={`bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out ${
                  startAnimation ? "w-full" : "w-0"
                }`}
                style={{
                  width: startAnimation
                    ? `${getStatusProgress(order.status)}%`
                    : "0%",
                }}
              ></div>
            </div>
            <div className="flex gap-5 py-5 items-center">
              <p>Status:</p>
              <Select
                defaultValue={order.status}
                onValueChange={(value) => onStatusChange(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ul className="list-disc pl-5 flex flex-wrap gap-5 w-full">
              {order.items.map((item: any) => (
                <li
                  key={item.id}
                  className="flex items-center justify-evenly my-2"
                >
                  <Link
                    href={`/product?id=${item.product.id}${
                      item.variant ? `&variant=${item.variant.id}` : ""
                    }`}
                    className="flex items-center flex-col justify-center bg-red-100 rounded-md shadow-lg p-3 w-48 h-52 gap-3 hover:shadow-none transition-all ease-in"
                  >
                    <Image
                      src={baseURL + item.product.image}
                      width={0}
                      height={0}
                      sizes="100vw"
                      alt={item.product.name}
                      className="w-36"
                    />
                    <span className="text-xs font-bold">
                      {item.product.name}
                      {item.variant && `(${item.variant.name})`} <br />
                      (X
                      {item.quantity})
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orderdetail;
