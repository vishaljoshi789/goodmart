import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useContext, useState } from "react";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { toast } from "sonner";
import Image from "next/image";
import { GMContext } from "@/app/(utils)/context/GMContext";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  mrp: z.string().min(1, { message: "MRP is required" }),
  offer_price: z.string().min(1, { message: "Offer Price is required" }),
  category: z.string(),
  brand: z.string(),
  image: z.any(),
  video: z.any().optional(),
  tags: z.string().optional(),
});

export default function ProductEditBasicDetails({
  category,
  brand,
  productValues,
  className,
}: {
  category: any;
  brand: any;
  productValues: any;
  className?: string;
}) {
  let [image, setImage] = useState<File | null>(null);
  let [video, setVideo] = useState<File | null>(null);
  let { baseURL } = useContext(GMContext);
  let formData = new FormData();
  let api = useAxios();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: productValues,
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Uploading Product");
    values.image = image;
    values.video = video;
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("brand", values.brand);
    formData.append("mrp", values.mrp);
    formData.append("offer_price", values.offer_price);
    values.image && formData.append("image", values.image);
    values.video && formData.append("video", values.video);
    formData.append("tags", values.tags ?? "");
    let response = await api.put(
      `/vendor/updateProduct/${productValues.id}/`,
      formData
    );
    toast.dismiss();
    if (response.status == 200) {
      toast.success("Product Updated Successfully");
    } else {
      toast.error("Error Updating Product");
    }
  }
  return (
    <div className={`bg-gray-50 shadow-lg rounded-lg p-5 h-fit ${className}`}>
      <span className="text-blue-500 font-bold text-sm">
        Basic Product Details
      </span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
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
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="mrp"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>MRP</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="offer_price"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Offer Price</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {category &&
                        category.map((cat: any) => (
                          <SelectItem value={`${cat.id}`} key={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Brand</FormLabel>{" "}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brand &&
                        brand.map((brd: any) => (
                          <SelectItem value={`${brd.id}`} key={brd.id}>
                            {brd.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>{" "}
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImage(file);
                        }
                      }}
                      accept="image/*"
                      required={productValues.image ? false : true}
                    />
                  </FormControl>
                  <FormMessage />
                  {image ? (
                    <Image
                      src={URL.createObjectURL(image)}
                      alt="product-img"
                      height={100}
                      width={100}
                    />
                  ) : (
                    productValues.image && (
                      <Image
                        src={`${baseURL}${productValues.image}`}
                        alt="temp-img"
                        height={100}
                        width={100}
                      />
                    )
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Video (Optional)</FormLabel>{" "}
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setVideo(file);
                        }
                      }}
                      accept="video/*"
                    />
                  </FormControl>
                  <FormMessage />
                  {productValues.video && (
                    <video controls autoPlay loop muted className="w-60">
                      <source src={`${baseURL}${productValues.video}`} />
                    </video>
                  )}
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Tags {`(Seprated By comma ',')`} </FormLabel>{" "}
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
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
