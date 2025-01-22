"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import React, { useContext, useEffect, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { toast } from "sonner";
import { GMContext } from "@/app/(utils)/context/GMContext";
import Link from "next/link";

const formSchema = z.object({
  dob: z.string(),
  photograph: z.any(),
  passbook_image: z.any(),
  bank_account_number: z.string(),
  bank: z.string(),
  ifsc: z.string(),
  account_holder: z.string(),
  address: z.string(),
  landmark: z.string(),
  city: z.string(),
  state: z.string(),
  pin: z.string(),
});

export default function Profile() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { baseURL } = useContext(GMContext);

  const [profilePicture, setProfilePicture] = useState<any>(null);
  const [passbookImage, setPassbookImage] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  const api = useAxios();

  const getUserDetails = async () => {
    const res = await api.get("/getUserDetails/");
    if (res.status === 200) {
      form.reset({
        account_holder: res.data.account_holder,
        bank: res.data.bank,
        bank_account_number: res.data.bank_account_number,
        ifsc: res.data.ifsc,
        address: res.data.billing_address.address,
        landmark: res.data.billing_address.landmark,
        city: res.data.billing_address.city,
        state: res.data.billing_address.state,
        pin: res.data.billing_address.pin,
        dob: res.data.dob,
      });
      console.log(res.data);
      setUserDetails(res.data);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("dob", values.dob);
    formData.append("photograph", profilePicture || null);
    formData.append("passbook_image", passbookImage || null);
    formData.append("bank_account_number", values.bank_account_number);
    formData.append("bank", values.bank);
    formData.append("ifsc", values.ifsc);
    formData.append("account_holder", values.account_holder);
    formData.append("address", values.address);
    formData.append("landmark", values.landmark);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("pin", values.pin);
    const res = await api.post("/updateUserDetails/", formData);
    if (res.status === 201 || res.status === 200) {
      toast.success("Profile Updated Successfully");
    } else {
      toast.error("Profile Update Failed");
    }
    console.log(values);
  }
  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="p-5 flex flex-col gap-5 w-full">
      <h2 className="text-xl text-gray-500 font-extrabold">Your Profile</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 flex mx-auto bg-gray-50 shadow-lg flex-col p-2 rounded-md w-full md:w-2/3"
        >
          <FormField
            control={form.control}
            name="photograph"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="whitespace-nowrap">
                  Your Profile Picture
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    {...field}
                    onChange={(e: any) => setProfilePicture(e.target.files[0])}
                  />
                </FormControl>
                <FormDescription>
                  {userDetails?.photograph && (
                    <a
                      href={`${baseURL}${userDetails.photograph}`}
                      target="_blank"
                    >
                      View Image
                    </a>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="whitespace-nowrap">
                  Date Of Birth
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <p className=" text-red-500 font-bold">Bank Details </p>
          <FormField
            control={form.control}
            name="account_holder"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bank"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input placeholder="HDFC, SBI, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bank_account_number"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Bank Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="XXXXXXXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ifsc"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input placeholder="Your IFSC code here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passbook_image"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Passbook Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    {...field}
                    onChange={(e: any) => setPassbookImage(e.target.files[0])}
                  />
                </FormControl>
                <FormDescription>
                  {userDetails?.passbook_image && (
                    <a
                      href={`${baseURL}${userDetails.passbook_image}`}
                      target="_blank"
                    >
                      View Image
                    </a>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <p className=" text-red-500 font-bold">Billing Address </p>
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Address Line</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your Address here" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="landmark"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Landmark</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your Landmark here" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your City here" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your State here" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your Pincode here" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
