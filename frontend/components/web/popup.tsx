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
import useAxios from "@/app/(utils)/hooks/useAxios";
import { GMContext } from "@/app/(utils)/context/GMContext";

// Define the URL path to popup type mapping
const PATH_TO_POPUP_TYPE = {
  "": "Home Page",
  category: "Category",
  brand: "Brand",
  vendor: "Vendor",
  account: "Customer",
  wallet: "Wallet",
  login: "Login",
};

// Type definitions for TypeScript
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

// API function to get popup by type

const PopupManager = () => {
  const [currentPopup, setCurrentPopup] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { baseURL } = useContext(GMContext);
  async function getPopupByType(type) {
    const response = await fetch(`${baseURL}/popups/${type}/`);
    const data = await response.json();
    return data;
  }

  // Get popup type based on current path
  const getPopupTypeForPath = (path) => {
    for (const [urlPath, popupType] of Object.entries(PATH_TO_POPUP_TYPE)) {
      if (path.split("/").at(-1) == urlPath) {
        return popupType;
      }
    }
    return null;
  };

  // Fetch and display popup based on current URL
  useEffect(() => {
    const fetchAndShowPopup = async () => {
      // Reset current popup state
      setCurrentPopup(null);
      setOpen(false);

      // Determine popup type for current path
      const popupType = getPopupTypeForPath(pathname);
      if (!popupType) return;

      try {
        setLoading(true);
        const popup = await getPopupByType(popupType);
        console.log(popup);

        if (popup) {
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
  }, []);

  // Handle popup close
  const handleClose = () => {
    if (currentPopup?.type) {
      // Save dismissed popup type to session storage
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

  // Handle button click
  const handleButtonClick = () => {
    setOpen(false);
    // Navigate if button URL is provided
    if (currentPopup?.button_url) {
      window.location.href = currentPopup.button_url;
    }
  };

  // Don't render anything if no popup or still loading
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
              src={currentPopup.image}
              alt={currentPopup.title || "Popup image"}
              className="object-cover w-full h-full rounded-md"
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

// You can optionally export a function to manually trigger popups as well
export function showPopup(type) {
  return getPopupByType(type);
}

export default PopupManager;
