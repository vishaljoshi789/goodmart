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

interface Location {
  lat: number | null;
  long: number | null;
}

export default function Home() {
  let [location, setLocation] = useState<Location>({ lat: null, long: null });
  let showPosition = (position: GeolocationPosition) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    console.log(lat, long);
    setLocation({ lat: lat, long: long });
    localStorage.setItem("location", JSON.stringify({ lat: lat, long: long }));
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
    }
  }, []);
  return (
    <div>
      {!location.lat || !location.lat ? (
        <Alert className="text-yellow-500 shadow-lg">
          <TbAlertTriangle className="w-6 h-6 !text-yellow-500" />
          <AlertTitle className="font-bold">Location Not Find.</AlertTitle>
          <AlertDescription>
            Allow location access to get the most accurate product availability.
            <Button
              onClick={getLocation}
              className="bg-yellow-500 hover:bg-yellow-600 ml-5"
            >
              Allow Location{" "}
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <div>
          {location.lat} {location.long}
        </div>
      )}
      <div className="lg:w-1/2 m-auto p-5">
        <AspectRatio ratio={8 / 5} className="bg-gray-400">
          {/* <Image src="..." alt="Image" className="rounded-md object-cover" /> */}
        </AspectRatio>
      </div>

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
    </div>
  );
}
