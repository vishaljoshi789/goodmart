"use client";
import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

const Orderdetail = () => {
  const api = useAxios();
  const [order, setOrder] = useState<any>({});
  const [isLoaded, setIsLoaded] = useState(false); // Tracks when data is loaded
  const [startAnimation, setStartAnimation] = useState(false); // Controls the animation start
  const { baseURL } = useContext(GMContext);
  let order_id = useSearchParams().get("id");

  // Function to get the progress value based on the status
  const getStatusProgress = (status: string) => {
    switch (status) {
      case "Pending":
        return 0;
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
    let response = await api.get(`/getOrder/${order_id}/`);
    if (response.status === 200) {
      setOrder(response.data);
      setIsLoaded(true); // Mark data as loaded
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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>
      {order.id && (
        <div key={order.id} className="border rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold">Order ID: {order.id}</h2>
          {order.sub_orders.map((suborder: any) => (
            <div key={suborder.id} className="mt-4 border-t pt-4">
              <h3 className="text-lg font-medium">
                Suborder ID: {suborder.id}
              </h3>
              <p className="text-gray-600">
                Assigned Vendor: {suborder.vendor.firm}
              </p>
              <p className="text-gray-500">
                Payment Mode: {suborder.payment_mode}
              </p>
              <p className="text-gray-500">
                Payment Status: {suborder.payment_status}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden">
                <div
                  className={`bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out ${
                    startAnimation ? "w-full" : "w-0"
                  }`}
                  style={{
                    width: startAnimation
                      ? `${getStatusProgress(suborder.status)}%`
                      : "0%",
                  }}
                ></div>
              </div>
              <p className="text-gray-500 mt-1">
                Status: {suborder.status} ({getStatusProgress(suborder.status)}
                %)
              </p>

              <ul className="list-disc pl-5 flex flex-wrap gap-5 w-full">
                {suborder.items.map((item: any) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Orderdetail;
