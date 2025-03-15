"use client";
import { Suspense, useContext, useState } from "react";
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
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { GMContext, GMContextType } from "@/app/(utils)/context/GMContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgetPassword() {
  let router = useRouter();
  let { baseURL, setAuthToken, setUserInfo } =
    useContext<GMContextType>(GMContext);
  const formSchema = z.object({
    email: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  let onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Please wait...");
    let response = await fetch(`${baseURL}/forget-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (response.status == 200) {
      toast.dismiss();
      toast.success("Password reset link sent to your email.");
      let data = await response.json();
      router.push(`/auth/forget-password/verify-otp?id=${data.id}`);
    } else {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Suspense>
      <div className="flex items-center justify-center">
        <div className="md:w-96 m-auto mt-10">
          <span className="font-bold text-red-500 text-2xl underline">
            Forget Password
          </span>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 bg-white rounded-md shadow-md m-auto p-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email, Phone or User ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Emain, Phone or UserId"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Reset Password</Button>
              <hr />
              <div className="flex justify-center items-center gap-2">
                <span>Create a account. </span>
                <Link href="/auth/register">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Register
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Suspense>
  );
}
