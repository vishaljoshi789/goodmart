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
import exp from "constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { toast } from "sonner";

export default function ProductEditProductVariants({
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
    console.log(updatedSpecs);
    setVariants(updatedSpecs);
  };
  useEffect(() => {
    // if (product.specifications.length !== 0) {
    //   setVariants(product.specifications);
    // }
  }, []);
  async function handleSubmit() {
    if (product == null) {
      toast.error(
        "Something went wrong. Please reload the page and try again."
      );
      return;
    }
    if (variants.length == 0 || variants[0].name == "") {
      toast.error("Please Add Specifications");
      return;
    }
    const formData = new FormData();
    formData.append("variants", JSON.stringify(variants));
    formData.append("product_id", product.id);

    try {
      let response = await api.put(
        `/vendor/updateProductSpecs/${product.id}/`,
        formData
      );
      if (response.status == 201) {
        toast.success("Product Specifications Edited Successfully");
        // router.push("/user-panel/vendor/products");
      } else {
        toast.error("Error Editing Specifications");
      }
    } catch (error) {
      toast.error("Error Editing Specifications");
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
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
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
                    handleVariantChange(index, "value", e.target.value)
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
                  handleVariantChange(index, "value", e.target.value)
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
