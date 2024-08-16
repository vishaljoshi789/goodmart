"use client";

import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import ProductEditBasicDetails from "@/components/user/vendor/product/ProductEditBasicDetails";
import ProductEditImages from "@/components/user/vendor/product/ProductEditImages";
import ProductEditSpecs from "@/components/user/vendor/product/ProductEditSpecs";
import { useContext, useEffect, useState } from "react";

interface ProductImage {
  id: number;
  image: string;
}

interface ProductSpec {
  id: number;
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

export default function EditProduct({ params }: { params: { id: string } }) {
  let { baseURL } = useContext(GMContext);
  let api = useAxios();
  let [product, setProduct] = useState<Product | null>(null);
  let [category, setCategory] = useState<any>(null);
  let [brand, setBrand] = useState<any>(null);
  let getProduct = async () => {
    let response = await api.get(`/vendor/getProductToEdit/${params.id}/`);
    if (response.status == 200) {
      response.data.category = response.data.category.toString();
      response.data.brand = response.data.brand.toString();
      setProduct(response.data);
    }
  };
  let getCategories = async () => {
    let response = await api.get("/getProductCategory/");
    if (response.status == 200) {
      setCategory(response.data);
    }
  };
  let getBrands = async () => {
    let response = await api.get("/getProductBrand/");
    if (response.status == 200) {
      setBrand(response.data);
    }
  };
  useEffect(() => {
    getCategories();
    getBrands();
    getProduct();
  }, []);
  return (
    <div className="p-10">
      <h2 className="font-semibold text-xl text-gray-600">Edit Product</h2>
      <div className="flex gap-10 justify-center w-full flex-col xl:flex-row my-5">
        {product && (
          <>
            <ProductEditBasicDetails
              category={category}
              brand={brand}
              productValues={product}
              className="w-fit"
            />
            <ProductEditImages product={product} />
            <ProductEditSpecs product={product} />
          </>
        )}
      </div>
    </div>
  );
}
