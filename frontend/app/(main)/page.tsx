"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { TbAlertTriangle } from "react-icons/tb";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CiLocationOn } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { TbCategoryFilled } from "react-icons/tb";
import Link from "next/link";
import { GMContext } from "../(utils)/context/GMContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Location {
  lat: number | null;
  long: number | null;
  zip: number | null;
}

export default function Home() {
  let [featuredCategory, setFeaturedCategory] = useState([]);
  let [location, setLocation] = useState<Location>({
    lat: null,
    long: null,
    zip: null,
  });
  let [zip, setZip] = useState<any>(null);
  let [editZip, setEditZip] = useState(false);
  let { baseURL } = useContext(GMContext);

  let [homepageBanners, setHomepageBanners] = useState([]);
  let [homepageSections, setHomepageSections] = useState([]);

  let getHomepageBanners = async () => {
    let response = await fetch(`${baseURL}/getHomepageBanners/`);
    let data = await response.json();
    console.log(data);
    setHomepageBanners(data);
  };

  let getHomepageSections = async () => {
    let response = await fetch(`${baseURL}/getHomepageSections/`);
    let data = await response.json();
    console.log(data);
    setHomepageSections(data);
  };

  let getCategory = async () => {
    let response = await fetch(`${baseURL}/getFeaturedCategory/`);
    let data = await response.json();
    setFeaturedCategory(data);
  };
  let showPosition = (position: GeolocationPosition) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    console.log(lat, long);
    setLocation({ lat: lat, long: long, zip: zip });
    localStorage.setItem(
      "location",
      JSON.stringify({ lat: lat, long: long, zip: zip })
    );
    window.location.reload();
  };
  let showError = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
    }
  };

  let getLocation = () => {
    console.log("Getting location");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  useEffect(() => {
    if (localStorage.getItem("location") != null) {
      let location = JSON.parse(localStorage.getItem("location") || "");
      setLocation(location);
      setZip(location.zip);
    }
    getCategory();
    getHomepageBanners();
    getHomepageSections();
  }, []);
  return (
    <div>
      {!location.zip ? (
        <Alert className="text-yellow-500 shadow-lg">
          <TbAlertTriangle className="w-6 h-6 !text-yellow-500" />
          <AlertTitle className="font-bold">Location Not Find.</AlertTitle>
          <AlertDescription>
            <div>
              <span>Provide Your Zipcode to access the shops near you</span>
              <InputOTP
                maxLength={6}
                onChange={(e: any) => setZip(e)}
                value={zip}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              onClick={getLocation}
              className="bg-yellow-500 hover:bg-yellow-600 my-5"
              disabled={!zip || zip.length < 6}
            >
              Allow Location{" "}
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="text-green-500 shadow-lg p-1">
          <AlertTitle className="text-xs flex items-center">
            <CiLocationOn className="text-xl !text-green-500 my-auto" />
            <span>Delivering to Zipcode {location.zip} </span>
            <Button
              className="w-fit text-xs text-black underline"
              variant={"ghost"}
              onClick={() => setEditZip(!editZip)}
            >
              <IoIosArrowDown />
            </Button>
          </AlertTitle>
          <AlertDescription>
            <div></div>
            {editZip && (
              <div>
                <div>
                  <span>Provide Your Zipcode to access the shops near you</span>
                  <InputOTP
                    maxLength={6}
                    onChange={(e: any) => setZip(e)}
                    value={zip}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  onClick={getLocation}
                  className="bg-green-500 hover:bg-green-600 my-5"
                  disabled={!zip || zip.length < 6}
                >
                  Allow Location{" "}
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      <div>
        <ul className="flex gap-5 w-full py-2 px-1">
          <li className={`rounded-md hover:bg-gray-200`}>
            <Link
              href={"/categories"}
              className="flex justify-center items-center flex-col"
            >
              <TbCategoryFilled className="text-4xl text-red-500" />
              <span className="text-xs">Categories</span>
            </Link>
          </li>
          {featuredCategory.map((item: any) => (
            <li className={`rounded-md hover:bg-gray-200`} key={item.id}>
              <Link
                href={`/products?category=${item.id}`}
                className="flex justify-center items-center flex-col"
              >
                {item.image && (
                  <Image
                    src={baseURL + item.image}
                    width={0}
                    height={0}
                    alt={item.name}
                    sizes="100vw"
                    className="w-9 h-9"
                  />
                )}
                <span className="text-xs">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="lg:w-3/5 w-full">
          <Carousel
            className="w-full"
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="">
              {homepageBanners &&
                homepageBanners.map((e: any, index) => (
                  <CarouselItem className="w-full" key={index}>
                    <AspectRatio ratio={16 / 6} className="w-full">
                      <Link href={e.link}>
                        <Image
                          alt="Banner"
                          src={`${baseURL}${e.image}`}
                          width={0}
                          height={0}
                          sizes="100vw"
                          className="object-cover w-full h-full"
                        />
                      </Link>
                    </AspectRatio>
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      <Separator className="my-5" />

      {homepageSections.map((section: any, index) =>
        section.name == "Shop by Category" ? (
          <section className="mb-12 px-4 md:px-6 lg:px-8" key={section.id}>
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Shop by Category
              </h2>
              <p className="text-gray-600">
                Explore our wide range of collections
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {section.items.map((category: any, index: number) => (
                <Link
                  href={`/products?category=${category.category.id}`}
                  key={index}
                  className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-start justify-between">
                      <div className="w-full">
                        <div
                          className={`inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-r ${category.color} text-white shadow-lg`}
                        >
                          {/* <category.icon className="h-5 w-5 md:h-6 md:w-6" /> */}
                          <Image
                            alt={category.category.name}
                            src={baseURL + category.category.image}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-6 h-6 md:w-8 md:h-8"
                          />
                        </div>
                        <div className="flex justify-between items-center mt-3 md:mt-4">
                          <h3 className="text-base md:text-lg font-semibold">
                            {category.category.name}
                          </h3>
                        </div>
                        <p className="mt-1 text-xs md:text-sm text-gray-500 line-clamp-2">
                          {category.category.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 md:mt-4 flex items-center justify-between">
                      <span className="text-xs md:text-sm font-medium text-gray-500 group-hover:text-gray-900 transition-colors">
                        Explore Category
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-900 transition-all transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  <div
                    className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%)`,
                    }}
                  />
                </Link>
              ))}
            </div>

            {/* Amazon-style Deal Cards */}

            {/* Personalized Recommendations */}
          </section>
        ) : section.name == "Top Deals" ? (
          <section className="mb-12 px-4 md:px-6 lg:px-8" key={section.id}>
            <div className="mt-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Today's Deals
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {section.items.map((deal: any) => (
                  <Link
                    href={`/product?id=${deal.product.id}`}
                    key={deal.id}
                    className="bg-white rounded-lg shadow-sm p-4"
                  >
                    <Image
                      src={baseURL + deal.product.image}
                      alt={deal.product.name}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="object-cover w-full h-32"
                    />
                    <div className="space-y-2">
                      <span className="inline-block bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded">
                        Up to{" "}
                        {(
                          ((deal.product.mrp - deal.product.offer_price) /
                            deal.product.mrp) *
                          100
                        ).toFixed(2)}
                        % off
                      </span>
                      <p className="text-sm font-medium line-clamp-2">
                        {deal.product.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : section.name == "Recommended for You" ? (
          <section key={section.id}>
            <div className="mt-8 bg-white rounded-xl p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Recommended for you
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {section.items.map((item: any) => (
                  <Link
                    href={
                      section.content_type == "Category"
                        ? `/products?category=${item.category.id}`
                        : `/product?id=${item.product.id}`
                    }
                    key={item.id}
                    className="space-y-2"
                  >
                    <Image
                      src={
                        baseURL +
                        (section.content_type == "Category"
                          ? item.category.image
                          : item.product.image)
                      }
                      alt={
                        section.content_type == "Category"
                          ? item.category.name
                          : item.product.name
                      }
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="object-cover w-full h-32"
                    />
                    <p className="text-sm font-medium line-clamp-2">
                      {section.content_type == "Category"
                        ? item.category.name
                        : item.product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {section.content_type == "Product" &&
                        "₹" + item.product.offer_price}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : (
          section.name == "Featured Items" && (
            <section className="mb-8" key={section.id}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Featured Items</h2>
                <p className="text-gray-600">
                  Explore our wide range of collections
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {section.items.map((item: any, index: number) => (
                  <Link
                    href={
                      section.content_type == "Category"
                        ? `/products?category=${item.category.id}`
                        : `/product?id=${item.product.id}`
                    }
                    key={index}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl"
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0">
                        <Image
                          src={
                            baseURL +
                            (section.content_type == "Category"
                              ? item.category.image
                              : item.product.image)
                          }
                          alt={
                            section.content_type == "Category"
                              ? item.category.name
                              : item.product.name
                          }
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                          priority={index === 0}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/30" />
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                      <h3 className="text-lg font-bold">
                        {section.content_type == "Category"
                          ? item.category.name
                          : item.product.name}
                      </h3>
                      <p className="text-sm opacity-90">Shop Now →</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        )
      )}
      {/* Categories & Products */}
      {/* <section className="mb-8">
        <Tabs defaultValue="All Products" className="space-y-6">
          <ScrollArea className="w-full">
            <TabsList className="inline-flex w-full justify-start bg-transparent border-b border-rose-100">
              {featuredCategory.map((category: any) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex-1 min-w-[100px] text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-t-lg"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>

          {featuredCategory.map((category: any) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid grid-cols-2 gap-2  sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
                {products.map((product) => (
                  <ProductCard key={product._id} item={product} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section> */}

      {/* Featured Categories */}

      {/* Newsletter Section */}
      {/* <section className="my-12 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 p-6 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Join Our Newsletter</h2>
          <p className="mb-4 opacity-90">
            Get updates on new arrivals and special offers!
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
            <Button className="bg-white text-rose-500 hover:bg-white/90">
              Subscribe
            </Button>
          </div>
        </div>
      </section> */}
      <footer className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
              <Image
                src="/images/logo2.png"
                alt="Logo"
                sizes="100vw"
                width={0}
                height={0}
                className="bg-white rounded-full w-full"
              />
            </a>
            <p className="mt-2 text-sm text-gray-500">
              All your daily needs at one place.
            </p>
          </div>
          <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                Terms & Conditions
              </h2>
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                Return Policy
              </h2>
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                Product Warranty
              </h2>
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                Our Mission and Vision
              </h2>
            </div>
          </div>
        </div>
        <div className="bg-gray-100">
          <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © 2025 GOODMART
            </p>
            <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
              <a className="text-gray-500">
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a className="ml-3 text-gray-500">
                <svg
                  fill="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a className="ml-3 text-gray-500">
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </a>
              <a className="ml-3 text-gray-500">
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="0"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="none"
                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                  ></path>
                  <circle cx="4" cy="4" r="2" stroke="none"></circle>
                </svg>
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
