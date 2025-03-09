"use client";

import useAxios from "@/app/(utils)/hooks/useAxios";
import { useEffect, useState } from "react";

export default function RefundPolicy() {
  const api = useAxios();
  const [refundPolicy, setRefundPolicy] = useState<any>("");
  const getTerms = async () => {
    try {
      const res = await api.get("/policies/");
      console.log(res.data);
      res.data.forEach((policy: any) => {
        if (policy.policy_type == "Refund Policy") {
          setRefundPolicy(policy.content);
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
      <h1 className="text-2xl font-bold text-red-500">Refund Policy</h1>
      <p className="p-3 break-words whitespace-pre-wrap">{refundPolicy}</p>
    </div>
  );
}
