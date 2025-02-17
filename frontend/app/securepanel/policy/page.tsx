import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

export default function Policy() {
  return (
    <div className="p-2">
      <span className="text-xl font-bold">Policies</span>

      <div className="terms p-2 space-y-2">
        <span className="text-lg font-extrabold">Terms and Conditions</span>
        <Textarea />
        <Button>Update</Button>
      </div>
      <div className="return p-2 space-y-2">
        <span className="text-lg font-extrabold">Return Policy</span>
        <Textarea />
        <Button>Update</Button>
      </div>
      <div className="warranty p-2 space-y-2">
        <span className="text-lg font-extrabold">Product Warranty</span>
        <Textarea />
        <Button>Update</Button>
      </div>
      <div className="mission p-2 space-y-2">
        <span className="text-lg font-extrabold">Our Missions and Visions</span>
        <Textarea />
        <Button>Update</Button>
      </div>
    </div>
  );
}
