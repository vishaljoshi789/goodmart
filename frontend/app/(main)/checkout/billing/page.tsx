"use client";
import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Ticket } from "lucide-react";

export default function Billing() {
  let { baseURL } = useContext(GMContext);
  let [cart, setCart] = useState([]);
  let [address, setAddress] = useState<any>({});
  let [billing, setBilling] = useState<any>({});

  let router = useRouter();
  let api = useAxios();

  let address_id = useSearchParams().get("address");

  let placeOrder = async () => {
    for (let i = 0; i < billing.vendor.length; i++) {
      if (!billing.vendor[i].payment_mode) {
        toast.error("Please select payment mode for all vendors");
        return;
      }
    }
    let data = billing;
    data["address_id"] = address_id;
    let response = await api.post("/placeOrder/", data);
    if (response.status == 201) {
      toast.success("Order Placed Successfully");
      // console.log(response.data);
      router.push(`/checkout/confirm?order=${response.data.order}`);
    } else {
      toast.error("Something went wrong, Please try again");
    }
  };

  let getAddress = async () => {
    let response = await api.get(`/getAddress/${address_id}/`);
    setAddress(response.data);
  };

  let getBillingDetails = async () => {
    let response = await api.get("/getBillingDetails?address_id=" + address_id);
    if (response.status == 200) {
      console.log(response.data);
      setBilling(response.data);
    }
  };

  let getCart = async () => {
    let response = await api.get("/getCart/");
    if (response.status == 200) {
      setCart(response.data);
    }
  };

  useEffect(() => {
    getCart();
    getAddress();
    getBillingDetails();
  }, []);

  return (
    <Suspense>
      <div className="font-[sans-serif] bg-white md:p-6">
        <div className="max-w-4xl mx-auto w-full">
          <div className="shipping flex flex-col gap-3 my-5 bg-gray-400 p-2">
            <span className="text-xl">Deliver to - {address.name}</span>
            <span className="">
              Address -{" "}
              {`${address.address}, ${address.city}, ${address.state} (${address.pin})`}
            </span>
            <span className="">Contact - {address.phone}</span>
          </div>
          <div className="py-5">
            <span className="text-xl font-bold">Your Items</span>
            <div className="">
              <div className="flex flex-col px-2 md:px-5">
                {billing.vendor &&
                  billing.vendor.map((vnd: any) => (
                    <div key={vnd.id} className="p-2 my-5">
                      <span className="mt-5 block font-bold text-base w-full border-b-2 border-black">
                        {vnd.firm}
                      </span>
                      {cart.map(
                        (e: any, index) =>
                          e.product.company_id.id == vnd.id && (
                            <div
                              key={e.id}
                              className="flex items-center my-5 border-b-2 pb-2"
                            >
                              <div className="font-medium md:px-10">
                                <span>{index + 1}</span>
                              </div>
                              <div className="font-medium md:w-52 md:mx-10 mx-2">
                                <Image
                                  src={`${baseURL}${e.product.image}`}
                                  height={100}
                                  width={100}
                                  alt="image"
                                />
                              </div>
                              <div className="flex flex-col w-3/4">
                                <div className="text-gray-700">
                                  {e.product.name}{" "}
                                  {`(${
                                    e.variant ? e.variant.name : e.product.name
                                  })`}{" "}
                                  <br />
                                  <span className="bg-gray-200 text-gray-500 p-1 rounded-md">
                                    X{e.quantity}
                                  </span>
                                </div>
                                <div className="my-3">
                                  <span className="text-black-500 font-extrabold p-1 rounded-md">
                                    ₹
                                    {e.variant
                                      ? e.quantity * e.variant.offer_price
                                      : e.quantity * e.product.offer_price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                      )}
                      <div className="bg-gray-50 p-3">
                        <h3 className="text-normal font-extrabold text-[#333] border-b pb-2">
                          Order Summary for {vnd.firm}
                        </h3>
                        <ul className="text-[#333] divide-y mt-2">
                          <li className="flex flex-wrap gap-4 text-md py-2">
                            Subtotal{" "}
                            <span className="ml-auto font-bold">
                              ₹{vnd.total}
                            </span>
                          </li>
                          <li className="flex flex-wrap gap-4 text-md py-4">
                            Shipping{" "}
                            <span className="ml-auto font-bold">
                              +₹
                              {vnd.shipping}
                            </span>
                          </li>
                          {vnd.coupons.length > 0 && (
                            <li className="flex flex-wrap gap-4 py-4">
                              <span className="text-md font-bold">Coupons</span>

                              {vnd.coupons.map((coupon: any) => (
                                <div
                                  className="flex justify-between w-full"
                                  key={coupon.id}
                                >
                                  <div className="flex gap-5">
                                    <Ticket className="text-green-500" />
                                    <label
                                      htmlFor=""
                                      className="text-green-500"
                                    >
                                      {coupon.code}{" "}
                                      <b className="text-red-500">
                                        ₹{coupon.amount}
                                      </b>
                                    </label>
                                  </div>

                                  <input
                                    type="checkbox"
                                    className="bg-gray-200 text-gray-500 p-1 rounded-md"
                                    value={coupon.code}
                                    checked={coupon.is_used}
                                    onChange={(e) => {
                                      let vndtotal, total;
                                      if (e.target.checked) {
                                        vndtotal = (
                                          parseFloat(vnd.total) -
                                          parseFloat(coupon.amount)
                                        ).toFixed(2);
                                        total = (
                                          parseFloat(billing.total) -
                                          parseFloat(coupon.amount)
                                        )?.toFixed(2);
                                      } else {
                                        vndtotal = (
                                          parseFloat(vnd.total) +
                                          parseFloat(coupon.amount)
                                        ).toFixed(2);
                                        total = (
                                          parseFloat(billing.total) +
                                          parseFloat(coupon.amount)
                                        )?.toFixed(2);
                                      }
                                      setBilling((prevBilling: any) => ({
                                        ...prevBilling,
                                        total: total,
                                        vendor: prevBilling.vendor.map(
                                          (v: any) =>
                                            v.id === vnd.id
                                              ? {
                                                  ...v,
                                                  total: vndtotal,
                                                  coupons: v.coupons.map(
                                                    (c: any) =>
                                                      c.id === coupon.id
                                                        ? {
                                                            ...c,
                                                            is_used:
                                                              e.target.checked,
                                                          }
                                                        : c
                                                  ),
                                                }
                                              : v
                                        ),
                                      }));
                                    }}
                                  />
                                </div>
                              ))}
                            </li>
                          )}
                          <li className="flex flex-wrap gap-4 text-md py-4">
                            Total{" "}
                            <span className="ml-auto font-bold">
                              ₹
                              {(
                                parseFloat(vnd.total) + parseFloat(vnd.shipping)
                              ).toFixed(2)}
                            </span>
                          </li>

                          <li className="flex flex-wrap gap-4 text-md py-4 font-bold">
                            Payment Mode
                            <span className="ml-auto">
                              <Select
                                onValueChange={(value) => {
                                  vnd.payment_mode = value;
                                }}
                                defaultValue=""
                                required={true}
                              >
                                <SelectTrigger className="">
                                  <SelectValue placeholder="Payment Mode" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Online">
                                    Online Payment
                                  </SelectItem>
                                  {vnd.cash_on_delivery && (
                                    <SelectItem value="COD">
                                      Cash On Delivery
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-10">
            <h3 className="text-xl font-extrabold text-[#333] border-b pb-4">
              Order Summary
            </h3>
            <ul className="text-[#333] divide-y mt-6">
              <li className="flex flex-wrap gap-4 text-md py-4">
                Subtotal{" "}
                <span className="ml-auto font-bold">
                  ₹{parseInt(billing.total)?.toFixed(2)}
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-md py-4">
                Shipping{" "}
                <span className="ml-auto font-bold">+₹{billing.shipping}</span>
              </li>
              {/* <li className="flex flex-wrap gap-4 text-md py-4">
              Tax {`(18%)`}
              <span className="ml-auto font-bold">
                +₹{(0.18 * totalAmt).toFixed(2)}
              </span>
            </li> */}
              <li className="flex flex-wrap gap-4 text-md py-4 font-bold">
                Total{" "}
                <span className="ml-auto">
                  ₹
                  {(
                    parseFloat(billing.total) + parseFloat(billing.shipping)
                  ).toFixed(2)}
                </span>
              </li>
            </ul>
            <Button
              className="mt-6 text-md px-6 py-2.5 w-full bg-blue-600 hover:bg-blue-700 text-white rounded"
              onClick={placeOrder}
            >
              Confirm Order
            </Button>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
