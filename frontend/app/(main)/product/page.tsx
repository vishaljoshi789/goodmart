"use client";
import { useSearchParams } from "next/navigation";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { useContext, useEffect, useState } from "react";
import { GMContext } from "@/app/(utils)/context/GMContext";
import { toast } from "sonner";
import NotFoundPage from "@/components/web/404";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { FaShare } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Product() {
  let id = useSearchParams().get("id");
  const [api, setApi] = useState<CarouselApi>();
  let { baseURL } = useContext(GMContext);
  let [product, setProduct] = useState<any>({});
  let [activeImage, setActiveImage] = useState(0);
  let getProduct = async () => {
    let response = await fetch(`${baseURL}/getProduct/${id}/`);
    if (response.status == 200) {
      let data = await response.json();
      console.log(data);
      setProduct(data);
    }
    if (response.status == 404) {
      toast.error("Product Not Found!");
      setProduct(null);
    }
  };

  let handleShare = async () => {
    try {
      await navigator.share({
        title: "GOODMART",
        text: product.name,
        url: window.location.href,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setActiveImage(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    getProduct();
  }, []);
  return (
    <div>
      {product ? (
        <section className="text-gray-600 body-font overflow-hidden">
          <div className="px-5 py-24 mx-auto">
            <div className="mx-auto flex flex-wrap justify-evenly">
              <div className="flex flex-col gap-5 items-center sticky z-10 top-0 shadow-md">
                <Carousel
                  className="w-full xl:max-w-2xl lg:max-w-md md:max-w-sm"
                  setApi={setApi}
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {product.images &&
                      product.images.map((image: any, index: any) => (
                        <CarouselItem key={index}>
                          <Card>
                            <CardContent className="flex items-center justify-center p-5 aspect-square">
                              <Image
                                alt={product.name}
                                height={0}
                                width={0}
                                sizes="100vw"
                                className="w-full h-full object-contain object-center"
                                src={`${baseURL}${image["image"]}`}
                              />
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    {product.video && (
                      <CarouselItem>
                        <Card>
                          <CardContent className="flex items-center justify-center p-5 aspect-square">
                            <video
                              className="w-full h-full object-contain object-center"
                              src={`${baseURL}${product["video"]}`}
                              controls
                            />
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    )}
                  </CarouselContent>
                </Carousel>
                <ScrollArea className="bg-white">
                  <div className="flex items-center justify-evenly gap-2 p-3">
                    {product.images &&
                      product.images.map((item: any, index: number) => (
                        <Image
                          onClick={() => api?.scrollTo(index)}
                          alt="product-img"
                          height={0}
                          width={0}
                          sizes="100vw"
                          className={`w-16 h-16 object-contain object-center rounded ${
                            index == activeImage && `border-black border-2`
                          } `}
                          src={`${baseURL}${item["image"]}`}
                          key={item.id}
                        />
                      ))}
                    {product.video && (
                      <video
                        className={`w-16 h-16 object-contain object-center rounded ${
                          activeImage == product.images.length &&
                          `border-black border-2`
                        } `}
                        onClick={() => api?.scrollTo(product.images.length)}
                      >
                        <source src={`${baseURL}${product["video"]}`} />
                      </video>
                    )}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
              <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">
                  {product.brand}
                </h2>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                  {product.name}
                </h1>
                <div className="flex mb-4">
                  <span className="flex items-center">
                    <div
                      className="Stars text-xl"
                      style={{ "--rating": 2.5 } as React.CSSProperties}
                      aria-label="Rating of this product is 2.3 out of 5."
                    ></div>
                    <span className="text-gray-600 ml-3">4 Reviews</span>
                  </span>
                  <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                    <Button
                      className="bg-white hover:bg-white text-blue-500 hover:text-blue-700 "
                      onClick={handleShare}
                    >
                      <FaShare className="text-2xl" />
                    </Button>
                  </span>
                </div>
                <p className="leading-relaxed">{product.description}</p>
                <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5"></div>
                <div className="flex">
                  <div className="flex gap-5">
                    <s className="title-font font-medium text-2xl text-red-500">
                      ₹{product.mrp}
                    </s>
                    <span className="title-font font-medium text-2xl text-gray-900">
                      ₹{product.offer_price}
                    </span>
                  </div>
                  <button className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                    Button
                  </button>
                  <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                    <svg
                      fill="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <NotFoundPage />
      )}
    </div>
  );
}
