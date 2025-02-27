"use client";
import { useSearchParams } from "next/navigation";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Suspense, useContext, useEffect, useState } from "react";
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
import { FaMinus, FaPlus, FaShare } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BsFillCartPlusFill } from "react-icons/bs";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ProductPageSkeleton } from "@/components/user/skeleton/ProductSkeleton";

export default function Product() {
  let id = useSearchParams().get("id");
  let variant = useSearchParams().get("variant");
  const [api, setApi] = useState<CarouselApi>();
  let axios = useAxios();
  let { baseURL, getCartCount } = useContext(GMContext);
  let [cartQuantity, setCartQuantity] = useState(1);
  let [product, setProduct] = useState<any>(null);
  let [activeImage, setActiveImage] = useState(0);

  const validTypes = ["Size", "Color", "Weight", "Material", "Quantity"];

  // Function to filter variants by type
  const getVariantsByType = (type: string) => {
    return product.variants.filter((item: any) => item.type === type);
  };
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

  let addToCart = async () => {
    let response = await axios.post("/addToCart/", {
      id: id,
      variant: variant,
      quantity: cartQuantity,
    });
    if (response.status == 200) {
      toast.success("Product Added to Cart");
      getCartCount();
    } else {
      toast.error("Something Went Wrong");
    }
  };

  const addItemToCart = () => {
    setCartQuantity(cartQuantity + 1);
  };

  const removeItemFromCart = () => {
    if (cartQuantity == 1) {
      return;
    }
    setCartQuantity(cartQuantity - 1);
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
    <Suspense>
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
                      {product.image && (
                        <CarouselItem>
                          <Card>
                            <CardContent className="flex items-center justify-center p-5 aspect-square">
                              <div
                                className="w-20 h-20 bg-yellow-500 absolute translate-x-32 -translate-y-32 flex justify-center items-center text-cneter text-white font-bold"
                                style={{
                                  clipPath: `polygon(
                                              50% 0%, 61% 35%, 98% 35%, 
                                              68% 57%, 79% 91%, 50% 70%, 
                                              21% 91%, 32% 57%, 2% 35%, 
                                              39% 35%
                                            )`,
                                }}
                              >
                                {product.point}
                              </div>
                              <Image
                                alt={product.name}
                                height={0}
                                width={0}
                                sizes="100vw"
                                className="w-full h-full object-contain object-center"
                                src={`${baseURL}${product["image"]}`}
                              />
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      )}
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
                      {product.image && (
                        <Image
                          onClick={() => api?.scrollTo(0)}
                          alt="product-img"
                          height={0}
                          width={0}
                          sizes="100vw"
                          className={`w-16 h-16 object-contain object-center rounded ${
                            0 == activeImage && `border-black border-2`
                          } `}
                          src={`${baseURL}${product["image"]}`}
                        />
                      )}
                      {product.images &&
                        product.images.map((item: any, index: number) => (
                          <Image
                            onClick={() => api?.scrollTo(index + 1)}
                            alt="product-img"
                            height={0}
                            width={0}
                            sizes="100vw"
                            className={`w-16 h-16 object-contain object-center rounded ${
                              index + 1 == activeImage &&
                              `border-black border-2`
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
                    {product.name}{" "}
                    {variant && (
                      <span className="title-font font-medium text-2xl text-gray-900">
                        (
                        {product.variants &&
                          product.variants.filter(
                            (item: any) => item.id == variant
                          )[0].name}
                        )
                      </span>
                    )}
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
                  <div className="Product-specs m-10">
                    <Table>
                      {/* <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader> */}
                      <TableBody>
                        {product.specifications &&
                          product.specifications.map((item: any) => (
                            <TableRow key={item.id} className="flex">
                              <TableCell className="font-bold bg-blue-100">
                                {item.key} :
                              </TableCell>
                              <TableCell className="bg-blue-200">
                                {item.value}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5"></div>
                  <div className="flex gap-5 flex-col">
                    {variant && (
                      <span className="title-font font-medium text-2xl text-gray-900">
                        (
                        {product.variants &&
                          product.variants.filter(
                            (item: any) => item.id == variant
                          )[0].name}
                        )
                      </span>
                    )}
                    <div className="flex gap-5">
                      <s className="title-font font-medium text-2xl text-red-500">
                        {variant
                          ? product.variants &&
                            "₹" +
                              product.variants.filter(
                                (item: any) => item.id == variant
                              )[0].mrp
                          : `₹${product.mrp}`}
                      </s>
                      <span className="title-font font-medium text-2xl text-gray-900">
                        {variant
                          ? product.variants &&
                            "₹" +
                              product.variants.filter(
                                (item: any) => item.id == variant
                              )[0].offer_price
                          : `₹${product.offer_price}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-evenly w-fit gap-5">
                      <Button
                        className="bg-red-500 hover:bg-red-700"
                        onClick={() => {
                          removeItemFromCart();
                        }}
                      >
                        <FaMinus />
                      </Button>
                      <Input
                        className="w-16 border-black bg-white"
                        value={cartQuantity}
                        type="number"
                        onChange={(e) =>
                          setCartQuantity(parseInt(e.target.value))
                        }
                      />
                      <Button
                        className="bg-blue-500 hover:bg-blue-700"
                        onClick={() => addItemToCart()}
                      >
                        <FaPlus />
                      </Button>
                      <div className="ml-5 flex gap-2 items-ceter">
                        <Button
                          className="flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                          onClick={addToCart}
                        >
                          <BsFillCartPlusFill />
                          ADD
                        </Button>
                        <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500">
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
                  <div>
                    {variant && (
                      <section className="mt-6">
                        <h2 className="text-2xl font-bold mb-4">Base</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          <Link
                            href={`/product?id=${id}`}
                            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-all ease-in"
                          >
                            <h3 className="text-lg font-semibold mb-2">
                              Base Variant
                            </h3>
                            <div className="flex gap-3">
                              {" "}
                              <s className="text-sm text-red-500">
                                ₹{product.mrp}
                              </s>
                              <p className="text-sm text-gray-600 mb-2">
                                ₹{product.offer_price}
                              </p>
                            </div>
                          </Link>
                        </div>
                      </section>
                    )}
                    {product.variants &&
                      validTypes.map(
                        (type) =>
                          getVariantsByType(type).length !== 0 && (
                            <section key={type} className="mt-6">
                              <h2 className="text-2xl font-bold mb-4">
                                {type}
                              </h2>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {getVariantsByType(type).map(
                                  (item: any) =>
                                    item.id.toString() != variant && (
                                      <Link
                                        href={`/product?id=${id}&variant=${item.id}`}
                                        key={item.id}
                                        className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-all ease-in"
                                      >
                                        <h3 className="text-lg font-semibold mb-2">
                                          {item.name}
                                        </h3>
                                        <div className="flex gap-3">
                                          {" "}
                                          <s className="text-sm text-red-500">
                                            ₹{item.mrp}
                                          </s>
                                          <p className="text-sm text-gray-600 mb-2">
                                            ₹{item.offer_price}
                                          </p>
                                        </div>
                                      </Link>
                                    )
                                )}
                              </div>
                            </section>
                          )
                      )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <ProductPageSkeleton />
        )}
      </div>
    </Suspense>
  );
}
