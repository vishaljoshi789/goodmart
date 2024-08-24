"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { TbAlertTriangle } from "react-icons/tb";

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
      <h1>Home</h1>
      <p>Home page</p>
    </div>
  );
}
