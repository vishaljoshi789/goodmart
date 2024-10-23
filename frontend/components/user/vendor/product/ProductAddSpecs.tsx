import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { toast } from "sonner";

export default function ProductAddSpecs({
  product,
  setActiveTab,
}: {
  product: any;
  setActiveTab: any;
}) {
  let [specsList, setSpecsList] = useState([{ key: "", value: "" }]);
  let api = useAxios();
  let router = useRouter();
  const handleAddSpec = () => {
    // console.log(specsList)
    const newSpec = { key: "", value: "" };
    setSpecsList([...specsList, newSpec]);
  };

  const handleRemoveSpec = (index: number) => {
    const updatedSpecs = specsList.filter((_, i) => i !== index);
    setSpecsList(updatedSpecs);
  };

  const handleSpecChange = (index: number, field: string, newValue: string) => {
    const updatedSpecs = specsList.map((spec, i) =>
      i === index ? { ...spec, [field]: newValue } : spec
    );
    setSpecsList(updatedSpecs);
  };
  async function handleSubmit() {
    if (product == null) {
      toast.error(
        "Something went wrong. Please reload the page and try again."
      );
      return;
    }
    if (specsList.length == 0 || specsList[0].key == "") {
      toast.error("Please Add Specifications");
      return;
    }
    const formData = new FormData();
    formData.append("specifications", JSON.stringify(specsList));
    formData.append("product_id", product.id);

    try {
      let response = await api.post("/vendor/addProductSpecs/", formData);
      if (response.status == 201) {
        toast.success("Product Specifications Added");
        setActiveTab(4);
        // router.push("/user-panel/vendor/products");
      } else {
        toast.error("Error Adding Specifications");
      }
    } catch (error) {
      toast.error("Error Adding Specifications");
    }
  }

  return (
    <div className="bg-gray-50 shadow-lg rounded-lg p-5 h-fit">
      <div className="flex justify-between items-center">
        <span className="text-blue-500 font-bold text-sm">
          Add Product Specifications
        </span>
        <button type="button" onClick={handleAddSpec}>
          <IoMdAddCircle className="text-green-500 text-3xl" />
        </button>
      </div>
      <div className="flex flex-col flex-wrap w-full gap-3 items-center rounded-sm">
        {specsList.map((spec, index) => (
          <div
            className="flex gap-1 items-center border-gray-300 border-2 rounded-sm px-1"
            key={index}
          >
            <Input
              type="text"
              className="h-5 md:h-10 border rounded md:px-4 bg-gray-50  w-full md:w-auto"
              value={spec.key}
              placeholder="Label"
              onChange={(e) => handleSpecChange(index, "key", e.target.value)}
            />
            <Input
              type="text"
              className="h-5 md:h-10 border rounded md:px-4 bg-gray-50 w-full md:w-auto"
              value={spec.value}
              placeholder="Value"
              onChange={(e) => handleSpecChange(index, "value", e.target.value)}
            />
            <button
              type="button"
              onClick={() => handleRemoveSpec(index)}
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
