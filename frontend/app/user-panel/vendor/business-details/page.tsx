"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  firm: z.string(),
  description: z.string(),
  category: z.string(),
  primary_category: z.string(),
  photograph: z.string(),
  gst: z.string(),
  gst_certificate: z.string(),
  pan: z.string(),
  pan_certificate: z.string(),
  aadhar: z.string(),
  aadhar_front_image: z.string(),
  aadhar_back_image: z.string(),
  address: z.any(),
  qr: z.string(),
  vendor_visibility: z.boolean(),
  admin_visibility: z.boolean(),
  status: z.string(),
  cash_on_delivery: z.boolean(),
  image1: z.any(),
  image2: z.any(),
  image3: z.any(),
  logo: z.any(),
  free_shipping_above: z.string(),
});

export default function BusinessDetials() {
  // 1. Define your form.
  let [detail, setDetail] = useState<any>({});

  let [logo, setLogo] = useState<any>(null);
  let [image1, setImage1] = useState<any>(null);
  let [image2, setImage2] = useState<any>(null);
  let [image3, setImage3] = useState<any>(null);

  let { baseURL } = useContext(GMContext);
  let api = useAxios();

  let getDetail = async () => {
    let response = await api.get("/vendor/getVendorDetails");
    if (response.status == 200) {
      for (let key in response.data) {
        if (response.data[key] == null) {
          response.data[key] = "";
        }
      }
      setDetail(response.data);
      form.reset(response.data);
      console.log(response.data);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firm: "",
      description: "",
      category: "",
      primary_category: "",
      photograph: "",
      gst: "",
      gst_certificate: "",
      pan: "",
      pan_certificate: "",
      aadhar: "",
      aadhar_front_image: "",
      aadhar_back_image: "",
      address: {},
      qr: "",
      vendor_visibility: true,
      admin_visibility: true,
      status: "",
      cash_on_delivery: false,
      image1: "",
      image2: "",
      image3: "",
      logo: "",
      free_shipping_above: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full md:w-3/4 m-auto p-5 space-y-5 grid grid-cols-1 lg:grid-cols-4 gap-5 mt-10"
      >
        <div className="col-span-1 lg:col-span-1 flex items-center">
          {detail.photograph && (
            <Image
              src={`${baseURL}${detail.photograph}`}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full"
              alt="Vendor Image"
            />
          )}
        </div>
        <div className="col-span-1 lg:col-span-3">
          <FormField
            control={form.control}
            name="firm"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Firm Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Firm Name" {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firm Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your Firm Description"
                    {...field}
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gst"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} readOnly />
              </FormControl>
              <FormDescription className="text-xs text-blue-500">
                <Link
                  href={`${baseURL}${detail.gst_certificate}`}
                  target="_blank"
                >
                  View GST Certificate
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aadhar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aadhar</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} readOnly />
              </FormControl>
              <FormDescription className="text-xs text-blue-500 flex gap-10">
                <Link
                  href={`${baseURL}${detail.aadhar_front_image}`}
                  target="_blank"
                >
                  View Aadhar Front Image
                </Link>
                <Link
                  href={`${baseURL}${detail.aadhar_back_image}`}
                  target="_blank"
                >
                  View Aadhar Back Image
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PAN</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} readOnly />
              </FormControl>
              <FormDescription className="text-xs text-blue-500">
                <Link
                  href={`${baseURL}${detail.pan_certificate}`}
                  target="_blank"
                >
                  View PAN Certificate
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  value={`${detail.address?.address}, ${detail.address?.city}, ${detail.address?.state} (${detail.address?.pin})`}
                  readOnly
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setLogo(e.target.files[0]);
                    }
                  }}
                />
              </FormControl>

              {detail.logo && (
                <FormDescription className="text-xs text-blue-500">
                  <Link href={`${baseURL}${detail.logo}`} target="_blank">
                    View Logo
                  </Link>
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner 1</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setImage1(e.target.files[0]);
                    }
                  }}
                />
              </FormControl>
              {detail.image1 && (
                <FormDescription className="text-xs text-blue-500">
                  <Link href={`${baseURL}${detail.image1}`} target="_blank">
                    View Banner 1
                  </Link>
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner 2</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setImage2(e.target.files[0]);
                    }
                  }}
                />
              </FormControl>
              {detail.image2 && (
                <FormDescription className="text-xs text-blue-500">
                  <Link href={`${baseURL}${detail.image2}`} target="_blank">
                    View Banner 2
                  </Link>
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image3"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner 3</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setImage3(e.target.files[0]);
                    }
                  }}
                />
              </FormControl>
              {detail.image3 && (
                <FormDescription className="text-xs text-blue-500">
                  <Link href={`${baseURL}${detail.image3}`} target="_blank">
                    View Banner 3
                  </Link>
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cash_on_delivery"
          render={({ field }) => (
            <FormItem className="flex gap-3 items-center justify-between bg-gray-200 p-3 rounded-lg">
              <FormLabel>Cash On Delivery</FormLabel>
              <FormControl className="flex items-center">
                <Checkbox
                  onCheckedChange={field.onChange}
                  defaultChecked={field.value}
                  className="w-5 h-5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vendor_visibility"
          render={({ field }) => (
            <FormItem className="flex gap-3 items-center justify-between bg-gray-200 p-3 rounded-lg">
              <FormLabel>Visiblity</FormLabel>
              <FormControl className="flex items-center">
                <Checkbox
                  defaultChecked={field.value}
                  onCheckedChange={field.onChange}
                  className="w-5 h-5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="free_shipping_above"
          render={({ field }) => (
            <FormItem className="flex gap-3 items-center justify-between col-span-1 lg:col-span-2">
              <FormLabel>Free Shipping After (in Rs.)</FormLabel>
              <FormControl className="flex items-center">
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="col-span-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
