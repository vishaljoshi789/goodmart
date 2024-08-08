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
import { GMContext } from "@/app/(utils)/context/GMContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface Brand {
  id: number;
  name: string;
  description: string;
  image: string;
  featured: boolean;
}

export default function ProductBrand() {
  let [brands, setBrands] = useState<Brand[]>([]);
  let { baseURL } = useContext(GMContext);
  let api = useAxios();
  let fetchBrands = async () => {
    let response = await api.get("/admin/getProductBrands/");
    setBrands(response.data);
  };
  let deleteCategory = async (id: number) => {
    let response = await api.delete(`/admin/deleteProductBrand/${id}/`);
    if (response.status === 204) {
      toast.success("Brand Deleted Successfully");
      fetchBrands();
    } else {
      toast.error("Error Deleting Brand");
    }
  };
  useEffect(() => {
    fetchBrands();
  }, []);
  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
        <span className="my-10 text-xl font-bold">Product Brand</span>
        <Link href="brand/add">
          <IoMdAddCircle className="text-green-500 text-3xl" />
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S. No.</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="">Featured</TableHead>
            <TableHead className="">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{brand.name}</TableCell>
              <TableCell>{brand.description}</TableCell>
              <TableCell>
                {brand.image ? (
                  <img
                    src={`${baseURL}${brand.image}`}
                    width={50}
                    height={50}
                    alt="category image"
                  />
                ) : null}
              </TableCell>
              <TableCell>{brand.featured ? "Yes" : "No"}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  className="bg-white hover:bg-gray-300"
                  onClick={() => deleteCategory(brand.id)}
                >
                  <MdDelete className="text-red-500 text-2xl" />
                </Button>
                <Link href={`/securepanel/product/brand/edit/${brand.id}`}>
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
