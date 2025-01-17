"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const EditUserPage = () => {
  const router = useRouter();
  const id = useSearchParams().get("id");

  const [formData, setFormData] = useState({
    user_id: "",
    email: "",
    phone_no: "",
    name: "",
    user_type: "Customer",
    co_ordinates: "",
    status: true,
    email_verified: false,
    phone_verified: false,
    passcode: "",
    referral: null,
  });

  useEffect(() => {
    if (id) {
      // Fetch user data from API
      axios.get(`/api/users/${id}`).then((res) => {
        setFormData(res.data);
      });
    }
  }, [id]);

  const handleInputChange = (e: any) => {
    const { name, value } = e;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update user data through API
    axios.put(`/api/users/${id}`, formData).then(() => {
      alert("User updated successfully!");
      router.push("/users");
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit User</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="User ID"
          name="user_id"
          value={formData.user_id}
          onChange={handleInputChange}
        />
        <Input
          type="email"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Phone Number"
          name="phone_no"
          value={formData.phone_no}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <select
          name="user_type"
          value={formData.user_type}
          onChange={(e) => handleInputChange(e as any)}
        >
          <option value="Customer">Customer</option>
          <option value="Product Vendor">Product Vendor</option>
          <option value="Service Vendor">Service Vendor</option>
        </select>
        <Textarea
          placeholder="Enter coordinates"
          name="co_ordinates"
          value={formData.co_ordinates}
          onChange={handleInputChange}
        />
        <Switch
          checked={formData.status}
          onCheckedChange={(value) => handleSwitchChange("status", value)}
        />
        <Switch
          checked={formData.email_verified}
          onCheckedChange={(value) =>
            handleSwitchChange("email_verified", value)
          }
        />
        <Switch
          checked={formData.phone_verified}
          onCheckedChange={(value) =>
            handleSwitchChange("phone_verified", value)
          }
        />
        <Input
          type="number"
          placeholder="Passcode"
          name="passcode"
          value={formData.passcode || ""}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Referral ID"
          name="referral"
          value={formData.referral || ""}
          onChange={handleInputChange}
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};

export default EditUserPage;
