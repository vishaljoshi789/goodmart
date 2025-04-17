"use client";
import { GMContext } from "@/app/(utils)/context/GMContext";
import { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Image } from "@nextui-org/image";
import { MdCategory } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Advertisement from "@/components/web/Ad";

export default function Categories() {
  const router = useRouter();
  const { baseURL } = useContext(GMContext);
  const [category, setCategory] = useState<any>([]);
  const searchParam = useSearchParams();

  const [ad, setAd] = useState<any>(null);

  const getAd = async () => {
    const response = await fetch(`${baseURL}/getAdsByPage/Category/`);
    const data = await response.json();
    setAd(data);
  };

  const getCategories = async () => {
    const categoryID = searchParam.get("id");
    const endpoint = categoryID
      ? `getSubCategory/${categoryID}`
      : `getParentCategory`;

    const response = await fetch(`${baseURL}/${endpoint}/`);
    const data = await response.json();

    if (categoryID && data.length === 0) {
      router.replace(`/products?category=${categoryID}`);
    } else {
      setCategory(data);
    }
  };

  useEffect(() => {
    getCategories();
    getAd();
  }, [searchParam]); // Trigger on search parameter change

  return (
    <>
      {ad && ad.image && (
        <Advertisement
          imageUrl={baseURL + ad?.image}
          linkUrl={ad?.link}
          imageAlt={ad?.page}
        />
      )}
      <div className="p-5">
        <h2 className="font-bold text-2xl text-red-500">Categories</h2>
        <div className="gap-2 grid grid-cols-2 sm:grid-cols-4 p-5">
          {category.map((item: any, index: number) => (
            <Card key={index} className="shadow-md">
              <Link href={`/categories?id=${item.id}`} className="w-full">
                <CardContent className="overflow-visible p-0">
                  {item.image ? (
                    <Image
                      alt={item.category}
                      className="w-full object-contain h-[140px] m-auto"
                      radius="lg"
                      shadow="sm"
                      src={baseURL + item.image}
                      width="100%"
                    />
                  ) : (
                    <MdCategory className="w-full h-[140px] text-center text-4xl text-gray-400" />
                  )}
                </CardContent>
                <CardFooter className="text-small justify-between">
                  <b>{item.name}</b>
                </CardFooter>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
