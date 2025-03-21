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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.any(),
  featured: z.boolean(),
  parent: z.string().optional(),
});

export default function CategoryAdd() {
  let router = useRouter();
  let [image, setImage] = useState<File | null>(null);
  let [category, setCategory] = useState<any[]>([]);
  let api = useAxios();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      featured: false,
    },
  });
  let fetchCategory = async () => {
    let response = await api.get("/admin/getProductCategories/");
    setCategory(response.data);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // 2. Define a submit handler.
  let onSubmit = async (values: z.infer<typeof formSchema>) => {
    // console.log(values);
    if (image) {
      let formData = new FormData();
      formData.append("image", image);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("featured", values.featured.toString());
      values.parent && formData.append("parent", values.parent);
      let response = await api.post("/admin/createProductCategory/", formData);
      if (response.status === 201) {
        toast.success("Category Added Successfully");
        router.push("/securepanel/product/category");
      } else {
        toast.error("Error Adding Category");
      }
      //   console.log(response);
    } else {
      let response = await api.post("/admin/createProductCategory/", values);
      if (response.status === 201) {
        toast.success("Category Added Successfully");
        router.push("/securepanel/product/category");
      } else {
        toast.error("Error Adding Category");
      }
      //   console.log(response);
    }
  };
  return (
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
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) =>
                      e.target.files && setImage(e.target.files[0])
                    }
                  />
                </FormControl>
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
                    value={field.value ? "true" : "false"}
                    className="w-fit h-fit"
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
                    <option value="null">None</option>
                    {category.map((cat, index) => (
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
  );
}
