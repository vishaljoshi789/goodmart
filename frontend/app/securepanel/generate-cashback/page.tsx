"use client";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default function GenerateCashback() {
  const api = useAxios();
  const [vendors, setVendors] = useState([]);

  const fetchVendors = async () => {
    const { data } = await api.get("/admin/getVendors/");
    console.log(data);
    setVendors(data);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="p-3">
      <span className="text-xl font-bold">Vendor List</span>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">S.No</TableHead>
            <TableHead>Firm</TableHead>
            <TableHead>UserID</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor: any, index) => (
            <TableRow key={vendor.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{vendor.firm}</TableCell>
              <TableCell>{vendor.user.user_id}</TableCell>
              <TableCell className="text-right">
                <Button variant={"secondary"}>
                  <Link
                    href={`generate-cashback/vendor-product?id=${vendor.id}`}
                  >
                    Product
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
