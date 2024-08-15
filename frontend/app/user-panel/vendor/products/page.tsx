"use client";
import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { FaEye, FaRegEdit } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  description: string;
  mrp: number;
  offer_price: number;
  category: string;
  brand: string;
  added_on: string;
  status: boolean;
  image: string;
}
export default function Products() {
  let { baseURL } = useContext(GMContext);
  let api = useAxios();
  let [products, setProducts] = useState<Product[] | null>(null);
  let [loading, setLoading] = useState(true);
  let getProducts = async () => {
    try {
      let response = await api.get("/vendor/getProducts/");
      // console.log(response.data);
      setProducts(response.data);
      setLoading(false);
      // toast.success("Products Fetched");
    } catch (error) {
      // console.log(error);
      toast.error("Error Fetching Products");
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    dateTime();
  }, [loading]);
  let dateTime = () => {
    let date = document.querySelectorAll(".date");
    console.log(date);
    date.forEach((e) => {
      const date = new Date((e as HTMLElement).innerText);

      // Options for formatting the date
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      // Convert to a readable format
      const readableDate = date.toLocaleDateString("en-US", options);

      (e as HTMLElement).innerText = readableDate;
    });
  };

  let changeStatus = async (id: number) => {
    try {
      let response = await api.post(`/vendor/changeProductStatus/${id}/`);
      if (response.status == 200) {
        toast.success("Product Status Changed");
        getProducts();
      } else {
        toast.error("Error Changing Product Status");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Changing Product Status");
    }
  };
  let deleteProduct = async (id: number) => {
    let response = await api.delete(`/vendor/deleteProduct/${id}/`);
    if (response.status == 200) {
      toast.success("Product Deleted");
      getProducts();
    } else {
      toast.error("Error Deleting Product");
    }
  };
  return (
    <div className="flex flex-col gap-3 p-5">
      <div className="flex justify-between ">
        <span className="text-2xl font-bold text-blue-500 underline ">
          Products
        </span>
        <Link href="products/add" className="">
          <IoMdAddCircle className="text-green-500 text-3xl" />
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">S.No.</TableHead>
            <TableHead className="text-center">Image</TableHead>
            <TableHead className="text-center">Product Name</TableHead>
            <TableHead className="text-center">Product Description</TableHead>
            <TableHead className="text-center">MRP</TableHead>
            <TableHead className="text-center">Offer Price</TableHead>
            <TableHead className="text-center">Added On</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products &&
            products.map((product, index) => (
              <TableRow className="text-center">
                <TableCell>{index + 1}</TableCell>
                <TableCell className="flex justify-center items-center">
                  {product.image ? (
                    <Image
                      src={`${baseURL}/${product.image}`}
                      alt="product image"
                      height={40}
                      width={40}
                    />
                  ) : null}
                </TableCell>
                <TableCell className="text-center">{product.name}</TableCell>
                <TableCell className="text-center">
                  {product.description}
                </TableCell>
                <TableCell className="text-center">{product.mrp}</TableCell>
                <TableCell className="text-center">
                  {product.offer_price}
                </TableCell>
                <TableCell className="text-center date">
                  {product.added_on}
                </TableCell>
                <TableCell className="text-center">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Switch
                        checked={product.status ? true : false}
                        onChange={(e) => console.log(e)}
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          By doing this, you will be changing the status of the
                          product.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => changeStatus(product.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center gap-2 h-full">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button className="bg-white shadow-lg hover:bg-gray-300">
                          <MdDelete className="text-red-500 text-3xl" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your product and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => deleteProduct(product.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Link href={`products/edit/${product.id}/`}>
                      <Button className="bg-white shadow-lg hover:bg-gray-300">
                        <FaRegEdit className="text-2xl text-black" />
                      </Button>
                    </Link>
                    <Link href={`products/view/${product.id}/`}>
                      <Button className="bg-white shadow-lg hover:bg-gray-300">
                        <FaEye className="text-2xl text-violet-500" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
