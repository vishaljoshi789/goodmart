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
    <div>
      <span>
        Found {products.length} Results for - {q}
      </span>
      {products && (
        <div className="flex flex-wrap gap-5">
          {products.map((product: any) => (
            <Card key={product.id} className="w-full md:w-56">
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{product.price}</p>
              </CardContent>
              <CardFooter>
                <p>{product.category}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
