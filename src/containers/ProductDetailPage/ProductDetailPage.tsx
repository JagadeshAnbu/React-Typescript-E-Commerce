import React, { FC, useState, useEffect, ReactElement, useContext } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import LikeButton from "components/LikeButton";
import AccordionInfo from "./AccordionInfo";
import { StarIcon } from "@heroicons/react/24/solid";
import BagIcon from "components/BagIcon";
import NcInputNumber from "components/NcInputNumber";
import { NoSymbolIcon, ClockIcon, SparklesIcon } from "@heroicons/react/24/outline";
import IconDiscount from "components/IconDiscount";
import Prices from "components/Prices";
import toast from "react-hot-toast";
import SectionSliderProductCard from "components/SectionSliderProductCard";
import Policy from "./Policy";
import ReviewItem from "components/ReviewItem";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import SectionPromo2 from "components/SectionPromo2";
import ModalViewAllReviews from "./ModalViewAllReviews";
import NotifyAddTocart from "components/NotifyAddTocart";
import { useParams } from "react-router-dom";
import { CartContext } from "containers/CartContext";

export interface ProductDetailPageProps {
  className?: string;
}

type ProductVariant = {
  id: number;
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

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sizes?: string[]; // Add the sizes property here
}


function transformProduct(data: any): Product {
  const id = data.id;
  const name = data.name;
  const price = parseFloat(data.price); // Parse price as float
  const image = data.images[0]; // Use the first image as the main image
  const description = data.shortDescription;
  const category = data.category[0];
  const tags = data.tag;
  const link = "/product-detail/"; // Update link to match the expected type

  const variants = data.variation.map((varItem: any) => ({
    id: varItem.id,
    name: varItem.color, // Use color as the name of the variant
    featuredImage: varItem.image,
    color: varItem.color,
    sizes: varItem.size.map((size: any) => size.name)
  })) as ProductVariant[];

  const allSizes = data.variation.flatMap((varItem: any) => varItem.size.map((size: any) => size.name));
  const uniqueSizes = Array.from(new Set(allSizes)) as string[];

  let status: "New in" | "limited edition" | "Sold Out" | "50% Discount" | undefined;
  // Check if the offer end date is in the future
  const offerEndDate = new Date(data.offerEnd);
  const currentDate = new Date();
  if (data.new || offerEndDate > currentDate) {
    status = "New in";
  } else if (parseFloat(data.discount) >= 50) { // Parse discount as float
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

const ProductDetailPage: FC<ProductDetailPageProps> = ({ className = "" }): ReactElement => {
  const { productId } = useParams();
  const cartContext = useContext(CartContext); // Use the useContext hook
  if (!cartContext) {
    throw new Error("CartContext is undefined"); // Check for null context
  }
  const { addToCart } = cartContext; // Destructure addToCart from context


  // State variables
  const [images, setImages] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [status, setStatus] = useState<"New in" | "limited edition" | "Sold Out" | "50% Discount" | undefined>(undefined);
  const [allOfSizes, setAllOfSizes] = useState<string[]>([]);
  const [variantActive, setVariantActive] = useState(0);
  const [sizeSelected, setSizeSelected] = useState<string>("");
  const [qualitySelected, setQualitySelected] = useState<number>(1);
  const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] = useState(false);
  const [transformedProduct, setTransformedProduct] = useState<Product>({} as Product);
  const [cart, setCart] = useState<Product[]>([]);
  const [isNotifyVisible, setIsNotifyVisible] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [name, setName] = useState<string>("");



  // Fetch product data on component mount
  useEffect(() => {
    fetchProductsbyId();
  }, [productId]);

  // Fetch product details by id
  const fetchProductsbyId = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/products/" + productId);
      const data = await response.json();
      const transformedProduct = transformProduct(data); // Apply transformation
      setTransformedProduct(transformedProduct); // Set transformed product in state
      // Set other values for each state as needed
      setImages(transformedProduct.variants.map(variant => variant.featuredImage));
      setSizes(transformedProduct.sizes || []);
      setVariants(transformedProduct.variants || []);
      setStatus(transformedProduct.status);
      setAllOfSizes(transformedProduct.allOfSizes || []);
      setPrice(transformedProduct.price);
      setName(transformedProduct.name);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = () => {
    const selectedSize = sizeSelected || ""; // Provide a default value if sizeSelected is undefined
    const cartItem: CartItem = {
      id: transformedProduct.id,
      name: transformedProduct.name,
      price: transformedProduct.price,
      image: transformedProduct.image,
      quantity: qualitySelected,
      sizes: [selectedSize], // Ensure sizes is always an array of strings
    };
    addToCart(cartItem);
    setIsNotifyVisible(true);
    notifyAddTocart();
  };


  // Function to notify adding to cart
  const notifyAddTocart = () => {
    toast.custom(
      (t) => (
        <NotifyAddTocart
          productImage={images[0]}
          qualitySelected={qualitySelected}
          show={t.visible}
          sizeSelected={sizeSelected}
          variantActive={variantActive}
          price={price} // Ensure this matches the Props interface
          name={name} // Ensure this matches the Props interface
        />
      ),
      { position: "top-right", id: "nc-product-notify", duration: 3000 }
    );
  };
  

  // Function to render product variants
  const renderVariants = () => {
    if (!variants || !variants.length) {
      return null;
    }

    return (
      <div>
        <label htmlFor="">
          <span className="text-sm font-medium">
            Color:
            <span className="ml-1 font-semibold">
              {variants[variantActive].name}
            </span>
          </span>
        </label>
        {/* <div className="flex mt-3">
          {variants.map((variant, index) => (
            <div
              key={index}
              onClick={() => setVariantActive(index)}
              className={`relative flex-1 max-w-[75px] h-10 sm:h-11 rounded-full border-2 cursor-pointer ${variantActive === index
                  ? "border-primary-6000 dark:border-primary-500"
                  : "border-transparent"
                }`}
            >
              <div className="absolute inset-0.5 rounded-full overflow-hidden z-0">
                <img
                  src={variant.featuredImage}
                  alt=""
                  className="absolute w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div> */}
      </div>
    );
  };

  const renderSizeList = () => {
    if (!transformedProduct || !transformedProduct.sizes || !transformedProduct.sizes.length) {
      return null;
    }
    return (
      <div>
        <div className="flex justify-between font-medium text-sm">
          <label htmlFor="">
            <span className="">
              Size:
              <span className="ml-1 font-semibold">{sizeSelected}</span>
            </span>
          </label>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="##"
            className="text-primary-6000 hover:text-primary-500"
          >
            See sizing chart
          </a>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-3">
          {transformedProduct.sizes.map((size, index) => {
            const isActive = size === sizeSelected;
            const sizeOutStock = !sizes.includes(size);
            return (
              <div
                key={index}
                className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center 
                  text-sm sm:text-base uppercase font-semibold select-none overflow-hidden z-0 ${sizeOutStock
                    ? "text-opacity-20 dark:text-opacity-20 cursor-not-allowed"
                    : "cursor-pointer"
                  } ${isActive
                    ? "bg-primary-6000 border-primary-6000 text-white hover:bg-primary-6000"
                    : "border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  }`}
                onClick={() => {
                  if (sizeOutStock) {
                    return;
                  }
                  setSizeSelected(size);
                }}
              >
                {size}
              </div>
            );
          })}
        </div>
      </div>
    );
  };


  const renderStatus = () => {
    if (!status) {
      return null;
    }
    const CLASSES =
      "absolute top-3 left-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 text-slate-900 dark:text-slate-300";
    if (status === "New in") {
      return (
        <div className={CLASSES}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "50% Discount") {
      return (
        <div className={CLASSES}>
          <IconDiscount className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "Sold Out") {
      return (
        <div className={CLASSES}>
          <NoSymbolIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    if (status === "limited edition") {
      return (
        <div className={CLASSES}>
          <ClockIcon className="w-3.5 h-3.5" />
          <span className="ml-1 leading-none">{status}</span>
        </div>
      );
    }
    return null;
  };

  const renderSectionContent = () => {
    return (
      <div className="space-y-7 2xl:space-y-8">
        {/* ---------- 1 HEADING ----------  */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            {transformedProduct.name}
          </h2>

          <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
            {/* <div className="flex text-xl font-semibold">$112.00</div> */}
            <Prices
              contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
              price={transformedProduct.price}
            />

            <div className="h-7 border-l border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center">
              <a
                href="#reviews"
                className="flex items-center text-sm font-medium"
              >
                <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                <div className="ml-1.5 flex">
                  <span>4.9</span>
                  <span className="block mx-2">·</span>
                  <span className="text-slate-600 dark:text-slate-400 underline">
                    142 reviews
                  </span>
                </div>
              </a>
              <span className="hidden sm:block mx-2.5">·</span>
              <div className="hidden sm:flex items-center text-sm">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span className="ml-1 leading-none">{status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
        <div className="">{renderVariants()}</div>
        <div className="">{renderSizeList()}</div>

        {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
        <div className="flex space-x-3.5">
          <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
            <NcInputNumber
              value={qualitySelected}
              onChange={setQualitySelected}
            />
          </div>
          <ButtonPrimary
            className="flex-1 flex-shrink-0"
            onClick={handleAddToCart}
          >
            <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
            <span className="ml-3">Add to cart</span>
          </ButtonPrimary>
        </div>

        {/*  */}
        <hr className=" 2xl:!my-10 border-slate-200 dark:border-slate-700"></hr>
        {/*  */}

        {/* ---------- 5 ----------  */}
        <AccordionInfo />

        {/* ---------- 6 ----------  */}
        <div className="hidden xl:block">
          <Policy />

        </div>
      </div>
    );
  };

  const renderDetailSection = () => {
    return (
      <div className="">
        <h2 className="text-2xl font-semibold">Product Details</h2>
        <div className="prose prose-sm sm:prose dark:prose-invert sm:max-w-4xl mt-7">
          <p>
            The patented eighteen-inch hardwood Arrowhead deck --- finely
            mortised in, makes this the strongest and most rigid canoe ever
            built. You cannot buy a canoe that will afford greater satisfaction.
          </p>
          <p>
            The St. Louis Meramec Canoe Company was founded by Alfred Wickett in
            1922. Wickett had previously worked for the Old Town Canoe Co from
            1900 to 1914. Manufacturing of the classic wooden canoes in Valley
            Park, Missouri ceased in 1978.
          </p>
          <ul>
            <li>Regular fit, mid-weight t-shirt</li>
            <li>Natural color, 100% premium combed organic cotton</li>
            <li>
              Quality cotton grown without the use of herbicides or pesticides -
              GOTS certified
            </li>
            <li>Soft touch water based printed in the USA</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div className="">
        {/* HEADING */}
        <h2 className="text-2xl font-semibold flex items-center">
          <StarIcon className="w-7 h-7 mb-0.5" />
          <span className="ml-1.5"> 4,87 · 142 Reviews</span>
        </h2>

        {/* comment */}
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">
            <ReviewItem />
            <ReviewItem
              data={{
                comment: `I love the charcoal heavyweight hoodie. Still looks new after plenty of washes. 
                    If you’re unsure which hoodie to pick.`,
                date: "December 22, 2021",
                name: "Stiven Hokinhs",
                starPoint: 5,
              }}
            />
            <ReviewItem
              data={{
                comment: `The quality and sizing mentioned were accurate and really happy with the purchase. Such a cozy and comfortable hoodie. 
                  Now that it’s colder, my husband wears his all the time. I wear hoodies all the time. `,
                date: "August 15, 2022",
                name: "Gropishta keo",
                starPoint: 5,
              }}
            />
            <ReviewItem
              data={{
                comment: `Before buying this, I didn't really know how I would tell a "high quality" sweatshirt, but after opening, I was very impressed. 
                  The material is super soft and comfortable and the sweatshirt also has a good weight to it.`,
                date: "December 12, 2022",
                name: "Dahon Stiven",
                starPoint: 5,
              }}
            />
          </div>

          <ButtonSecondary
            onClick={() => setIsOpenModalViewAllReviews(true)}
            className="mt-10 border border-slate-300 dark:border-slate-700 "
          >
            Show me all 142 reviews
          </ButtonSecondary>
        </div>
      </div>
    );
  };


  return (
    <div className={`nc-ProductDetailPage ${className}`}>
      {/* MAIn */}
      <main className="container mt-5 lg:mt-11">
        <div className="lg:flex">
          {/* CONTENT */}
          <div className="w-full lg:w-[55%] ">
            {/* HEADING */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-16">
                <img
                  src={"http://localhost:8081/images/" + images[0]}
                  className="w-full rounded-2xl object-cover"
                  alt="product detail 1"
                />

              </div>
              {renderStatus()}
              {/* META FAVORITES */}
              <LikeButton className="absolute right-3 top-3 " />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-8 xl:mt-8">
              {["http://localhost:8081/images/" + images[1], "http://localhost:8081/images/" + images[2]].map((item, index) => {
                return (
                  <div
                    key={index}
                    className="aspect-w-11 xl:aspect-w-10 2xl:aspect-w-11 aspect-h-16"
                  >
                    <img
                      src={item}
                      className="w-full rounded-2xl object-cover"
                      alt="product detail 1"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
            {renderSectionContent()}
          </div>
        </div>

        {/* DETAIL AND REVIEW */}
        <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-16">
          <div className="block xl:hidden">
            <Policy />
          </div>

          {renderDetailSection()}

          <hr className="border-slate-200 dark:border-slate-700" />

          {renderReviews()}

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* OTHER SECTION */}
          <SectionSliderProductCard
            heading="Customers also purchased"
            subHeading=""
            headingFontClassName="text-2xl font-semibold"
            headingClassName="mb-10 text-neutral-900 dark:text-neutral-50"
          />

          {/* SECTION */}
          <div className="pb-20 xl:pb-28 lg:pt-14">
            <SectionPromo2 />
          </div>
        </div>
      </main>

      {/* MODAL VIEW ALL REVIEW */}
      <ModalViewAllReviews
        show={isOpenModalViewAllReviews}
        onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)}
      />
    </div>
  );
};

export default ProductDetailPage;

