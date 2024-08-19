"use client";
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  let path = useSearchParams();
  let q = path.get("q");
  return <div>{q}</div>;
}
