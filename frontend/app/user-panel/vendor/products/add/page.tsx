"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import { GMContext } from "@/app/(utils)/context/GMContext";
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

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  mrp: z.number(),
  offer_price: z.number(),
  stock_quantity: z.number(),
  category: z.string(),
  brand: z.string(),
  specification: z.array(z.object({ key: z.string(), value: z.string() })),
  image: z.any(),
  images: z.array(z.any()),
  video: z.any(),
});

export default function AddProduct() {
  let { baseURL } = useContext(GMContext);
  let [category, setCategory] = useState([]);
  let [brand, setBrand] = useState([]);
  let [imageList, setImageList] = useState([{ file: null }]);
  let [specsList, setSpecsList] = useState([{ key: "", value: "" }]);

  let getCategory = async () => {
    let response = await fetch(`${baseURL}/getProductCategory/`);
    let data = await response.json();
    setCategory(data);
  };

  let getBrand = async () => {
    let response = await fetch(`${baseURL}/getProductBrand/`);
    let data = await response.json();
    setBrand(data);
  };

  // const handleAddSpec = () => {
  //   // console.log(specsList)
  //   const newSpec = { key: "", value: "" };
  //   setSpecsList([...specsList, newSpec]);
  // };

  // const handleRemoveSpec = (index: number) => {
  //   const updatedSpecs = specsList.filter((_, i) => i !== index);
  //   setSpecsList(updatedSpecs);
  // };

  // const handleSpecChange = (index: number, field: string, newValue: string) => {
  //   const updatedSpecs = specsList.map((spec, i) =>
  //     i === index ? { ...spec, [field]: newValue } : spec
  //   );
  //   setSpecsList(updatedSpecs);
  // };

  // const handleAddImage = () => {
  //   const newImage = { file: null };
  //   setImageList([...imageList, newImage]);
  // };

  // const handleRemoveImage = (index: number) => {
  //   const updatedImages = imageList.filter((_, i) => i !== index);
  //   setImageList(updatedImages);
  // };

  // const handleImageChange = (index: number, file: any) => {
  //   const updatedImages = [...imageList];
  //   updatedImages[index].file = file;
  //   setImageList(updatedImages);
  // };

  //   let submitProductForm = async (e) => {
  //     e.preventDefault();
  //     if (imageList[0]["image"] == null) {
  //       toast.error("Submit atleast 1 image");
  //       return;
  //     }
  //     const formData = new FormData();
  //     imageList.forEach((image, index) => {
  //       formData.append(`image${index + 1}`, image.image);
  //     });
  //     formData.append("specification", JSON.stringify(specsList));
  //     formData.append("category", JSON.stringify(categoryList));
  //     formData.append("event", JSON.stringify(eventList));
  //     formData.append("name", e.target.name.value);
  //     formData.append("description", e.target.description.value);
  //     formData.append("mrp", e.target.mrp.value);
  //     formData.append("sell_price", e.target.price.value);
  //     formData.append("stock_quantity", e.target.stock_quantity.value);
  //     formData.append("sell_price", e.target.price.value);
  //     formData.append("video", e.target.video.files[0]);
  //     formData.append("image", e.target.image.files[0]);
  //     try {
  //       let response = await api.post("/vendor/addProduct/", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       console.log(response.data);
  //       if (response.status == 201) {
  //         toast.success("Product Created");
  //         router.push("/vendor/products");
  //       } else {
  //         toast.error("Something went wrong, Recheck your Entered Data");
  //       }
  //     } catch (e) {
  //       console.log(e);
  //       toast.error("Something went wrong, Recheck your Entered Data");
  //     }
  //   };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      brand: "",
      specification: [],
      image: null,
      images: [],
      mrp: 0,
      offer_price: 0,
    },
  });

  useEffect(() => {
    getCategory();
    getBrand();
  }, []);

  return (
    <div className="p-6 flex items-center justify-center">
      <div className="mx-auto">
        <div>
          <h2 className="font-semibold text-xl text-gray-600">Add Product</h2>
          <p className="text-gray-500 mb-6"></p>
          <div className="flex items-center justify-center w-full">
            <div className="bg-gray-50 shadow-lg rounded-lg p-5">
              <span className="text-blue-500 font-bold text-sm">
                Basic Product Details
              </span>
              <Form {...form}>
                <form
                  // onSubmit={form.handleSubmit(onSubmit)}
                  method="post"
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
                        <FormItem>
                          <FormLabel>MRP</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="offer_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Offer Price</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
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
                          <FormControl>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent {...field}>
                                {category.map((cat: any) => (
                                  <SelectItem value={cat.id} key={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Brand" />
                              </SelectTrigger>
                              <SelectContent {...field}>
                                {brand.map((brd: any) => (
                                  <SelectItem value={brd.id} key={brd.id}>
                                    {brd.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
