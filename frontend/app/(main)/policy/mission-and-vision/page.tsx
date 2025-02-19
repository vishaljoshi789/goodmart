"use client";

import useAxios from "@/app/(utils)/hooks/useAxios";
import { useEffect, useState } from "react";

export default function MissionAndVision() {
  const api = useAxios();
  const [MissionAndVision, setMissionAndVision] = useState<any>("");
  const getTerms = async () => {
    try {
      const res = await api.get("/policies/");
      console.log(res.data);
      res.data.forEach((policy: any) => {
        if (policy.policy_type == "Our Mission and Vision") {
          setMissionAndVision(policy.content);
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
      <h1 className="text-2xl font-bold text-red-500">
        Our Mission and Vision
      </h1>
      <p className="p-3 break-words whitespace-pre-wrap">{MissionAndVision}</p>
    </div>
  );
}
