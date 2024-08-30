"use client";
import { useSearchParams } from "next/navigation";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { useContext, useEffect, useState } from "react";
import { GMContext } from "@/app/(utils)/context/GMContext";
import { toast } from "sonner";
import NotFoundPage from "@/components/web/404";

export default function Product() {
  let id = useSearchParams().get("id");
  let api = useAxios();
  let { baseURL } = useContext(GMContext);
  let [product, setProduct] = useState({});
  let getProduct = async () => {
    let response = await fetch(`${baseURL}/getProduct/${id}/`);
    if (response.status == 200) {
      let data = await response.json();
    }
    if (response.status == 404) {
      toast.error("Product Not Found!");
      setProduct(null);
    }
  };
  useEffect(() => {
    getProduct();
  }, []);
  return <div>{product ? id : <NotFoundPage />}</div>;
}
