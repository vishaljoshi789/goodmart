// components/Advertisement.tsx
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AdvertisementProps {
  /**
   * The URL of the image to display in the advertisement.
   */
  imageUrl: string;

  /**
   * The URL to navigate to when the advertisement is clicked.
   */
  linkUrl: string;

  /**
   * Optional alt text for the image.
   */
  imageAlt?: string;

  /**
   * Optional width of the advertisement component (default: 300px).
   */
  width?: string;

  /**
   * Optional height of the advertisement component (default: 250px).
   */
  height?: string;

  /**
   * Optional class name to apply to the advertisement container.
   */
  className?: string;

  /**
   * Optional label to display on the ad (default: "Advertisement").
   */
  adLabel?: string;

  /**
   * Optional tracking ID for analytics.
   */
  trackingId?: string;
}

export default function Advertisement({
  imageUrl,
  linkUrl,
  imageAlt = "Advertisement",
  width = "100vw",
  height = "250px",
  className,
  adLabel = "Advertisement",
  trackingId,
}: AdvertisementProps) {
  const [impressionLogged, setImpressionLogged] = useState(false);

  // Log impression when component mounts
  useEffect(() => {
    if (!impressionLogged && trackingId) {
      // Implement your analytics tracking here
      console.log(`Ad impression logged: ${trackingId}`);
      setImpressionLogged(true);
    }
  }, [impressionLogged, trackingId]);

  const handleClick = () => {
    if (trackingId) {
      // Implement click tracking here
      console.log(`Ad click tracked: ${trackingId}`);
    }
  };

  return (
    <Card className={cn("overflow-hidden relative", className)}>
      <Link
        href={linkUrl}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        <CardContent className="p-0 cursor-pointer transition-transform hover:scale-105 duration-300">
          <div
            style={{
              position: "relative",
              width: `${width}`,
              height: `${height}`,
            }}
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              style={{ objectFit: "contain" }}
              priority
              sizes={`${width}`}
            />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
