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
  parent: z.any(),
});

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  featured: boolean;
  parent: string;
}
export default function ProductCategoryEdit() {
  let router = useRouter();
  let api = useAxios();
  let [category, setCategory] = useState<Category>();
  let [image, setImage] = useState<any>(null);
  let [categories, setCategories] = useState<Category[]>([]);
  let { baseURL } = useContext(GMContext);
  let path = useSearchParams();
  let id = path.get("id");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: category,
  });

  let fetchCategory = async () => {
    let response = await api.get(`/admin/getProductCategoryParentId/${id}/`);
    setCategory(response.data);
    form.reset(response.data);
  };

  let fetchCategories = async () => {
    let response = await api.get("/admin/getProductCategories/");
    setCategories(response.data);
  };

  useEffect(() => {
    fetchCategory();
    fetchCategories();
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
        `/admin/updateProductCategory/${id}/`,
        formData
      );
      //   console.log(response);
      if (response.status === 200) {
        toast.success("Category Updated Successfully");
        router.push("/securepanel/product/category");
      } else {
        toast.error("Error Updating Category");
      }
    } else {
      let response = await api.put(
        `/admin/updateProductCategory/${id}/`,
        values
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Category Updated Successfully");
        router.push("/securepanel/product/category");
      } else {
        toast.error("Error Updating Category");
      }
    }
  };

  return (
    category && (
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
                  {category.image && (
                    <Image
                      src={`${baseURL}${category.image}`}
                      alt={category.name}
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
            <FormField
              control={form.control}
              name="parent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full">
                      <option value="">None</option>
                      {categories &&
                        categories.map((cat, index) => (
                          <option key={index} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </FormControl>
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
