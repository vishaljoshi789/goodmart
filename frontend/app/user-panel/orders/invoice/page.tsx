"use client";
import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
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
  const [userData, setUserData] = useState<any>(null);
  let order_id = useSearchParams().get("id");

  const getOrder = async () => {
    let response = await api.get(`/getSubOrder/${order_id}/`);
    if (response.status === 200) {
      setOrder(response.data);
      console.log(response.data);
    }
  };

  const getUserDetails = async () => {
    let response = await api.get(`/getUserDetails/`);
    if (response.status === 200) {
      setUserData(response.data);
      console.log(response.data);
    }
  };

  const downloadPDF = async () => {
    const element = invoiceRef.current;

    if (!element) {
      console.error("Element not found!");
      return;
    }

    // Set scale factor for higher resolution
    const scale = 2;

    // Generate high-quality canvas
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true, // Handle cross-origin images
      allowTaint: true,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    // PDF dimensions (A4 size in mm)
    const pdfWidth = 210; // A4 width
    const pdfHeight = 297; // A4 height

    const imgWidth = pdfWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    });

    let yOffset = 10; // Start content 10mm from the top

    if (imgHeight <= pdfHeight - 20) {
      // Single page
      pdf.addImage(imgData, "PNG", 10, yOffset, imgWidth, imgHeight);
    } else {
      // Multi-page handling
      let position = 0;

      while (position < canvas.height) {
        const canvasSlice = document.createElement("canvas");
        canvasSlice.width = canvas.width;
        canvasSlice.height = Math.min(
          canvas.height - position,
          (canvas.width * (pdfHeight - 20)) / imgWidth
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
          pdf.addImage(sliceImgData, "PNG", 10, yOffset, imgWidth, imgHeight);
          position += canvasSlice.height;

          if (position < canvas.height) {
            pdf.addPage();
          }
        }
      }
    }

    pdf.save("invoice.pdf");
  };

  useEffect(() => {
    getOrder();
    getUserDetails();
  }, []);

  return (
    order && (
      <div className="w-full">
        <div
          className="w-full p-2"
          ref={invoiceRef}
          style={{
            padding: "10px", // Add padding around the content
            margin: "0 auto", // Center the content
            backgroundColor: "#fff", // Set a white background
            width: "794px", // A4 width for consistency
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start p-6 space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center w-full">
              <img
                alt="Invoice Logo"
                src="/images/logo2.png"
                style={{
                  width: "250px",
                  height: "54px",
                  objectFit: "cover", // Prevent cropping
                }}
              />
            </div>
            <div className="w-fit">
              <h2 className="text-xl font-semibold whitespace-nowrap">
                Invoice #INV00{order.id}
              </h2>
              <p className="text-gray-500 whitespace-nowrap">
                Date:{" "}
                {new Date(order.order.added_on).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
          <main className="border-2 border-black">
            <div className="flex border-b-2 border-b-black">
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
              <div className="w-1/2">
                <div className="h-1/2 p-1">
                  <p className="font-extrabold">Billing To</p>
                  <div className="h-full">
                    <p className="font-bold text-sm">{order.order.user.name}</p>
                    <p className="text-sm">
                      User ID : {order.order.user.user_id}
                    </p>
                    <p className="font-light text-sm">
                      {userData.billing_address.address}
                    </p>
                    <p className="font-light text-sm">
                      City : {userData.billing_address.city}{" "}
                      {`(${userData.billing_address.pin})`}
                    </p>
                    <p className="font-light text-sm">
                      State : {userData.billing_address.state}{" "}
                    </p>
                  </div>
                </div>
                <div className="h-1/2 border-t-2 border-black p-1 mt-2">
                  <p className="font-extrabold">Shipping To</p>
                  <div className="h-full">
                    <p className="font-bold text-sm">
                      {order.order.address.name}
                    </p>
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
            </div>
            <div className="">
              <Table className="border">
                {/* <TableCaption>A list of your Invoice Items.</TableCaption> */}
                <TableHeader>
                  <TableRow>
                    <TableHead className="border">S. No.</TableHead>
                    <TableHead className="border">
                      Description Of Goods
                    </TableHead>
                    <TableHead className="border">HSN</TableHead>
                    <TableHead className="border">MRP</TableHead>
                    <TableHead className="border">GST</TableHead>
                    <TableHead className="border">Qty</TableHead>
                    <TableHead className="border">Rate</TableHead>
                    {/* <TableHead className="border">Quantity</TableHead> */}
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
                        {item.product.mrp}
                      </TableCell>
                      <TableCell className="border">
                        {item.product.gst}
                      </TableCell>
                      <TableCell className="border">{item.quantity}</TableCell>
                      <TableCell className="border">
                        ₹{item.product.offer_price}
                      </TableCell>
                      {/* <TableCell className="border">{item.quantity}</TableCell> */}
                      <TableCell className="border">
                        {(
                          ((item.product.mrp - item.product.offer_price) /
                            item.product.mrp) *
                          100
                        ).toFixed(2)}
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
            {/* <div className="h-96"></div> */}
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
