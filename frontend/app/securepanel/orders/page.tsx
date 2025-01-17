"use client";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useEffect, useState } from "react";

export default function Orders() {
  const api = useAxios();
  const [allOrders, setAllOrders] = useState([]);

  const getAllOrders = async () => {
    try {
      const response = await api.get("/admin/getOrders/");
      console.log(response.data);
      setAllOrders(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState();

  useEffect(() => {
    const filteredOrders = selectedDate
      ? allOrders.filter(
          (order: any) => order.added_on.split("T")[0] === selectedDate
        )
      : allOrders;
    setOrders(filteredOrders);
  }, [allOrders, selectedDate]);

  useEffect(() => {
    getAllOrders();
  }, []);

  const handleDateChange = (event: any) => {
    setSelectedDate(event.target.value);
  };
  return (
    <div className="p-5">
      <div className="mt-2 mb-10 flex items-center gap-10">
        <span className="text-gray-500 font-bold">
          Select Date for viewing the Orders
        </span>
        <Input
          className="w-fit"
          type="date"
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>
      <hr />
      {orders.length !== 0 ? (
        <Table>
          <TableCaption>
            A list of orders placed on {selectedDate}.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Shipping</TableHead>
              <TableHead>View Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.user}</TableCell>
                <TableCell>₹{parseInt(order.subtotal)}</TableCell>
                <TableCell>₹{parseInt(order.shipping)}</TableCell>
                <TableCell>
                  <Button>
                    <Link href={`/securepanel/orders/view?id=${order.id}`}>
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-lg font-medium text-gray-400">
            No orders found for {selectedDate}.
          </p>
        </div>
      )}
    </div>
  );
}
