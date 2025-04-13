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
      <DialogContent className="sm:max-w-md">
        {currentPopup.title && (
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {currentPopup.title}
            </DialogTitle>
          </DialogHeader>
        )}

        {currentPopup.image && (
          <div className="relative w-full h-48 mb-4">
            <img
              src={baseURL + currentPopup.image}
              alt={currentPopup.title || "Popup image"}
              className="object-fillß w-full h-full rounded-md"
            />
          </div>
        )}

        <DialogDescription className="text-base">
          <div dangerouslySetInnerHTML={{ __html: currentPopup.content }} />
        </DialogDescription>

        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>

          {currentPopup.button_text && (
            <Button onClick={handleButtonClick}>
              {currentPopup.button_text}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Optional manual usage of popup fetch
export async function ShowPopup(type: string, baseURL: string) {
  return GetPopupByType(type, baseURL);
}

export default PopupManager;
