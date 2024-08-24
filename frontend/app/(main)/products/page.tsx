"use client";
import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function ProductsPage() {
  let path = useSearchParams();
  let q = path.get("q");
  let [products, setProducts] = useState([]);
  let { baseURL } = useContext(GMContext);
  let api = useAxios();
  let getProucts = async () => {
    let res = await fetch(`${baseURL}/getSearchProducts/${q}/`);
    let data = await res.json();
    console.log(data);
    setProducts(data);
  };
  useEffect(() => {
    getProucts();
  }, [q]);
  return (
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
            >
              <div className="md:w-full h-full flex items-center bg-gray-100">
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
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹{product.mrp}</s>
                    <b>₹{product.offer_price}</b>
                  </div>
                  <span className="text-red-500 text-lg">
                    -
                    {`(${(
                      ((product.mrp - product.offer_price) * 100) /
                      product.mrp
                    ).toFixed(2)}%)`}
                  </span>
                </CardContent>
                <CardFooter>
                  <p>{product.category}</p>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
