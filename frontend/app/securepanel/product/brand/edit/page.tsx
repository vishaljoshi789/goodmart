"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import useAxios from "@/app/(utils)/hooks/useAxios";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { GMContext } from "@/app/(utils)/context/GMContext";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.any(),
  featured: z.boolean(),
});

interface Brand {
  id: number;
  name: string;
  description: string;
  image: string;
  featured: boolean;
}
export default function ProductBrandEdit() {
  let router = useRouter();
  let api = useAxios();
  let [brand, setBrand] = useState<Brand>();
  let [image, setImage] = useState<any>(null);
  let { baseURL } = useContext(GMContext);
  let path = useSearchParams();
  let id = path.get("id");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: brand,
  });

  let fetchCategory = async () => {
    let response = await api.get(`/admin/getProductBrand/${id}/`);
    setBrand(response.data);
    form.reset(response.data);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  let onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (image || image == "") {
      console.log(values, image);
      let formData = new FormData();
      formData.append("image", image);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("featured", values.featured.toString());
      let response = await api.put(
        `/admin/updateProductBrand/${id}/`,
        formData
      );
      //   console.log(response);
      if (response.status === 200) {
        toast.success("Category Updated Successfully");
        router.push("/securepanel/product/brand");
      } else {
        toast.error("Error Updating Category");
      }
    } else {
      let response = await api.put(`/admin/updateProductBrand/${id}/`, values);
      console.log(response);
      if (response.status === 200) {
        toast.success("Category Updated Successfully");
        router.push("/securepanel/product/brand");
      } else {
        toast.error("Error Updating Category");
      }
    }
  };

  return (
    brand && (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex shadow-md w-fit flex-col m-auto p-8"
        >
          <h1 className="text-red-500 font-bold underline">Add Category</h1>
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Category Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  {brand.image && (
                    <Image
                      src={`${baseURL}${brand.image}`}
                      alt={brand.name}
                      width={50}
                      height={50}
                    />
                  )}
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) =>
                        e.target.files ? setImage(e.target.files[0]) : null
                      }
                    />
                  </FormControl>
                  <div className="flex items-center gap-3">
                    <Input
                      type="checkbox"
                      onChange={(e) => {
                        e.target.checked ? setImage("") : setImage(null);
                      }}
                      className="w-fit h-fit"
                    />{" "}
                    <span className="text-sm">Remove Image</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Input
                      {...field}
                      type="checkbox"
                      defaultChecked={field.value}
                      className="w-fit h-fit"
                      value={field.value ? "true" : "false"}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Featured</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    )
  );
}
