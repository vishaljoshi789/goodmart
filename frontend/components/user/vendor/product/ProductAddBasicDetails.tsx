import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useEffect, useRef, useState } from "react";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { toast } from "sonner";
import { CiBarcode } from "react-icons/ci";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string(),
  brand: z.string(),
  image: z.any(),
  video: z.any().optional(),
  tags: z.string().optional(),
  tax: z.string().optional(),
  barcode_number: z.string().optional(),
  item_type: z.string().optional(),
  mrp: z.string(),
  offer_price: z.string(),
});

const Quagga = require("quagga");

export default function ProductAddBasicDetails({
  category,
  brand,
  setActiveTab,
  setProduct,
}: {
  category: any;
  brand: any;
  setActiveTab: any;
  setProduct: any;
}) {
  let [image, setImage] = useState<File | null>(null);
  let [video, setVideo] = useState<File | null>(null);

  const scannerRef = useRef<HTMLDivElement>(null);
  const [scannedCodes, setScannedCodes] = useState<string[]>([]);
  let [scanning, setScanning] = useState<any>(false);
  const [isQuaggaRunning, setIsQuaggaRunning] = useState(false);

  let formData = new FormData();
  let api = useAxios();

  useEffect(() => {
    setTimeout(() => {
      if (scanning && scannerRef.current) {
        Quagga.init(
          {
            inputStream: {
              type: "LiveStream",
              target: scannerRef.current, // DOM element to attach the camera stream
              constraints: {
                facingMode: "environment", // Use rear camera
              },
              halfSample: false,
            },
            decoder: {
              readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "upc_reader",
                "upc_e_reader",
              ],
            },
          },
          function (err: any) {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Quagga initialized");
            Quagga.start();
            setIsQuaggaRunning(true);
          }
        );

        // When a barcode is detected
        Quagga.onDetected((result: any) => {
          const barcode = result.codeResult.code;
          setScannedCodes((prev) => [...prev, barcode]); // Fill the input field with the scanned barcode
          // Quagga.stop(); // Stop scanning after success (you can adjust this as needed)
        });

        // Clean up Quagga on component unmount
        return () => {
          Quagga.stop();
          setIsQuaggaRunning(false);
        };
      } else {
        isQuaggaRunning && Quagga.stop();
        setIsQuaggaRunning(false);
      }
    }, 1);
  }, [scannerRef, scanning]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      brand: "",
      tags: "",
      barcode_number: "",
      tax: "",
      item_type: "",
      mrp: "",
      offer_price: "",
    },
  });

  useEffect(() => {
    const codeFrequency = scannedCodes.reduce((acc, code) => {
      acc[code] = (acc[code] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // If a code is consistently scanned 3 times, use it
    for (const [code, count] of Object.entries(codeFrequency)) {
      if (count >= 25) {
        // Adjust the threshold as needed
        form.setValue("barcode_number", code); // Set the input with consistent value
        setScannedCodes([]); // Reset the scanned codes
        Quagga.stop(); // Stop scanning
        setIsQuaggaRunning(false);
        setScanning(false); // Close the dialog
        toast.success("Barcode Scanned Successfully");
        break;
      }
    }
  }, [scannedCodes]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    toast.loading("Uploading Product");
    values.image = image;
    values.video = video;
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("category", values.category);
    formData.append("barcode_number", values.barcode_number ?? "");
    formData.append("tax", values.tax ?? "");
    formData.append("item_type", values.item_type ?? "");
    formData.append("brand", values.brand);
    formData.append("mrp", values.mrp);
    formData.append("offer_price", values.offer_price);
    formData.append("image", values.image);
    values.video && formData.append("video", values.video);
    formData.append("tags", values.tags ?? "");
    let response = await api.post("/vendor/addProduct/", formData);
    toast.dismiss();
    if (response.status == 201) {
      toast.success("Product Details Added");
      setProduct(response.data);
      setActiveTab(2);
    } else {
      toast.error("Error Creating Product");
    }
  }
  return (
    <div className="bg-gray-50 shadow-lg rounded-lg p-5 h-fit">
      <span className="text-blue-500 font-bold text-sm">
        Basic Product Details
      </span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
                <FormItem className="w-1/2">
                  <FormLabel>MRP</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="offer_price"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Offer Price</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} type="number" />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {category.map((cat: any) => (
                        <SelectItem value={`${cat.id}`} key={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Brand</FormLabel>{" "}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brand.map((brd: any) => (
                        <SelectItem value={`${brd.id}`} key={brd.id}>
                          {brd.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex w-full gap-5">
            <FormField
              control={form.control}
              name="tax"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Tax</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="item_type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Quality</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select Quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Packed">Packed</SelectItem>
                        <SelectItem value="Loose">Loose</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="barcode_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode Number</FormLabel>{" "}
                <div className="flex gap-5">
                  <FormControl className="w-full">
                    <Input {...field} placeholder="Scanned Barcode" />
                  </FormControl>
                  <Dialog
                    onOpenChange={(open) => setScanning(open)}
                    open={scanning}
                  >
                    <DialogTrigger className="bg-white text-black hover:text-white hover:bg-gray-500 px-2 rounded-md ease-in-out transition-all shadow-lg">
                      <CiBarcode className="text-3xl" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>BarCode Scanner</DialogTitle>
                      </DialogHeader>
                      <div
                        ref={scannerRef}
                        style={{ width: "425px", height: "425px" }}
                        className="m-auto"
                      ></div>
                    </DialogContent>
                  </Dialog>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>{" "}
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImage(file);
                        }
                      }}
                      accept="image/*"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Video (Optional)</FormLabel>{" "}
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setVideo(file);
                        }
                      }}
                      accept="video/*"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Tags {`(Seprated By comma ',')`}</FormLabel>{" "}
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
