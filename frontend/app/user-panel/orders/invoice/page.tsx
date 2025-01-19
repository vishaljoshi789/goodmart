"use client";

import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TableCaption,
} from "@/components/ui/table";
import Image from "next/image";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { useSearchParams } from "next/navigation";

export default function Component() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const api = useAxios();
  const [order, setOrder] = useState<any>(null);
  let order_id = useSearchParams().get("id");

  const getOrder = async () => {
    let response = await api.get(`/getSubOrder/${order_id}/`);
    if (response.status === 200) {
      setOrder(response.data);
      console.log(response.data);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  const downloadPDF = async () => {
    const element = invoiceRef.current;

    if (!element) return;

    // Clone the element to apply desktop-specific styles for PDF generation
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Create a container for fixed desktop styles
    const pdfContainer = document.createElement("div");
    pdfContainer.style.width = "794px"; // A4 width in pixels at 96 DPI
    pdfContainer.style.margin = "0 auto"; // Center the content
    pdfContainer.style.background = "white";
    pdfContainer.style.padding = "20px";

    pdfContainer.appendChild(clonedElement);

    document.body.appendChild(pdfContainer);

    // Generate canvas
    const canvas = await html2canvas(pdfContainer, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow cross-origin images
    });

    document.body.removeChild(pdfContainer); // Clean up temporary container

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let position = 0;

    // Split content into pages
    while (position < canvas.height) {
      const canvasSlice = document.createElement("canvas");
      canvasSlice.width = canvas.width;
      canvasSlice.height = Math.min(
        canvas.height - position,
        canvas.height / (pageHeight / imgHeight)
      );

      const context = canvasSlice.getContext("2d");
      if (context) {
        context.drawImage(
          canvas,
          0,
          position,
          canvas.width,
          canvasSlice.height,
          0,
          0,
          canvas.width,
          canvasSlice.height
        );

        const sliceImgData = canvasSlice.toDataURL("image/png");
        pdf.addImage(
          sliceImgData,
          "PNG",
          0,
          0,
          imgWidth,
          (canvasSlice.height * pageWidth) / canvas.width
        );
        position += canvasSlice.height;

        if (position < canvas.height) {
          pdf.addPage();
        }
      }
    }

    pdf.save("invoice.pdf");
  };

  return (
    order && (
      <div className="w-full">
        <div className="w-full" ref={invoiceRef}>
          <header className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <Image
                alt={"invoice"}
                src={`/images/logo2.png`}
                width={0}
                height={0}
                sizes="100vw"
                className="w-64 object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Invoice #INV00{order.id}
              </h2>
              <p className="text-gray-500">
                Date:{" "}
                {new Date(order.order.added_on).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </header>
          <main className="border-2 border-black">
            <div className="h-60 flex border-b-2 border-b-black">
              <div className="w-1/2 border-r-2 border-r-black p-2">
                <p className="text-xl font-extrabold">Vendor Details :</p>

                <div className="h-full p-2">
                  <p className="font-bold">{order.vendor.firm}</p>
                  <p>Vendor ID : {order.vendor.user.user_id}</p>
                  <p className="font-light text-sm">
                    {order.vendor.address.address}
                  </p>
                  <p className="font-light text-sm">
                    City : {order.vendor.address.city}{" "}
                    {`(${order.vendor.address.pin})`}
                  </p>
                  <p className="font-light text-sm">
                    State : {order.vendor.address.state}{" "}
                  </p>
                  <p className="font-light text-sm">
                    GST : {order.vendor.gst}{" "}
                  </p>
                </div>
              </div>
              <div className="w-1/2 p-2">
                <p className="text-xl font-extrabold">
                  Consignee (Ship to) / (Bill to)
                </p>
                <div className="h-full p-2">
                  <p className="font-bold">{order.order.address.name}</p>
                  <p>User ID : {order.order.user.user_id}</p>
                  <p className="font-light text-sm">
                    {order.order.address.address}
                  </p>
                  <p className="font-light text-sm">
                    City : {order.order.address.city}{" "}
                    {`(${order.order.address.pin})`}
                  </p>
                  <p className="font-light text-sm">
                    State : {order.order.address.state}{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="h-96 border-b-2 border-b-black">
              <Table className="border">
                <TableCaption>A list of your Invoice Items.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="border">S. No.</TableHead>
                    <TableHead className="border">
                      Description Of Goods
                    </TableHead>
                    <TableHead className="border">HSN</TableHead>
                    <TableHead className="border">GST % Rate</TableHead>
                    <TableHead className="border">Quantity</TableHead>
                    <TableHead className="border">Rate</TableHead>
                    <TableHead className="border">Per</TableHead>
                    <TableHead className="border">Disc%</TableHead>
                    <TableHead className="border">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="border">{index + 1}</TableCell>
                      <TableCell className="border">
                        {item.product.name}
                      </TableCell>
                      <TableCell className="border">
                        {item.product.hsn}
                      </TableCell>
                      <TableCell className="border">
                        {item.product.gst}
                      </TableCell>
                      <TableCell className="border">{item.quantity}</TableCell>
                      <TableCell className="border">
                        ₹{item.product.offer_price}
                      </TableCell>
                      <TableCell className="border">
                        Per {item.product.unit}
                      </TableCell>
                      <TableCell className="border">
                        {item.product.discount}
                      </TableCell>
                      <TableCell className="border">
                        ₹{item.product.offer_price * item.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={8} className="border">
                      Sub Total
                    </TableCell>
                    <TableCell className="border">
                      ₹{order.order.subtotal}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} className="border">
                      Shipping
                    </TableCell>
                    <TableCell className="border">
                      ₹{order.order.shipping}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} className="border font-extrabold">
                      Total
                    </TableCell>
                    <TableCell className="border font-extrabold">
                      ₹
                      {parseFloat(order.order.shipping) +
                        parseFloat(order.order.subtotal)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
            <div className="h-96"></div>
          </main>
        </div>
        <button
          onClick={downloadPDF}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Download PDF
        </button>
      </div>
    )
  );
}
