"use client";

import { GMContext } from "@/app/(utils)/context/GMContext";
import { useContext, useEffect, useState } from "react";

export default function ShippingPolicy() {
  const { baseURL } = useContext(GMContext);
  const [shippingPolicy, setShippingPolicy] = useState<any>("");
  const getTerms = async () => {
    try {
      const res = await fetch(baseURL + "/policies/");
      const data = await res.json();
      data.forEach((policy: any) => {
        if (policy.policy_type == "Shipping Policy") {
          setShippingPolicy(policy.content);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getTerms();
  }, []);

  return (
    <div className="py-5 px-2">
      <h1 className="text-2xl font-bold text-red-500">Shipping Policy</h1>
      <p className="p-3 break-words whitespace-pre-wrap">{shippingPolicy}</p>
    </div>
  );
}
