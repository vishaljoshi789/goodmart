import React from "react";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { toast } from "sonner";

export default function ProductAddProductVariants({
  product,
}: {
  product: any;
}) {
  let [variants, setVariants] = useState([
    { name: "", type: "", offer_price: 0, mrp: 0, stock: 0, expiry_date: "" },
  ]);
  let api = useAxios();
  let router = useRouter();
  const handleAddVariant = () => {
    const newSpec = {
      name: "",
      type: "",
      offer_price: 0,
      mrp: 0,
      stock: 0,
      expiry_date: "",
    };
    setVariants([...variants, newSpec]);
  };

  const handleRemoveVariant = (index: number) => {
    const updatedSpecs = variants.filter((_, i) => i !== index);
    setVariants(updatedSpecs);
  };

  const handleVariantChange = (
    index: number,
    field: string,
    newValue: string
  ) => {
    const updatedSpecs = variants.map((spec, i) =>
      i === index ? { ...spec, [field]: newValue } : spec
    );
    setVariants(updatedSpecs);
  };

  async function handleSubmit() {
    // if (product == null) {
    //   toast.error(
    //     "Something went wrong. Please reload the page and try again."
    //   );
    //   return;
    // }
    if (variants.length == 0 || variants[0].name == "") {
      toast.error("Please Add Variants");
      return;
    }
    const formData = new FormData();
    formData.append("variants", JSON.stringify(variants));
    formData.append("product_id", product.id);
    console.log(formData);

    try {
      let response = await api.post(`/vendor/addProductVariant/`, formData);
      if (response.status == 201) {
        toast.success("Product Variation Added Successfully");
        router.push("/user-panel/vendor/products");
      } else {
        toast.error("Error adding Variation");
      }
    } catch (error) {
      toast.error("Error adding Variation");
    }
  }

  return (
    <div className="bg-gray-50 shadow-lg rounded-lg p-5 h-fit">
      <div className="flex justify-between items-center">
        <span className="text-blue-500 font-bold text-sm">
          Edit Product Variants
        </span>
        <button type="button" onClick={handleAddVariant}>
          <IoMdAddCircle className="text-green-500 text-3xl" />
        </button>
      </div>
      <div className="flex flex-col flex-wrap w-full gap-3 items-center rounded-sm">
        {variants.map((spec, index) => (
          <div
            className="flex flex-col gap-3 items-center border-gray-300 border-2 rounded-sm p-3"
            key={index}
          >
            <div className="flex gap-3 w-full">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="font-medium text-sm">
                  Type
                </label>
                <Select
                  onValueChange={(value) =>
                    handleVariantChange(index, "type", value)
                  }
                  defaultValue={spec.type}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="Size">Size</SelectItem>
                    <SelectItem value="Color">Color</SelectItem>
                    <SelectItem value="Weight">Weight</SelectItem>
                    <SelectItem value="Material">Material</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="font-medium text-sm">
                  Stock
                </label>
                <Input
                  type="text"
                  className="h-5 md:h-10 border rounded md:px-4 bg-gray-50  w-full"
                  value={spec.stock}
                  placeholder="Stock"
                  onChange={(e) =>
                    handleVariantChange(index, "stock", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="font-medium text-sm">
                Name
              </label>
              <Input
                type="text"
                className="h-5 md:h-10 border rounded md:px-4 bg-gray-50  w-full"
                value={spec.name}
                placeholder="Name"
                onChange={(e) =>
                  handleVariantChange(index, "name", e.target.value)
                }
              />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="font-medium text-sm">
                  Offer Price
                </label>
                <Input
                  type="number"
                  className="h-5 md:h-10 border rounded md:px-4 bg-gray-50 w-full"
                  value={spec.offer_price}
                  placeholder="Offer Price"
                  onChange={(e) =>
                    handleVariantChange(index, "offer_price", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="" className="font-medium text-sm">
                  MRP
                </label>
                <Input
                  type="number"
                  className="h-5 md:h-10 border rounded md:px-4 bg-gray-50 w-full"
                  value={spec.mrp}
                  placeholder="MRP"
                  onChange={(e) =>
                    handleVariantChange(index, "mrp", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="" className="font-medium text-sm">
                Expiry Date
              </label>
              <Input
                type="date"
                className="h-5 md:h-10 border rounded md:px-4 bg-gray-50 w-full"
                value={spec.expiry_date}
                placeholder="Expire Date"
                onChange={(e) =>
                  handleVariantChange(index, "expiry_date", e.target.value)
                }
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemoveVariant(index)}
              className="h-auto w-20 md:w-7"
            >
              <IoMdRemoveCircle className="text-red-500 text-3xl" />
            </button>
          </div>
        ))}
      </div>
      <Button className="w-full" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}
