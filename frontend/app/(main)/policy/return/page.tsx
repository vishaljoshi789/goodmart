"use client";

import useAxios from "@/app/(utils)/hooks/useAxios";
import { useEffect, useState } from "react";

export default function ReturnPolicy() {
  const api = useAxios();
  const [returnPolicy, setReturnPolicy] = useState<any>("");
  const getTerms = async () => {
    try {
      const res = await api.get("/policies/");
      console.log(res.data);
      res.data.forEach((policy: any) => {
        if (policy.policy_type == "Return Policy") {
          setReturnPolicy(policy.content);
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
      <h1 className="text-2xl font-bold text-red-500">Return Policy</h1>
      <p className="p-3 break-words whitespace-pre-wrap">{returnPolicy}</p>
    </div>
  );
}
