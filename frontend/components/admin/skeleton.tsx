import { Skeleton } from "@/components/ui/skeleton";

export const AdminSkeleton = () => {
  return (
    <div>
      <div className="flex flex-col space-y-3 h-screen w-screen justify-center items-center">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div>
        <Skeleton className="h-4 w-[500px]" />
      </div>
    </div>
  );
};
