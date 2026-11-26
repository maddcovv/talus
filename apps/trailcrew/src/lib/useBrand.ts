import { useEffect } from "react";

/** Points the document at a brand and scheme. Components only read variables. */
export function useBrand(brand: "consumer" | "enterprise", scheme: "light" | "dark" = "light") {
  useEffect(() => {
    document.documentElement.dataset.brand = brand;
    document.documentElement.dataset.scheme = scheme;
  }, [brand, scheme]);
}
