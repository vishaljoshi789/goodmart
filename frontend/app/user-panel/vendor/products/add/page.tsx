"use client";
import React, { useState, useEffect, useContext } from "react";
import { GMContext } from "@/app/(utils)/context/GMContext";

import ProductAddBasicDetails from "@/components/user/vendor/product/ProductAddBasicDetails";
import ProductAddImages from "@/components/user/vendor/product/ProductAddImages";
import ProductAddSpecs from "@/components/user/vendor/product/ProductAddSpecs";
import ProductAddProductVariants from "@/components/user/vendor/product/ProductAddProductVariants";

export default function AddProduct() {
  let { baseURL } = useContext(GMContext);
  let [category, setCategory] = useState([]);
  let [brand, setBrand] = useState([]);
  let [activeTab, setActiveTab] = useState(1);
  let [product, setProduct] = useState<any>(null);

  let getCategory = async () => {
    let response = await fetch(`${baseURL}/getProductCategory/`);
    let data = await response.json();
    setCategory(data);
  };

  let getBrand = async () => {
    let response = await fetch(`${baseURL}/getProductBrand/`);
    let data = await response.json();
    setBrand(data);
  };

  //
  //   let submitProductForm = async (e) => {
  //     e.preventDefault();
  //     if (imageList[0]["image"] == null) {
  //       toast.error("Submit atleast 1 image");
  //       return;
  //     }
  //     const formData = new FormData();
  //     imageList.forEach((image, index) => {
  //       formData.append(`image${index + 1}`, image.image);
  //     });
  //     formData.append("specification", JSON.stringify(specsList));
  //     formData.append("category", JSON.stringify(categoryList));
  //     formData.append("event", JSON.stringify(eventList));
  //     formData.append("name", e.target.name.value);
  //     formData.append("description", e.target.description.value);
  //     formData.append("mrp", e.target.mrp.value);
  //     formData.append("sell_price", e.target.price.value);
  //     formData.append("stock_quantity", e.target.stock_quantity.value);
  //     formData.append("sell_price", e.target.price.value);
  //     formData.append("video", e.target.video.files[0]);
  //     formData.append("image", e.target.image.files[0]);
  //     try {
  //       let response = await api.post("/vendor/addProduct/", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       console.log(response.data);
  //       if (response.status == 201) {
  //         toast.success("Product Created");
  //         router.push("/vendor/products");
  //       } else {
  //         toast.error("Something went wrong, Recheck your Entered Data");
  //       }
  //     } catch (e) {
  //       console.log(e);
  //       toast.error("Something went wrong, Recheck your Entered Data");
  //     }
  //   };

  useEffect(() => {
    getCategory();
    getBrand();
  }, []);

  return (
    <div className="p-6 flex flex-col">
      <h2 className="font-semibold text-xl text-gray-600">Add Product</h2>
      <div className="flex gap-10 justify-center w-full ">
        {activeTab == 1 ? (
          <ProductAddBasicDetails
            category={category}
            brand={brand}
            setActiveTab={setActiveTab}
            setProduct={setProduct}
            getBrand={getBrand}
          />
        ) : (
          <></>
        )}
        {activeTab == 2 ? (
          <ProductAddImages product={product} setActiveTab={setActiveTab} />
        ) : (
          <></>
        )}
        {activeTab == 3 ? (
          <ProductAddSpecs product={product} setActiveTab={setActiveTab} />
        ) : (
          <></>
        )}
        {activeTab == 4 ? (
          <ProductAddProductVariants product={product} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
