"use client";

import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GMContext } from "@/app/(utils)/context/GMContext";

// Define the URL path to popup type mapping
const PATH_TO_POPUP_TYPE: Record<string, string> = {
  "": "Home Page",
  category: "Category",
  brand: "Brand",
  vendor: "Vendor",
  account: "Customer",
  wallet: "Wallet",
  login: "Login",
};

// --- TypeScript Interface (optional) ---
interface PopupData {
  id: number;
  title: string | null;
  type: string | null;
  status: boolean;
  image: string | null;
  content: string;
  button_text: string | null;
  button_url: string | null;
}

// --- Move GetPopupByType outside so it's reusable ---
export async function GetPopupByType(
  type: string,
  baseURL?: string
): Promise<PopupData | null> {
  if (!baseURL) return null;
  const response = await fetch(`${baseURL}/popups/${type}/`);
  if (!(response.status == 200)) {
    return null;
  }
  const data = await response.json();
  return data;
}

const PopupManager = () => {
  const [currentPopup, setCurrentPopup] = useState<PopupData | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { baseURL } = useContext(GMContext);

  const getPopupTypeForPath = (path: string): string | null => {
    for (const [urlPath, popupType] of Object.entries(PATH_TO_POPUP_TYPE)) {
      if (path.split("/").at(-1) == urlPath) {
        return popupType;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchAndShowPopup = async () => {
      setCurrentPopup(null);
      setOpen(false);

      const popupType = getPopupTypeForPath(pathname);
      if (!popupType || !baseURL) return;

      try {
        setLoading(true);
        const popup = await GetPopupByType(popupType, baseURL);
        if (popup) {
          if (popup.status == false) return;
          setCurrentPopup(popup);
          setOpen(true);
        }
      } catch (error) {
        console.error("Error fetching popup:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndShowPopup();
  }, [pathname, baseURL]);

  const handleClose = () => {
    if (currentPopup?.type) {
      const dismissedTypes = JSON.parse(
        sessionStorage.getItem("dismissedPopupTypes") || "[]"
      );
      if (!dismissedTypes.includes(currentPopup.type)) {
        dismissedTypes.push(currentPopup.type);
        sessionStorage.setItem(
          "dismissedPopupTypes",
          JSON.stringify(dismissedTypes)
        );
      }
    }
    setOpen(false);
  };

  const handleButtonClick = () => {
    setOpen(false);
    if (currentPopup?.button_url) {
      window.location.href = currentPopup.button_url;
    }
  };

  if (!currentPopup || loading) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 border-0 bg-transparent w-auto max-h-screen overflow-hidden">
        <div className="relative w-full h-full max-w-full sm:max-w-lg md:max-w-md lg:max-w-sm mx-auto">
          {/* Container that maintains aspect ratio of the image */}
          <div className="relative w-full h-auto">
            {/* The border image */}
            <img
              src={baseURL + currentPopup.image}
              alt="Dialog Border"
              className="w-full h-auto object-contain"
            />

            {/* Content overlay - positioned absolutely within the image */}
            <div className="absolute inset-0 flex flex-col p-3 sm:p-5">
              {currentPopup.title && (
                <DialogHeader className="pb-1 sm:pb-2">
                  <DialogTitle className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                    {currentPopup.title}
                  </DialogTitle>
                </DialogHeader>
              )}

              <DialogDescription className="text-xs sm:text-sm md:text-base flex-1 overflow-y-auto my-1 sm:my-2">
                <div
                  dangerouslySetInnerHTML={{ __html: currentPopup.content }}
                />
              </DialogDescription>

              <DialogFooter className="flex flex-row justify-between gap-2 pt-1 sm:pt-2">
                {/* <Button 
                    variant="outline" 
                    onClick={handleClose}
                    className="text-xs sm:text-sm h-6 sm:h-8 px-2 py-0"
                  >
                    Close
                  </Button> */}

                {currentPopup.button_text && (
                  <Button
                    onClick={handleButtonClick}
                    className="text-xs sm:text-sm h-6 sm:h-8 px-2 py-0"
                  >
                    {currentPopup.button_text}
                  </Button>
                )}
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Optional manual usage of popup fetch
export async function ShowPopup(type: string, baseURL: string) {
  return GetPopupByType(type, baseURL);
}

export default PopupManager;
