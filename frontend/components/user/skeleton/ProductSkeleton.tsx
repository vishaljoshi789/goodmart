import { Skeleton } from "@/components/ui/skeleton";

export const ProductPageSkeleton = () => {
  return (
    <div className="flex flex-col space-y-6 p-4 w-full max-w-md mx-auto">
      {/* Product Image */}
      <Skeleton className="h-[250px] w-[300px] rounded-xl mx-auto" />

      {/* Thumbnails */}
      <div className="flex space-x-2 mx-auto">
        <Skeleton className="h-[50px] w-[50px] rounded-md" />
        <Skeleton className="h-[50px] w-[50px] rounded-md" />
      </div>

      {/* Product Title & Rating */}
      <div className="w-full space-y-2 text-center">
        <Skeleton className="h-5 w-32" /> {/* Brand */}
        <Skeleton className="h-7 w-48" /> {/* Product Name */}
        <div className="flex space-x-2">
          <Skeleton className="h-4 w-24" /> {/* Rating */}
          <Skeleton className="h-4 w-12" /> {/* Reviews */}
        </div>
      </div>

      {/* Description */}
      <Skeleton className="h-4 w-60" />

      {/* Weight */}
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-12" />
      </div>

      {/* Price */}
      <div className="flex space-x-3 items-center">
        <Skeleton className="h-6 w-20" /> {/* Discounted Price */}
        <Skeleton className="h-6 w-28" /> {/* Original Price */}
      </div>

      {/* Quantity Selector & Add to Cart */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-lg" /> {/* Decrease Btn */}
        <Skeleton className="h-10 w-12 rounded-md" /> {/* Quantity Input */}
        <Skeleton className="h-10 w-10 rounded-lg" /> {/* Increase Btn */}
        <Skeleton className="h-10 w-24 rounded-md" /> {/* Add to Cart Btn */}
      </div>

      {/* Bulk Price */}
      <div className="w-full">
        <Skeleton className="h-5 w-20" /> {/* Bulk Text */}
        <div className="flex space-x-3">
          <Skeleton className="h-6 w-20" /> {/* Discounted Price */}
          <Skeleton className="h-6 w-28" /> {/* Original Price */}
        </div>
      </div>
    </div>
  );
};
