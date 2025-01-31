"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  user_id: z.string(),
  email: z.string(),
  phone_no: z.string(),
  name: z.string(),
  user_type: z.string(),
  co_ordinates: z.any(),
  status: z.boolean(),
  email_verified: z.boolean(),
  phone_verified: z.boolean(),
  referral: z.string().optional(),
});

const userDetailFormSchema = z.object({
  dob: z.string().optional(),
  bank_account_number: z.string().optional(),
  bank: z.string().optional(),
  ifsc: z.string().optional(),
  account_holder: z.string().optional(),
});

const userBillingAddressFormSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pin: z.string().optional(),
});

const EditUserPage = () => {
  const router = useRouter();
  const id = useSearchParams().get("id");
  const [billingAddressId, setBillingAddressId] = useState<string | null>(null);
  let api = useAxios();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: "",
      email: "",
      phone_no: "",
      name: "",
      user_type: "Customer",
      co_ordinates: "",
      status: true,
      email_verified: false,
      phone_verified: false,
      referral: "",
    },
  });
  const userDetailForm = useForm<z.infer<typeof userDetailFormSchema>>({
    resolver: zodResolver(userDetailFormSchema),
  });
  const userBillingAddressForm = useForm<
    z.infer<typeof userBillingAddressFormSchema>
  >({
    resolver: zodResolver(userBillingAddressFormSchema),
  });

  useEffect(() => {
    if (id) {
      // Fetch user data from API
      api.get(`/admin/getUser/${id}/`).then((res) => {
        console.log(res.data);
        form.reset(res.data);
      });
      api.get(`/admin/getUserDetail/${id}/`).then((res) => {
        console.log(res.data);
        userDetailForm.reset(res.data);
        setBillingAddressId(res.data.billing_address);
      });
    }
  }, [id]);

  useEffect(() => {
    api.get(`/admin/getAddress/${billingAddressId}/`).then((res) => {
      console.log(res.data);
      userBillingAddressForm.reset(res.data);
    });
  }, [billingAddressId]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  function onUserDetailSubmit(values: z.infer<typeof userDetailFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  function onUserBillingSubmit(
    values: z.infer<typeof userBillingAddressFormSchema>
  ) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">User Basic Details</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input placeholder="user_id" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="phone_no" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="user_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Customer">Customer</SelectItem>
                      <SelectItem value="Product Vendor">
                        Product Vendor
                      </SelectItem>
                      <SelectItem value="Service Vendor">
                        Service Vendor
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="co_ordinates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Co Ordinates</FormLabel>
                <FormControl>
                  <Input placeholder="co_ordinates" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center gap-5">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email_verified"
            render={({ field }) => (
              <FormItem className="flex items-center gap-5">
                <FormLabel>Email Verified</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_verified"
            render={({ field }) => (
              <FormItem className="flex items-center gap-5">
                <FormLabel>Phone Verified</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="referral"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referral</FormLabel>
                <FormControl>
                  <Input placeholder="co_ordinates" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <h1 className="text-2xl font-semibold my-6">User Bank Detail</h1>

      <Form {...userDetailForm}>
        <form
          onSubmit={userDetailForm.handleSubmit(onUserDetailSubmit)}
          className="space-y-2"
        >
          <FormField
            control={userDetailForm.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input placeholder="DOB" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={userDetailForm.control}
            name="bank_account_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="bank account number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={userDetailForm.control}
            name="bank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input placeholder="bank name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={userDetailForm.control}
            name="ifsc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input placeholder="ifsc code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      <h1 className="text-2xl font-semibold my-6">User Billing Address</h1>

      <Form {...userBillingAddressForm}>
        <form
          onSubmit={userBillingAddressForm.handleSubmit(onUserBillingSubmit)}
          className="space-y-2"
        >
          <FormField
            control={userBillingAddressForm.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={userBillingAddressForm.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={userBillingAddressForm.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="state" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={userBillingAddressForm.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input placeholder="pincode" {...field} />
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
};

export default EditUserPage;
