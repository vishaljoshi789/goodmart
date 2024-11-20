"use client";
import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const OrderSummary = () => {
  const [bill, setBill] = useState<any>({});
  let api = useAxios();
  let { baseURL } = useContext(GMContext);
  let router = useRouter();
  let searchParams = useSearchParams();
  let order = searchParams.get("order");
  let getOrder = async () => {
    let response = await api.get(`/getOrderDetails/${order}`);
    console.log(response.data);
    setBill(response.data);
  };

  let placeOrder = async () => {
    let response = await api.post(`/placeOrder/${order}/`);
    if (response.status == 200) {
      toast.success("Order Placed Successfully");
      router.push(`/user-panel/orders`);
    } else {
      toast.error("Something went wrong, Please try again");
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  const billingAddress = {
    name: bill.address?.name,
    street: bill.address?.address,
    city: bill.address?.city,
    state: bill.address?.state,
    zip: bill.address?.pin,
    phone: bill.address?.phone,
  };

  return (
    <Suspense>
      <div className="py-8 md:px-4 lg:px-8">
        {bill.address && (
          <div className="md:max-w-3xl">
            <div className="md:shadow-lg rounded-lg overflow-hidden">
              <div className="md:px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                  Order Summary
                </h1>
                {/* Payment Methods */}
                {/* Billing Address */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Billing Address
                    </h2>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{billingAddress.name}</p>
                    <p>{billingAddress.street}</p>
                    <p>{`${billingAddress.city}, ${billingAddress.state} ${billingAddress.zip}`}</p>
                    <p>{billingAddress.phone}</p>
                  </div>
                </div>
                Promo Code and Gift Card
                <div className="mb-8 space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Your Items
                    </h2>
                    <div className="flex flex-col gap-5">
                      {bill.sub_orders.map((suborder: any) => (
                        <div
                          className="gap-3 flex flex-col p-2 bg-gray-200 rounded-sm"
                          key={suborder.id}
                        >
                          <h2 className="text-xl font-semibold text-gray-800">
                            {suborder.vendor.firm}
                          </h2>
                          {suborder.items.map((e: any) => (
                            <div
                              className="flex gap-5 w-full rounded-md shadow-md p-1 bg-white"
                              key={e.id}
                            >
                              <div className="img w-2/5 flex justify-center">
                                <Image
                                  src={baseURL + e.product.image}
                                  width={0}
                                  height={0}
                                  sizes="100vw"
                                  className="h-24 w-24 object-cover object-center"
                                  alt={e.product.name}
                                />
                              </div>
                              <div className="flex gap-3 flex-col w-2/3 justify-evenly text-xs md:text-base font-medium">
                                <span className="">
                                  {e.product.name}{" "}
                                  {e.variant && `(${e.variant.name})`}
                                </span>
                                <div className="flex gap-5 items-center">
                                  <span className="bg-gray-400 p-2 w-fit">
                                    X{e.quantity}
                                  </span>
                                  <span className="font-bold">
                                    ₹
                                    {e.variant
                                      ? e.variant.offer_price * e.quantity
                                      : e.product.offer_price * e.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="border-t pt-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                              Total
                            </h2>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>
                                  ₹{parseFloat(suborder.subtotal).toFixed(2)}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>
                                  ₹{parseFloat(suborder.shipping).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between font-bold text-lg pt-4 border-t">
                                <span>Total</span>
                                <span>
                                  ₹
                                  {(
                                    parseFloat(suborder.subtotal) +
                                    parseFloat(suborder.shipping)
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {bill.subtotal && (
                        <div className="border-t pt-6">
                          <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Order Total
                          </h2>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>
                                ₹{parseFloat(bill.subtotal).toFixed(2)}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span>
                                ₹{parseFloat(bill.shipping).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-4 border-t">
                              <span>Total</span>
                              <span>
                                ₹
                                {(
                                  parseFloat(bill.subtotal) +
                                  parseFloat(bill.shipping)
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button className="" onClick={placeOrder}>
                        Place Order
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default OrderSummary;
