"use client";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { GMContext } from "@/app/(utils)/context/GMContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  featured: boolean;
  parent: string;
}

export default function ProductCategory() {
  let [category, setCategory] = useState<Category[]>([]);
  let { baseURL } = useContext(GMContext);
  let api = useAxios();
  let fetchCategory = async () => {
    let response = await api.get("/admin/getProductCategories/");
    setCategory(response.data);
  };
  let deleteCategory = async (id: number) => {
    let response = await api.delete(`/admin/deleteProductCategory/${id}/`);
    if (response.status === 204) {
      toast.success("Category Deleted Successfully");
      fetchCategory();
    } else {
      toast.error("Error Deleting Category");
    }
  };
  useEffect(() => {
    fetchCategory();
  }, []);
  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
        <span className="my-10 text-xl font-bold">Product Category</span>
        <Link href="category/add">
          <IoMdAddCircle className="text-green-500 text-3xl" />
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S. No.</TableHead>
            <TableHead>ID</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="">Featured</TableHead>
            <TableHead className="">Parent</TableHead>
            <TableHead className="">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {category.map((cat, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="font-medium">{cat.id}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell>{cat.description}</TableCell>
              <TableCell>
                {cat.image ? (
                  <Image
                    src={`${baseURL}${cat.image}`}
                    width={50}
                    height={50}
                    alt="category image"
                  />
                ) : null}
              </TableCell>
              <TableCell>{cat.featured ? "Yes" : "No"}</TableCell>
              <TableCell>{cat.parent}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  className="bg-white hover:bg-gray-300"
                  onClick={() => deleteCategory(cat.id)}
                >
                  <MdDelete className="text-red-500 text-2xl" />
                </Button>
                <Link href={`/securepanel/product/category/edit?id=${cat.id}`}>
                  <Button className="bg-white hover:bg-gray-300">
                    <MdModeEdit className="text-2xl text-yellow-500" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
