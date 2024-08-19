"use client";
import { useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Register() {
  let router = useRouter();
  let [type, setType] = useState<string>("Customer");
  let [vendorType, setVendorType] = useState<string>("Product Vendor");
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
      aadhar: z
        .string()
        .max(16, { message: "Enter a valid Aadhar Number" })
        .min(16, { message: "Enter a valid Aadhar number." })
        .optional()
        .or(z.literal("")),
      pan: z
        .string()
        .max(10, { message: "Enter a valid PAN Number" })
        .min(10, { message: "Enter a valid PAN number." })
        .optional()
        .or(z.literal("")),
      user_type: z.string().optional().or(z.literal("")),
      user_id: z.string().optional().or(z.literal("")),
      co_ordinates: z.string().optional().or(z.literal("")),
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
      aadhar: "",
      pan: "",
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
      console.log(values);
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
        router.push("/auth/login?source=register");
      } else {
        if (data.email) {
          toast.error("Email already in use");
        }
        if (data.phone_no) {
          toast.error("Phone Number already in use");
        }
      }
      toast.dismiss();
    } else {
      getLocation();
    }
  };

  return (
    <div className="h-full flex items-center mt-10 justify-center">
      <div className="space-y-2 md:w-96 bg-white rounded-md shadow-md">
        <div className="flex">
          <h1 className="text-2xl font-bold text-red-500 underline">
            Register
          </h1>
        </div>
        <div className="flex justify-center gap-2">
          <span
            className={`
            ${
              type == "Customer"
                ? "bg-red-500 text-white"
                : "bg-white text-black"
            }  w-1/2 p-2 text-sm cursor-pointer text-center`}
            onClick={() => setType("Customer")}
          >
            Customer
          </span>
          <span
            className={`${
              type == "Vendor" ? "bg-red-500 text-white" : "bg-white text-black"
            }  w-1/2 p-2 text-sm cursor-pointer text-center`}
            onClick={() => setType("Vendor")}
          >
            Business Partner
          </span>
        </div>
        {type == "Customer" ? (
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
        ) : (
          <div>
            <hr />
            <div className="typeButton flex justify-center gap-2 mt-2">
              <span
                className={`
              ${
                vendorType == "Product Vendor" ? "bg-red-500 text-white" : ""
              } w-1/2 p-2 text-sm cursor-pointer text-center`}
                onClick={() => setVendorType("Product Vendor")}
              >
                Product Vendor
              </span>
              <span
                className={`${
                  vendorType == "Service Vendor" ? "bg-red-500 text-white" : ""
                } w-1/2 p-2 text-sm cursor-pointer text-center`}
                onClick={() => setVendorType("Service Vendor")}
              >
                Service Vendor
              </span>
            </div>
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
                  name="aadhar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhar Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Aadhar Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="pan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pan Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter PAN Number" {...field} />
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
