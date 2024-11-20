"use client";
import { usePathname } from "next/navigation";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let pathname = usePathname();
  pathname = pathname.split("/")[2];

  return (
    <div className="max-w-4xl mx-auto w-full p-6 transition-all ease-in delay-500">
      <div>
        <h2 className="text-2xl font-extrabold text-[#333] inline-block">
          Checkout
        </h2>
      </div>
      <div className="flex items-start mt-12">
        <div className="w-full">
          <div className="flex items-center w-full">
            <div className="w-8 h-8 shrink-0 mx-[-1px] bg-[#333] p-1.5 flex items-center justify-center rounded-full">
              <span className="text-base text-white font-bold">1</span>
            </div>
            <div className="w-full h-[3px] mx-4 rounded-lg bg-gray-300 flex">
              <span
                className={`${
                  pathname == "shipping" ? "w-0" : "w-full"
                } bg-[#333] h-full transition-all ease-in`}
              ></span>
            </div>
          </div>
          <div className="mt-2 mr-4 max-sm:hidden">
            <h6 className="text-base font-bold text-[#333]">Shipping</h6>
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center w-full">
            <div
              className={`w-8 h-8 shrink-0 mx-[-1px] p-1.5 flex items-center justify-center rounded-full ${
                ["billing", "confirm", "finish"].includes(pathname)
                  ? "bg-[#333]"
                  : "bg-gray-400"
              }`}
            >
              <span className="text-base text-white font-bold">2</span>
            </div>
            <div className="w-full h-[3px] mx-4 rounded-lg bg-gray-300 flex">
              <span
                className={`${
                  ["billing", "shipping"].includes(pathname) ? "w-0" : "w-full"
                } bg-[#333] h-full transition-all ease-in`}
              ></span>
            </div>
          </div>
          <div className="mt-2 mr-4 max-sm:hidden">
            <h6
              className={`text-base font-bold ${
                ["billing", "confirm", "finish"].includes(pathname)
                  ? "text-[#333]"
                  : "text-gray-400"
              }`}
            >
              Billing
            </h6>
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center w-full">
            <div
              className={`w-8 h-8 shrink-0 mx-[-1px] p-1.5 flex items-center justify-center rounded-full ${
                ["confirm", "finish"].includes(pathname)
                  ? "bg-[#333]"
                  : "bg-gray-400"
              }`}
            >
              <span className="text-base text-white font-bold">3</span>
            </div>
            <div className="w-full h-[3px] mx-4 rounded-lg bg-gray-300 flex">
              <span
                className={`${
                  ["billing", "shipping", "confirm"].includes(pathname)
                    ? "w-0"
                    : "w-full"
                } bg-[#333] h-full transition-all ease-in`}
              ></span>
            </div>
          </div>
          <div className="mt-2 mr-4 max-sm:hidden">
            <h6
              className={`text-base font-bold ${
                ["confirm", "finish"].includes(pathname)
                  ? "text-[#333]"
                  : "text-gray-400"
              }`}
            >
              Confirm
            </h6>
          </div>
        </div>
        <div>
          <div className="flex items-center">
            <div className="w-8 h-8 shrink-0 mx-[-1px] bg-gray-300 p-1.5 flex items-center justify-center rounded-full">
              <span className="text-base text-white font-bold">4</span>
            </div>
          </div>
          <div className="mt-2 max-sm:hidden">
            <h6 className="text-base font-bold text-gray-400">Finish</h6>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
