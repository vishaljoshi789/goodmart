import React from "react";

export default function Shop() {
  return (
    <div className="w-full">
      <h1 className="font-extrabold text-2xl">NearBy Shops</h1>
      <div className="shops flex w-full p-10 flex-col">
        <div className="shop w-full bg-red-500 flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 bg-gray-500 h-52"></div>
        </div>
      </div>
    </div>
  );
}
