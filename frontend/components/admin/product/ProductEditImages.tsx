import { GMContext } from "@/app/(utils)/context/GMContext";
import useAxios from "@/app/(utils)/hooks/useAxios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { toast } from "sonner";

export default function ProductEditImages({ product }: { product: any }) {
  let [imageList, setImageList] = useState([{ file: null }]);
  let api = useAxios();
  let { baseURL } = useContext(GMContext);

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

  const urlToBlob = async (url: string | URL | Request) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  };

  const blobToFile = (blob: Blob, filename: string) => {
    const file = new File([blob], filename, { type: blob.type });
    return file;
  };

  let convertImageToBlob = async () => {
    if (product.images.length !== 0) {
      product.images.forEach((e: any) => {
        let parts = e["image"].split("/");
        let imageName = parts[parts.length - 1];
        urlToBlob(`${baseURL}${e["image"]}`).then((blob) => {
          const filename = imageName;
          e["file"] = blobToFile(blob, filename);
        });
      });
    }
  };

  useEffect(() => {
    convertImageToBlob();
    setTimeout(() => {
      product.images.length !== 0 && setImageList(product.images);
    }, 1000);
  }, [product]);

  async function handleSubmit() {
    if (product == null) {
      toast.error(
        "Something went wrong. Please reload the page and try again."
      );
      return;
    }
    if (imageList.length > 0 && imageList[0].file) {
      const formData = new FormData();
      imageList.forEach((image, index) => {
        formData.append(`image${index + 1}`, image.file ?? "");
      });
      formData.append("product_id", product.id);

      try {
        let response = await api.put(
          `/vendor/updateProductImages/${product.id}/`,
          formData
        );
        console.log(response.data);
        if (response.status == 201) {
          toast.success("Product Images Edited");
        } else {
          toast.error("Error Editing Images");
        }
      } catch (error) {
        toast.error("Error Editing Images");
      }
    } else {
      toast.error("Add atleast 1 Image.");
    }
  }
  return (
    <div className="bg-gray-50 shadow-lg rounded-lg p-5 h-fit">
      <div className="flex justify-between items-center">
        <span className="text-blue-500 font-bold text-sm">
          Edit Product Images
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

            {image.file && (
              <Image
                key={index}
                src={URL.createObjectURL(image.file)} // Use object URL for local preview
                alt="temp-img"
                height={100}
                width={100}
              />
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
      <Button onClick={handleSubmit} className="w-full">
        Submit
      </Button>
    </div>
  );
}
