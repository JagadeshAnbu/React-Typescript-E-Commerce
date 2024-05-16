import React, { FC, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Pagination from "shared/Pagination/Pagination";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import SectionSliderCollections from "components/SectionSliderLargeProduct";
import SectionPromo1 from "components/SectionPromo1";
import ProductCard from "components/ProductCard";
import TabFilters from "./TabFilters";
// import { PRODUCTS } from "data/data";

// Define ProductVariant and Product types
type ProductVariant = {
  id: number; // Change id type to number
  name: string;
  featuredImage: string;
  color: string;
  sizes: string[];
};

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  tags: string[];
  link: "/product-detail/"; // Ensure link matches the expected type
  variants: ProductVariant[]; // Ensure variants are always defined
  variantType?: "color" | "image";
  sizes?: string[];
  allOfSizes?: string[];
  status?: "New in" | "limited edition" | "Sold Out" | "50% Discount";
}

// Define transformProduct function
function transformProduct(data: any): Product {
  const id = data.id;
  const name = data.name;
  const price = data.price;
  const image = data.images; // Placeholder image
  //console.log("Image value:", image); 
  const description = data.shortDescription;
  const category = data.category[0];
  const tags = data.tag;
  const link = "/product-detail/"; // Update link to match the expected type

  const variants = data.variation.map((varItem: any) => ({
    id: varItem.id,
    name: varItem.name,
    featuredImage: varItem.image,
    color: varItem.color,
    sizes: varItem.size.map((size: any) => size.name)
  })) as ProductVariant[];

  const allSizes = data.variation.flatMap((varItem: any) => varItem.size.map((size: any) => size.name));
  const uniqueSizes = Array.from(new Set(allSizes)) as string[];

  let status: "New in" | "limited edition" | "Sold Out" | "50% Discount" | undefined;
  if (data.new) {
    status = "New in";
  } else if (data.discount >= 50) {
    status = "50% Discount";
  }

  return {
    id,
    name,
    price,
    image,
    description,
    category,
    tags,
    link,
    variants,
    variantType: "color",
    sizes: uniqueSizes,
    status
  };
}

export interface PageCollectionProps {
  className?: string;
}

const PageCollection: FC<PageCollectionProps> = ({ className = "" }) => {

  const [Products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  function transformProducts(products: any[]): Product[] {
    return products.map(product => transformProduct(product));
  }
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/products");
      const data = await response.json();
      //console.log(data);
      const transformedProducts = transformProducts(data); // Apply transformation
      //console.log("transformedProducts",transformedProducts);
      setProducts(transformedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div
      className={`nc-PageCollection ${className}`}
      data-nc-id="PageCollection"
    >
      <Helmet>
        <title>Collection || Conperg Ecommerce Template</title>
      </Helmet>

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          {/* HEADING */}
          <div className="max-w-screen-sm">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Man collection
            </h2>
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
              We not only help you design exceptional products, but also make it
              easy for you to share your designs with more like-minded people.
            </span>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />
          <main>
            {/* TABS FILTER */}
            <TabFilters />

            {/* LOOP ITEMS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-10 mt-8 lg:mt-10">
              {Products.map((item, index) => (
                <ProductCard data={item} key={index} />
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
              <Pagination />
              <ButtonPrimary loading>Show me more</ButtonPrimary>
            </div>
          </main>
        </div>

        {/* === SECTION 5 === */}
        <hr className="border-slate-200 dark:border-slate-700" />

        <SectionSliderCollections />
        <hr className="border-slate-200 dark:border-slate-700" />

        {/* SUBCRIBES */}
        <SectionPromo1 />
      </div>
    </div>
  );
};

export default PageCollection;
