"use client";
import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSearchParams } from "next/navigation";

interface ProductImage {
  image: string;
}

interface ProductSpec {
  key: string;
  value: string;
}

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
  tags: string;
  video: string;
  images: ProductImage[];
  specifications: ProductSpec[];
}
export default function ViewProduct() {
  let { baseURL } = useContext(GMContext);
  let api = useAxios();
  let path = useSearchParams();
  let id = path.get("id");
  let [product, setProduct] = useState<Product | null>(null);
  let [loading, setLoading] = useState(true);
  const [cApi, setCApi] = React.useState<CarouselApi>();
  let [activeImage, setActiveImage] = useState({});

  let getProduct = async () => {
    let response = await api.get(`/vendor/getProduct/${id}/`);
    // console.log(response.data);
    if (response.status == 200) {
      setProduct(response.data);
      setLoading(false);
    } else {
      toast.error("Error Fetching Product");
    }
  };
  useEffect(() => {
    getProduct();
  }, []);
  useEffect(() => {
    dateTime();
  }, [loading]);
  let dateTime = () => {
    let date = document.querySelectorAll(".date");
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
  useEffect(() => {
    if (!cApi) {
      return;
    }

    cApi.on("select", () => {
      setActiveImage(cApi.selectedScrollSnap());
    });
  }, [cApi]);
  return (
    product && (
      <div className="p-5 bg-gray-100">
        <div className="flex gap-5 justify-evenly items-center flex-col lg:flex-row">
          <Image
            src={`${baseURL}${product.image}`}
            alt={product.name}
            width={200}
            height={200}
          />
          {product.video && (
            <video
              className="w-full h-full lg:w-1/3"
              autoPlay={true}
              loop={true}
              controls={true}
              muted={true}
            >
              <source src={`${baseURL}${product.video}`} />
            </video>
          )}
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <span>{product.description}</span>
            <div>
              <span className="text-blue-500 font-bold">Price - </span>
              <s className="">₹{product.mrp}</s>{" "}
              <span>₹{product.offer_price}</span>
            </div>
            <div>
              <span className="text-blue-500 font-bold">Category - </span>
              <span>{product.category}</span>
            </div>
            <div>
              <span className="text-blue-500 font-bold">Brand - </span>
              <span>{product.brand}</span>
            </div>
            <div>
              <span className="text-blue-500 font-bold">Added On - </span>
              <span className="date">{product.added_on}</span>
            </div>
            <div>
              <span className="text-blue-500 font-bold">Status - </span>
              <span className="">{product.status ? "Active" : "Inactive"}</span>
            </div>
            <div>
              <span className="text-blue-500 font-bold">Tags - </span>
              <span className="">{product.tags}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-evenly lg:items-center bg-white my-10 p-10">
          {product.images.length > 0 && (
            <div className="flex items-center h-fit justify-center my-10 flex-col">
              <Carousel className="w-fit bg-white" setApi={setCApi}>
                <CarouselContent>
                  {product.images.map((item) => (
                    <CarouselItem
                      className="flex items-center justify-center w-14 xl:w-40"
                      key={item.image}
                    >
                      <Image
                        alt="product-img"
                        height={0}
                        width={0}
                        sizes="100vw"
                        className="w-full h-full object-cover object-center rounded"
                        src={`${baseURL}${item["image"]}`}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <ScrollArea className="bg-white ">
                <div className="flex items-center justify-evenly gap-2 p-3">
                  {product.images.map((item, index) => (
                    <Image
                      onClick={() => cApi?.scrollTo(index)}
                      alt="product-img"
                      height={0}
                      width={0}
                      sizes="100vw"
                      className={`w-20 h-20 object-contain object-center rounded ${
                        index == activeImage && `border-black border-2`
                      } `}
                      src={`${baseURL}${item["image"]}`}
                      key={index}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
          {product.specifications.length > 0 && (
            <div className="">
              <h1 className="text-2xl font-bold underline">Specifications</h1>
              <div className="flex flex-col gap-2">
                {product.specifications.map((spec) => (
                  <div key={spec.key} className="flex gap-5">
                    <span className="font-bold">{spec.key} - </span>
                    <span>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );
}
