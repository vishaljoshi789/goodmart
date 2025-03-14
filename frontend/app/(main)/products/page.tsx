"use client";
import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { BsFillCartPlusFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProductsPage() {
  let path = useSearchParams();
  let q = path.get("q");
  let router = useRouter();
  let category = path.get("category");
  let brand = path.get("brand");
  let [products, setProducts] = useState([]);
  let { baseURL, getCartCount } = useContext(GMContext);
  let api = useAxios();
  let addToCart = async (id: any, variant = null, quantity = 1) => {
    let response = await api.post("/addToCart/", {
      id: id,
      variant: variant,
      quantity: quantity,
    });
    if (response.status == 200) {
      toast.success("Product Added to Cart");
      getCartCount();
    } else {
      toast.error("Something Went Wrong");
    }
  };

  let getProucts = async () => {
    let res = await fetch(
      `${baseURL}/getSearchProducts/${q}/${category}/${brand}`
    );
    let data = await res.json();
    console.log(data);
    setProducts(data);
  };
  useEffect(() => {
    getProucts();
  }, [q]);
  return (
    <Suspense>
      <div className="flex flex-col gap-3 p-2">
        <span className="font-bold text-gray-500">
          Found {products.length} Results for - {q}
        </span>
        {products && (
          <div className="flex flex-wrap justify-evenly gap-2">
            {products.map((product: any) => (
              <Card
                key={product.id}
                className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md"
                onClick={() => router.push(`/product?id=${product.id}`)}
              >
                <div className="md:w-full h-full flex items-center">
                  <Image
                    src={`${baseURL}${product.image}`}
                    alt={product.name}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="h-36 w-36 md:w-full md:h-48"
                  />
                </div>
                <div className="md:w-full h-full">
                  <CardHeader className="p-2 pb-0">
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>
                      {product.description.length > 30
                        ? product.description.slice(0, 30)
                        : product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 pt-2">
                    <div className="flex gap-3 items-center">
                      <s className="text-xs text-gray-700">₹{product.mrp}</s>
                      <b>₹{product.offer_price}</b>
                    </div>
                    <div>
                      <span className="text-red-500 text-sm whitespace-nowrap font-bold">
                        -
                        {`(${(
                          ((product.mrp - product.offer_price) * 100) /
                          product.mrp
                        ).toFixed(2)}%)`}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-evenly items-center gap-5">
                    <p>{product.category}</p>
                    <Button
                      className="flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
                      onClick={(e) => {
                        console.log("hello");
                        e.stopPropagation(); // Prevent event propagation to Link
                        addToCart(product.id);
                        const button = e.currentTarget as HTMLButtonElement; // Use currentTarget instead of target
                        button.innerHTML = "Added";
                        button.style.background = "none";
                        button.style.color = "green";
                        button.disabled = true;
                      }}
                    >
                      <BsFillCartPlusFill /> ADD
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Suspense>
  );
}
