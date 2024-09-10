"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import useAxios from "@/app/(utils)/hooks/useAxios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { nullable } from "zod";

export default function KYCVerification() {
  const form = useForm({
    defaultValues: {
      firm: "",
      description: "",
      category: null,
      gst: "",
      gst_certificate: "",
      aadhar: "",
      aadhar_front_image: "",
      aadhar_back_image: "",
      pan: "",
      pan_certificate: "",
      photograph: "",
    },
  });
  let api = useAxios();
  let [category, setCategory] = useState<any>(null);

  let getCategory = async () => {
    let response = await api.get("/getProductCategory/");
    setCategory(response.data);
  };

  useEffect(() => {
    getCategory();
  }, []);

  async function onSubmit(values: any) {
    if (values.gst_certificate == "") {
      delete values.gst_certificate;
    }
    if (values.aadhar_front_image == "") {
      delete values.aadhar_front_image;
    }
    if (values.aadhar_back_image == "") {
      delete values.aadhar_back_image;
    }
    if (values.pan_certificate == "") {
      delete values.pan_certificate;
    }
    if (values.photograph == "") {
      delete values.photograph;
    }
    let response = await api.post("/vendor/addKYC/", values);
    console.log(response.data);
  }
  return (
    <div className="flex flex-col w-full p-5 gap-5">
      <h3 className="text-3xl font-bold whitespace-nowrap">KYC Form</h3>
      <div className="w-full flex items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full md:w-1/2 gap-5 bg-gray-50 p-5 rounded-lg"
          >
            <FormField
              control={form.control}
              name="firm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firm Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} required />
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
                    <Textarea placeholder="" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex items-center gap-5">
                  <FormLabel className="w-fit whitespace-nowrap">
                    Product Category
                  </FormLabel>
                  <Select onValueChange={field.onChange} required>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Any Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="z-10">
                      {category?.map((item: any) => (
                        <SelectItem key={item.id} value={`${item.id}`}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="gst"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>GST Number</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gst_certificate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>GST Certificate</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        type="file"
                        accept="image/*"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="aadhar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhar Number</FormLabel>
                  <FormControl>
                    {/* <InputOTP maxLength={16} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={8} />
                        <InputOTPSlot index={9} />
                        <InputOTPSlot index={10} />
                        <InputOTPSlot index={11} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={12} />
                        <InputOTPSlot index={13} />
                        <InputOTPSlot index={14} />
                        <InputOTPSlot index={15} />
                      </InputOTPGroup>
                    </InputOTP> */}
                    <Input placeholder="" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="aadhar_front_image"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Aadhar Front Image</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        type="file"
                        accept="image/*"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aadhar_back_image"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Aadhar Back Image</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        type="file"
                        accept="image/*"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="pan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN Number</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pan_certificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PAN Certificate</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      type="file"
                      accept="image/*"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photograph"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Passport Size Photograph</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      type="file"
                      accept="image/*"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
