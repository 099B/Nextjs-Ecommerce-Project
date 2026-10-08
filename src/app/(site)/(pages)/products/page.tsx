import React, { Suspense } from "react";
import Products from "@/components/Products";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
  // other metadata
};

const ProductsPage = () => {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Products />
      </Suspense>
    </main>
  );
};

export default ProductsPage;
