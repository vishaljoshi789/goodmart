import { Input } from "@/components/ui/input";
import { useState } from "react";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
export default function ProductAddSpecs() {
  let [specsList, setSpecsList] = useState([{ key: "", value: "" }]);

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

  return (
    <div className="bg-gray-50 shadow-lg rounded-lg p-5 ">
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
    </div>
  );
}
