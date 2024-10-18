"use client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useEffect, useState } from "react";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { toast } from "sonner";

const formSchema = z.object({
  registration_points: z.string(),
});

export default function Setting() {
  let [setting, setSetting] = useState<any>(null);
  let api = useAxios();

  let getSetting = async () => {
    let response = await api.get("/admin/getSetting/");
    if (response.status === 200) {
      if (response.data.registration_points === null) {
        setSetting({ registration_points: 0 });
        form.reset({ registration_points: "0" });
      } else {
        setSetting(response.data);
        form.reset({
          registration_points: response.data.registration_points.toString(),
        });
      }
    }
  };

  let updateSetting = async (data: any) => {
    let response = await api.post("/admin/updateSetting/", data);
    if (response.status === 200) {
      getSetting();
      toast.success("Setting updated successfully");
    } else {
      toast.error("Failed to update setting");
    }
  };

  useEffect(() => {
    getSetting();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registration_points: "0",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    updateSetting(values);
  }
  return (
    <div className="flex justify-center flex-col gap-10 p-10">
      <span className="font-bold w-full text-red-500">WEB Settings</span>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="registration_points"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-10">
                  <FormLabel className="whitespace-nowrap">
                    Registration Points
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="w-full" />
                  </FormControl>
                </div>

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
