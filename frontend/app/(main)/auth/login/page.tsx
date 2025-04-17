"use client";
import { Suspense, useContext, useEffect, useState } from "react";
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
import Link from "next/link";
import Advertisement from "@/components/web/Ad";

export default function Login() {
  let path = useSearchParams();
  let router = useRouter();
  let { baseURL, setAuthToken, setUserInfo } =
    useContext<GMContextType>(GMContext);
  const formSchema = z.object({
    email: z.string(),
    password: z.string(),
  });

  let source = path.get("source");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [ad, setAd] = useState<any>(null);

  const getAd = async () => {
    const response = await fetch(`${baseURL}/getAdsByPage/Login/`);
    const data = await response.json();
    setAd(data);
  };

  // 2. Define a submit handler.
  let onSubmit = async (values: z.infer<typeof formSchema>) => {
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
        if (data.email_verified == true) {
          localStorage.setItem("userInfo", JSON.stringify(data));
          setUserInfo(data);
          toast.success("Login Success!");
          router.push("/user-panel");
        } else {
          toast.error("Please Verify your Email before Login");
        }
      } else {
        toast.error("Error getting user info");
      }
    } else {
      toast.error("Authentication Failed");
    }
  };

  useEffect(() => {
    getAd();
  });

  return (
    <Suspense>
      {ad && ad.image && (
        <Advertisement
          imageUrl={baseURL + ad?.image}
          linkUrl={ad?.link}
          imageAlt={ad?.page}
        />
      )}
      <div className="flex items-center justify-center">
        <div className="md:w-96 m-auto mt-10">
          <span className="font-bold text-red-500 text-2xl underline">
            LOGIN
          </span>
          {source == "register" && (
            <div className="flex gap-2 flex-col">
              <span className="text-red-500 underline">
                A Verification Mail is been sent on your Email, Please Verify
                the Mail before Login.
              </span>
            </div>
          )}
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
              <hr />
              <div className="flex justify-center items-center gap-2">
                <span>Create a account. </span>
                <Link href="/auth/register">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Register
                  </Button>
                </Link>
              </div>
              <Link
                href="/auth/forget-password"
                className="w-full flex justify-center"
              >
                <Button variant={"link"}>Forget Password</Button>
              </Link>
            </form>
          </Form>
        </div>
      </div>
    </Suspense>
  );
}
