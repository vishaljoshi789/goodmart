"use client";
import { Suspense, useContext } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLogin() {
  let router = useRouter();
  let { baseURL, setAuthToken, authToken, setUserInfo } =
    useContext<GMContextType>(GMContext);
  const formSchema = z.object({
    email: z.string(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const forgetPassword = async () => {
    toast.loading("Sending email...");
    const res = await fetch(`${baseURL}/admin/forgetPassword/`, {
      method: "POST",
    });
    if (res.status === 200) {
      toast.dismiss();
      const data = await res.json();
      toast.success("Email sent successfully");
      router.push(`/auth/forget-password/verify-otp?id=${data.id}`);
    } else {
      toast.dismiss();
      toast.error("Error sending email");
    }
  };

  // 2. Define a submit handler.
  let onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    let response = await fetch(`${baseURL}/auth/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    let data = await response.json();
    if (response.status === 200) {
      localStorage.setItem("accessToken", JSON.stringify(data));
      setAuthToken(data);
      let response = await fetch(`${baseURL}/getUserInfo/`, {
        headers: {
          Authorization: `Bearer ${data?.access}`,
        },
      });
      data = await response.json();
      if (response.status === 200) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        setUserInfo(data);
      } else {
        toast.error("Error getting user info");
      }
      toast.success("Login Success!");
      router.push("/securepanel");
    } else {
      toast.error("Authentication Failed");
    }
  };

  return (
    <Suspense>
      <div className="md:w-96 m-auto">
        <span className="font-bold text-red-500 text-xl">LOGIN</span>
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
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button type="submit">Submit</Button>
              <Button variant={"link"} className="" onClick={forgetPassword}>
                Forget Password
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Suspense>
  );
}
