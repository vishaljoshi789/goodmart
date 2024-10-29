"use client";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdAdd, MdDeleteForever } from "react-icons/md";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VendorShipping() {
  let api = useAxios();
  let [shipping, setShipping] = useState([]);
  let [pincode, setPincode] = useState("");
  let [charges, setCharges] = useState("");
  let getShipping = async () => {
    let response = await api.get("/vendor/getVendorShipping/");
    if (response.status == 200) {
      console.log(response.data);
      setShipping(response.data);
    }
  };
  let addShipping = async () => {
    let response = await api.post("/vendor/addVendorShipping/", {
      pincode,
      charges,
    });
    if (response.status == 201) {
      toast.success("Add Shipping Charges.");
      getShipping();
    }
    setPincode("");
    setCharges("");
  };
  let deleteShipping = async (id: number) => {
    let response = await api.delete(`/vendor/deleteVendorShipping/${id}/`);
    if (response.status == 200) {
      toast.success("Data removed Successfully");
      getShipping();
    }
  };
  useEffect(() => {
    getShipping();
  }, []);
  return (
    <div className="p-5 space-y-5">
      <div className="flex justify-between">
        <h3 className="w-fit text-2xl font-medium text-gray-800">
          Shipping Charges
        </h3>
        <Dialog>
          <DialogTrigger>
            <MdAdd className="text-white bg-green-500 rounded-full text-2xl" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Shipping Charges</DialogTitle>
              <DialogDescription>
                By adding this the shipping charges will be fixed for the
                provided pincode.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pincode" className="text-right">
                  Pincode
                </Label>
                <Input
                  id="pincode"
                  className="col-span-3"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  type="number"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="charges" className="text-right">
                  Charges
                </Label>
                <Input
                  id="charges"
                  className="col-span-3"
                  value={charges}
                  type="number"
                  onChange={(e) => setCharges(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button type="submit" onClick={addShipping}>
                  Add
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableCaption>A list of your Shipping Charges.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">S.No</TableHead>
            <TableHead>Pincode</TableHead>
            <TableHead>Charges</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipping.map((item: any, index) => (
            <TableRow>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{item.pincode}</TableCell>
              <TableCell>{item.charges}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger className="bg-red-500 text-white hover:bg-red-700 hover:text-white rounded-md p-1">
                    <MdDeleteForever className="rounded-md text-3xl shadow-md hover:shadow-sm transition-all ease-in cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose>
                        <Button
                          className="bg-red-500 text-white hover:bg-red-700 hover:text-white"
                          onClick={() => deleteShipping(item.id)}
                        >
                          Delete
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
