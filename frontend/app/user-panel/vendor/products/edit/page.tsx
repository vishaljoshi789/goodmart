"use client";

import useAxios from "@/app/(utils)/hooks/useAxios";
import ProductEditBasicDetails from "@/components/user/vendor/product/ProductEditBasicDetails";
import ProductEditImages from "@/components/user/vendor/product/ProductEditImages";
import ProductEditProductVariants from "@/components/user/vendor/product/ProductEditProductVariants";
import ProductEditSpecs from "@/components/user/vendor/product/ProductEditSpecs";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  barcode_number: string;
  images: ProductImage[];
  specifications: ProductSpec[];
}

export default function EditProduct() {
  let api = useAxios();
  let path = useSearchParams();
  let id = path.get("id");
  let [product, setProduct] = useState<Product | null>(null);
  let [category, setCategory] = useState<any>(null);
  let [brand, setBrand] = useState<any>(null);
  let getProduct = async () => {
    let response = await api.get(`/vendor/getProductToEdit/${id}/`);
    if (response.status == 200) {
      response.data.category =
        response.data.category && response.data.category.toString();
      response.data.brand =
        response.data.brand && response.data.brand.toString();
      response.data.stock =
        response.data.stock && response.data.stock.toString();
      console.log(response.data);
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
              getBrand={getBrands}
              className="w-fit"
            />
            <ProductEditImages product={product} />
            <div className="flex flex-col gap-5 justify-evenly">
              <ProductEditSpecs product={product} />
              <ProductEditProductVariants product={product} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
