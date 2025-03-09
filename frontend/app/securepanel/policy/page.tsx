"use client";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect } from "react";
import { toast } from "sonner";

export default function Policy() {
  const api = useAxios();
  const [policies, setPolicies] = React.useState<any>([]);
  const [terms, setTerms] = React.useState<any>("");
  const [returnPolicy, setReturnPolicy] = React.useState<any>("");
  const [refundPolicy, setRefundPolicy] = React.useState<any>("");
  const [privacyPolicy, setPrivacyPolicy] = React.useState<any>("");
  const [shippingPolicy, setShippingPolicy] = React.useState<any>("");
  const [warranty, setWarranty] = React.useState<any>("");
  const [mission, setMission] = React.useState<any>("");
  const getPolicies = async () => {
    try {
      const res = await api.get("/admin/policies/");
      console.log(res.data);
      setPolicies(res.data);
      res.data.forEach((policy: any) => {
        if (policy.policy_type == "Terms and Conditions") {
          setTerms(policy.content);
        }
        if (policy.policy_type == "Return Policy") {
          setReturnPolicy(policy.content);
        }
        if (policy.policy_type == "Refund Policy") {
          setReturnPolicy(policy.content);
        }
        if (policy.policy_type == "Privacy Policy") {
          setReturnPolicy(policy.content);
        }
        if (policy.policy_type == "Shipping Policy") {
          setReturnPolicy(policy.content);
        }
        if (policy.policy_type == "Product Warranty") {
          setWarranty(policy.content);
        }
        if (policy.policy_type == "Our Missions and Visions") {
          setMission(policy.content);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const updatePolicy = async (policy: any, content: any) => {
    try {
      const res = await api.put("/admin/policy/update/" + policy + "/", {
        content: content,
      });
      console.log(res.data);
      if (res.status == 200) {
        getPolicies();
        toast.success("Policy updated successfully");
      } else {
        toast.error("Failed to update policy");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addPolicy = async (policy: any, content: any) => {
    try {
      const res = await api.post("/admin/addPolicy/", {
        policy_type: policy,
        content: content,
      });
      console.log(res.data);
      if (res.status == 201) {
        getPolicies();
        toast.success("Policy added successfully");
      } else {
        toast.error("Failed to add policy");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getPolicies();
  }, []);
  return (
    <div className="p-2">
      <span className="text-xl font-bold">Policies</span>

      <div className="terms p-2 space-y-2">
        <span className="text-lg font-extrabold">Terms and Conditions</span>
        <Textarea value={terms} onChange={(e) => setTerms(e.target.value)} />
        {policies.some(
          (policy: any) => policy.policy_type == "Terms and Conditions"
        ) ? (
          <>
            <Button onClick={() => updatePolicy("Terms and Conditions", terms)}>
              Update
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => addPolicy("Terms and Conditions", terms)}>
              Add
            </Button>
          </>
        )}
      </div>
      <div className="return p-2 space-y-2">
        <span className="text-lg font-extrabold">Return Policy</span>
        <Textarea
          value={returnPolicy}
          onChange={(e) => setReturnPolicy(e.target.value)}
        />
        {policies.some(
          (policy: any) => policy.policy_type == "Return Policy"
        ) ? (
          <>
            <Button onClick={() => updatePolicy("Return Policy", returnPolicy)}>
              Update
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => addPolicy("Return Policy", returnPolicy)}>
              Add
            </Button>
          </>
        )}
      </div>
      <div className="return p-2 space-y-2">
        <span className="text-lg font-extrabold">Refund Policy</span>
        <Textarea
          value={refundPolicy}
          onChange={(e) => setRefundPolicy(e.target.value)}
        />
        {policies.some(
          (policy: any) => policy.policy_type == "Refund Policy"
        ) ? (
          <>
            <Button onClick={() => updatePolicy("Refund Policy", refundPolicy)}>
              Update
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => addPolicy("Refund Policy", refundPolicy)}>
              Add
            </Button>
          </>
        )}
      </div>
      <div className="return p-2 space-y-2">
        <span className="text-lg font-extrabold">Privacy Policy</span>
        <Textarea
          value={privacyPolicy}
          onChange={(e) => setPrivacyPolicy(e.target.value)}
        />
        {policies.some(
          (policy: any) => policy.policy_type == "Privacy Policy"
        ) ? (
          <>
            <Button
              onClick={() => updatePolicy("Privacy Policy", privacyPolicy)}
            >
              Update
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => addPolicy("Privacy Policy", privacyPolicy)}>
              Add
            </Button>
          </>
        )}
      </div>
      <div className="return p-2 space-y-2">
        <span className="text-lg font-extrabold">Shipping Policy</span>
        <Textarea
          value={shippingPolicy}
          onChange={(e) => setShippingPolicy(e.target.value)}
        />
        {policies.some(
          (policy: any) => policy.policy_type == "Shipping Policy"
        ) ? (
          <>
            <Button
              onClick={() => updatePolicy("Shipping Policy", shippingPolicy)}
            >
              Update
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => addPolicy("Shipping Policy", shippingPolicy)}
            >
              Add
            </Button>
          </>
        )}
      </div>
      <div className="warranty p-2 space-y-2">
        <span className="text-lg font-extrabold">Product Warranty</span>
        <Textarea
          value={warranty}
          onChange={(e) => setWarranty(e.target.value)}
        />
        {policies.some(
          (policy: any) => policy.policy_type == "Product Warranty"
        ) ? (
          <>
            <Button onClick={() => updatePolicy("Product Warranty", warranty)}>
              Update
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => addPolicy("Product Warranty", warranty)}>
              Add
            </Button>
          </>
        )}
      </div>
      <div className="mission p-2 space-y-2">
        <span className="text-lg font-extrabold">Our Missions and Visions</span>
        <Textarea
          value={mission}
          onChange={(e) => setMission(e.target.value)}
        />
        {policies.some(
          (policy: any) => policy.policy_type == "Our Mission and Vision"
        ) ? (
          <>
            <Button
              onClick={() => updatePolicy("Our Mission and Vision", mission)}
            >
              Update
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => addPolicy("Our Mission and Vision", mission)}
            >
              Add
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
