import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { IoMdAddCircle, IoMdRemove, IoMdRemoveCircle } from "react-icons/io";
export default function ProductAddImages({ product }: { product: any }) {
  let [imageList, setImageList] = useState([{ file: null }]);

  const handleAddImage = () => {
    const newImage = { file: null };
    setImageList([...imageList, newImage]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = imageList.filter((_, i) => i !== index);
    setImageList(updatedImages);
  };

  const handleImageChange = (index: number, file: any) => {
    const updatedImages = [...imageList];
    updatedImages[index].file = file;
    setImageList(updatedImages);
  };

  async function Submit() {
    console.log(imageList);
  }
  return (
    <div className="bg-gray-50 shadow-lg rounded-lg p-5 ">
      <div className="flex justify-between items-center">
        <span className="text-blue-500 font-bold text-sm">
          Add Product Images
        </span>
        <button type="button" onClick={handleAddImage}>
          <IoMdAddCircle className="text-green-500 text-3xl" />
        </button>
      </div>
      <div className="flex flex-col gap-5 my-3">
        {imageList.map((image, index) => (
          <div
            className="flex flex-col justify-center gap-1 items-center border-gray-300 border-2 rounded-sm "
            key={index}
          >
            <Input
              type="file"
              className="h-10 border rounded bg-gray-50 w-full md:w-auto"
              placeholder="Image"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageChange(index, file);
                }
              }}
              accept="image/*"
            />

            {image.file ? (
              <Image
                key={index}
                src={URL.createObjectURL(image.file)} // Use object URL for local preview
                alt="temp-img"
                height={100}
                width={100}
              />
            ) : (
              <></>
            )}
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="h-auto"
            >
              <IoMdRemoveCircle className="text-red-500 text-3xl" />
            </button>
          </div>
        ))}
      </div>
      <Button onClick={Submit}>Submit</Button>
    </div>
  );
}
