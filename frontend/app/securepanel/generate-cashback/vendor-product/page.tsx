"use client";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { toast } from "sonner";

export default function VendorProducts() {
  const vendor_id = useSearchParams().get("id");
  const api = useAxios();
  const [vendorProducts, setVendorProducts] = useState([]);
  const getVendorProducts = async () => {
    const { data } = await api.get(`/admin/getProductByVendor/${vendor_id}`);
    console.log(data);
    setVendorProducts(data);
  };
  const changeProductPoints = async (product_id: number, point: number) => {
    const res = await api.post(
      "/admin/changeProductPoint/" + product_id + "/",
      {
        product_id,
        point,
      }
    );
    if (res.status === 200) {
      toast.success("Points updated successfully");
    }
  };
  useEffect(() => {
    getVendorProducts();
  }, []);
  return (
    <div className="p-3">
      <span className="text-xl font-bold">Products</span>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>MRP</TableHead>
            <TableHead>Offer Price</TableHead>
            <TableHead>Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendorProducts.map((product: any, index) => (
            <TableRow key={product.id}>
              <TableCell className="text-sm">{index + 1}</TableCell>
              <TableCell className="text-sm">{product.name}</TableCell>
              <TableCell className="text-sm">{product.mrp}</TableCell>
              <TableCell className="text-sm">{product.offer_price}</TableCell>
              <TableCell>
                <Input
                  className="w-20"
                  value={product.point}
                  onChange={(e) =>
                    setVendorProducts((prev: any) =>
                      prev.map((p: any) =>
                        p.id === product.id
                          ? { ...p, point: e.target.value }
                          : p
                      )
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Button
                  variant={"secondary"}
                  onClick={() => changeProductPoints(product.id, product.point)}
                >
                  <TiTick className="text-sm" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
