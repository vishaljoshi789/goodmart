"use client";
import { use, useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { GMContext, GMContextType } from "@/app/(utils)/context/GMContext";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function Register() {
  let router = useRouter();
  const referral = useSearchParams().get("referral");
  let [type, setType] = useState<any>(null);
  let [vendorType, setVendorType] = useState<any>(null);
  let { baseURL } = useContext<GMContextType>(GMContext);
  const formSchema = z
    .object({
      email: z.string().email({
        message: "Please enter a valid email address.",
      }),
      name: z.string().max(50, {
        message: "Please enter a valid email name.",
      }),
      phone_no: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string",
      }),
      password: z
        .string()
        .min(8, {
          message: "Password must be mix 8 characters long.",
        })
        .max(20, {
          message: "Password must be max 20 characters long.",
        })
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
          "Password must include one small letter, one uppercase letter, one number and one special character"
        ),
      confirmPassword: z
        .string()
        .min(8, {
          message: "Password must be mix 8 characters long.",
        })
        .max(20, {
          message: "Password must be max 20 characters long.",
        })
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/,
          "Password must include one small letter, one uppercase letter, one number and one special character"
        ),
      user_type: z.any(),
      user_id: z.string().optional().or(z.literal("")),
      co_ordinates: z.string().optional().or(z.literal("")),
      referral: z.string().optional().or(z.literal("")),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ["confirmPassword"],
        });
      }
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone_no: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      referral: referral || "",
    },
  });
  let showPosition = (position: GeolocationPosition) => {
    let values = form.getValues();
    values["co_ordinates"] =
      position.coords.latitude + "," + position.coords.longitude;
    onSubmit(values);
  };
  let showError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
    }
  };

  let getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  // 2. Define a submit handler.
  let onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.co_ordinates) {
      toast.loading("Registering User...");
      values["user_type"] = type == "Customer" ? "Customer" : vendorType;
      const timestampPart = Date.now().toString().slice(-3);
      const randomPart = Math.floor(100 + Math.random() * 900).toString();
      let prefix =
        type == "Customer"
          ? "GM"
          : vendorType == "Product Vendor"
          ? "GV"
          : "GS";
      values["user_id"] = prefix + timestampPart + randomPart;
      // console.log(values);
      let response = await fetch(`${baseURL}/registerUser/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      let data = await response.json();
      if (response.status == 201) {
        toast.success("Registration Successful");
        router.push("/register-verification?user_id=" + values.user_id);
      } else {
        console.log(response);
        if (data.email) {
          toast.error("Email already in use");
        }
        if (data.phone_no) {
          toast.error("Phone Number already in use");
        } else {
          toast.error("Something went wrong!!! Please try again");
        }
      }
      toast.dismiss();
    } else {
      getLocation();
    }
  };

  return (
    <div className="h-3/4 flex items-center mt-10 justify-center">
      <div className="space-y-10 md:w-96 bg-white rounded-md shadow-md p-5 h-full">
        {type && (
          <Button
            onClick={() => {
              setType(null);
              setVendorType(null);
            }}
          >
            <ArrowLeftIcon />
          </Button>
        )}
        <div className="flex">
          <h1 className="text-2xl font-bold text-gray-500 underline">
            Register To Goodmart {type && `as ${type}`}
          </h1>
        </div>
        {!type ? (
          <div className="h-full w-full flex gap-10 flex-col">
            <Button
              className="rounded-full bg-red-500 text-3xl p-5 h-fit"
              onClick={() => setType("Customer")}
            >
              Customer
            </Button>
            <Button
              className="rounded-full bg-blue-500 text-3xl p-5 h-fit"
              onClick={() => setType("Vendor")}
            >
              Business Partner
            </Button>
          </div>
        ) : type == "Customer" ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-5 space-y-3"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
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
                      <Input placeholder="Email Address" {...field} />
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Re-Enter Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="referral"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sponsor ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Referral ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <AlertDialog>
                <AlertDialogTrigger
                  type="submit"
                  className="bg-gray-800 text-white p-2 rounded-md font-bold"
                >
                  Submit
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Location is required for Registration
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Location is required for registration for verification
                      process. Please enable location services and try again.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Back</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <hr />
              <div className="flex justify-center items-center gap-2">
                <span>Already have account. </span>
                <Link href="/auth/login">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Login
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        ) : !vendorType ? (
          <div className="h-full w-full flex gap-10 flex-col">
            <Button
              className="rounded-full bg-red-500 text-3xl p-5 h-fit"
              onClick={() => setVendorType("Product Vendor")}
            >
              Product Vendor
            </Button>
            <Button
              className="rounded-full bg-blue-500 text-3xl p-5 h-fit"
              onClick={() => setVendorType("Service Vendor")}
            >
              Service Vendor
            </Button>
          </div>
        ) : (
          <div>
            <hr />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-5 space-y-3"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
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
                        <Input placeholder="Email Address" {...field} />
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Re-Enter Password"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="referral"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sponsor ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Referral ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AlertDialog>
                  <AlertDialogTrigger
                    className="bg-gray-800 text-white p-2 rounded-md font-bold"
                    type="submit"
                  >
                    Submit
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Location is required for Registration
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Location is required for registration for verification
                        process. Please enable location services and try again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Back</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <hr />
                <div className="flex justify-center items-center gap-2">
                  <span>Already have account. </span>
                  <Link href="/auth/login">
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      Login
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
