"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { TbAlertTriangle } from "react-icons/tb";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CiLocationOn } from "react-icons/ci";

interface Location {
  lat: number | null;
  long: number | null;
  zip: number | null;
}

export default function Home() {
  let [location, setLocation] = useState<Location>({
    lat: null,
    long: null,
    zip: null,
  });
  let [zip, setZip] = useState<any>(null);
  let [editZip, setEditZip] = useState(false);
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
      console.log(location);
      setLocation(location);
      setZip(location.zip);
    }
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
              <InputOTP maxLength={6} onChange={(e) => setZip(e)} value={zip}>
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
        <Alert className="text-green-500 shadow-lg">
          <CiLocationOn className="w-6 h-6 !text-green-500" />
          <AlertTitle className="font-bold">
            Viewing Products for Zipcode {location.zip}
          </AlertTitle>
          <AlertDescription>
            <div>
              <Button
                className="bg-green-500 hover:bg-green-600"
                onClick={() => setEditZip(true)}
              >
                Edit
              </Button>
            </div>
            {editZip && (
              <div>
                <div>
                  <span>Provide Your Zipcode to access the shops near you</span>
                  <InputOTP
                    maxLength={6}
                    onChange={(e) => setZip(e)}
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
      <div className="lg:w-1/2 m-auto p-5">
        <AspectRatio ratio={8 / 5} className="bg-gray-400">
          {/* <Image src="..." alt="Image" className="rounded-md object-cover" /> */}
        </AspectRatio>
      </div>

      <Separator />

      {/* <div className="browse flex justify-center gap-20 text-center my-20">
        <div className="text-3xl bg-red-500 text-white p-10 w-1/4 rounded-full">
          Browse Product
        </div>
        <div className="text-3xl bg-blue-500 text-white p-10 w-1/4 rounded-full">
          Browse Service
        </div>
      </div> */}

      <Separator />

      <ScrollArea>
        <div className="flex gap-3 py-5 justify-evenly">
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 1
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 2
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 3
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 4
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 5
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 6
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 7
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 8
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 9
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 10
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 11
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 12
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 13
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
          <Card className="w-24 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
            <div className="md:w-full h-20 flex items-center bg-gray-100"></div>
            <div className="md:w-full h-full">
              <CardHeader className="p-2 pb-0">
                <CardTitle className="whitespace-nowrap py-2">
                  Category 14
                </CardTitle>
                {/* <CardDescription>Category 1</CardDescription> */}
              </CardHeader>
            </div>
          </Card>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="py-5 px-10">
        <h3 className="text-red-500 font-bold text-2xl font-serif">
          Hot Selling Products
        </h3>
        <ScrollArea>
          <div className="flex gap-3 py-5 justify-between">
            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="py-5 px-10">
        <h3 className="text-red-500 font-bold text-2xl font-serif">
          Deals of the Day
        </h3>
        <ScrollArea>
          <div className="flex gap-3 py-5 justify-between">
            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>

            <Card className="w-full md:w-56 flex md:flex-col items-center rounded-sm md:rounded-md h-fit">
              <div className="md:w-full h-40 flex items-center bg-gray-100"></div>
              <div className="md:w-full h-full">
                <CardHeader className="p-2 pb-0">
                  <CardTitle>Product Name</CardTitle>
                  <CardDescription>Product Description</CardDescription>
                </CardHeader>
                <CardContent className="p-2 pt-2">
                  <div className="flex gap-3">
                    <s>₹2999</s>
                    <b>₹1599</b>
                  </div>
                  <span className="text-red-500 text-lg">-50%</span>
                </CardContent>
                <CardFooter>
                  <p>Product Category</p>
                </CardFooter>
              </div>
            </Card>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <footer className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
              <Image
                src="/images/logo.gif"
                alt="Logo"
                sizes="100vw"
                width={0}
                height={0}
                className="bg-white rounded-full md:w-16 md:h-16 w-10 h-10"
              />
              <span className="ml-3 text-xl">GOODMART</span>
            </a>
            <p className="mt-2 text-sm text-gray-500">
              All your daily needs at one place.
            </p>
          </div>
          <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                CATEGORIES
              </h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    First Link
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Second Link
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Third Link
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Fourth Link
                  </a>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                CATEGORIES
              </h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    First Link
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Second Link
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Third Link
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Fourth Link
                  </a>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                CATEGORIES
              </h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    First Link
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Second Link
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Third Link
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Fourth Link
                  </a>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">
                CATEGORIES
              </h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    First Link
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Second Link
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Third Link
                  </a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">
                    Fourth Link
                  </a>
                </li>
              </nav>
            </div>
          </div>
        </div>
        <div className="bg-gray-100">
          <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © 2025 Tailblocks
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
