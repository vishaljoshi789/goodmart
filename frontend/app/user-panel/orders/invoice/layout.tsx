import type { Metadata } from "next";
import type { Viewport } from "next";

export const metadata: Metadata = {
  title: "Invoice",
  description: "Invoice for Goodmart Order",
};

export const viewport: Viewport = {
  width: "1024",
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
};

export default function InvoiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
