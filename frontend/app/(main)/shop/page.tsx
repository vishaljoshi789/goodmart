"use client";
import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { BiCartAdd } from "react-icons/bi";
import { FaMinus, FaPlus } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { toast } from "sonner";

export default function Shop() {
  const [shop, setShop] = React.useState<any>();
  const [products, setProducts] = React.useState<any>([]);
  const [cart, setCart] = React.useState<any>([]);
  const { baseURL } = useContext(GMContext);
  const api = useAxios();
  const shopID = useSearchParams().get("id");
  const router = useRouter();

  const getShop = async () => {
    const response = await api.get("/getShop/" + shopID + "/");
    console.log(response.data);
    setShop(response.data);
    getShopProducts();
  };

  const getShopProducts = async () => {
    const response = await api.get("/getShopProducts/" + shopID + "/");
    console.log(response.data);
    setProducts(response.data);
  };

  const addItemToCart = (product: any) => {
    let cartItem = cart.find((item: any) => item.id === product.id);
    if (cartItem) {
      cartItem.quantity += 1;
      setCart([...cart]);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const addMultipleToCart = async () => {
    const response = await api.post("/addMultipleToCart/", { cart });
    if (response.status == 200) {
      toast.success("Added to Cart Successfully");
      router.push("/cart");
    }
  };

  const removeItemFromCart = (product: any) => {
    let cartItem = cart.find((item: any) => item.id === product.id);
    if (cartItem) {
      if (cartItem.quantity === 1) {
        setCart(cart.filter((item: any) => item.id !== product.id));
      } else {
        cartItem.quantity -= 1;
        setCart([...cart]);
      }
    }
  };

  useEffect(() => {
    shopID == null && router.push("/");
    getShop();
  }, []);

  return (
    <div className="p-5">
      {shop && (
        <div>
          <div className="flex flex-col md:flex-row items-center">
            <Image
              src={baseURL + shop?.logo}
              alt={shop?.firm}
              width={720}
              height={720}
              className="w-full h-full md:w-36 md:h-36 object-contain"
            />
            <div className="w-full text-left md:ml-20 flex flex-col md:gap-5">
              <h2 className="font-bold text-blue-800 text-2xl">{shop?.firm}</h2>
              <p className="text-sm text-gray-500">{shop?.description}</p>
              <p className="text-sm font-bold text-green-800 flex items-center gap-2">
                <GoLocation className="text-2xl" />
                {shop?.address.address +
                  `, ` +
                  shop.address.city +
                  `, ` +
                  `(${shop.address.pin})`}
              </p>
            </div>
          </div>
          <div className="mt-5">
            <h2 className="font-bold text-lg">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product: any, index: number) => (
                <div
                  key={index}
                  className="bg-white shadow-md p-5 hover:scale-105 ease-in-out transition-all"
                >
                  <Image
                    src={baseURL + product.image}
                    alt={product.name}
                    width={720}
                    height={720}
                    className="w-full h-40 object-contain"
                  />
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.description}</p>
                  <p className="text-sm text-red-500">
                    Price: {product.offer_price}
                  </p>
                  <div className="flex bg-gray-200 p-2 items-center justify-evenly">
                    <Button
                      className="bg-red-500 hover:bg-red-700"
                      onClick={() => {
                        removeItemFromCart(product);
                      }}
                    >
                      <FaMinus />
                    </Button>
                    <Input
                      className="w-16 border-black bg-white"
                      value={
                        cart.find((item: any) => item.id === product.id)
                          ?.quantity || 0
                      }
                    />
                    <Button
                      className="bg-blue-500 hover:bg-blue-700"
                      onClick={() => addItemToCart(product)}
                    >
                      <FaPlus />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <Button
          onClick={addMultipleToCart}
          className="bg-green-500 hover:bg-green-700 fixed z-10 right-5 bottom-32 rounded-full p-1 size-16 shadow-lg"
        >
          <BiCartAdd className="text-4xl" />
        </Button>
      )}
    </div>
  );
}
