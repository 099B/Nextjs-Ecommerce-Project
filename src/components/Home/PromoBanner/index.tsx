import React from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

import { getTranslation } from "@/utils/serverTranslate";
import QuickViewTrigger from "./QuickViewTrigger";

interface PromoBannerData {
  id: number;
  layout: "big" | "small_left_img" | "small_right_img";
  subtitle_fr: string;
  subtitle_en: string;
  subtitle_ar: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  bg_color: string;
  theme_color: "primary" | "teal" | "orange";
  button_text_fr: string;
  button_text_en: string;
  button_text_ar: string;
  button_link: string;
}

const PromoBanner = async () => {
  const { data: banners } = await supabase
    .from("promo_banners")
    .select("*")
    .order("id");

  const { locale } = await getTranslation();

  const getLocalized = (item: any, field: string) => {
    return item ? item[`${field}_${locale}`] : "";
  };

  const bigBanner = banners?.find((b: PromoBannerData) => b.layout === "big");
  const smallLeftBanner = banners?.find(
    (b: PromoBannerData) => b.layout === "small_left_img"
  );
  const smallRightBanner = banners?.find(
    (b: PromoBannerData) => b.layout === "small_right_img"
  );

  const getThemeClasses = (color: string) => {
    switch (color) {
      case "primary":
        return { bg: "bg-primary", hover: "hover:bg-primary-dark", text: "text-primary" };
      case "teal":
        return { bg: "bg-teal", hover: "hover:bg-teal-dark", text: "text-teal" };
      case "orange":
        return { bg: "bg-orange", hover: "hover:bg-orange-dark", text: "text-orange" };
      default:
        return { bg: "bg-primary", hover: "hover:bg-primary-dark", text: "text-primary" };
    }
  };

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- promo banner big --> */}
        {bigBanner && (
          <div
            className="relative z-1 overflow-hidden rounded-lg py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5"
            style={{ backgroundColor: bigBanner.bg_color }}
          >
            <div className="max-w-[550px] w-full">
              <span className="block font-medium text-xl text-dark mb-3">
                {getLocalized(bigBanner, "subtitle")}
              </span>

              <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
                {getLocalized(bigBanner, "title")}
              </h2>

              <p>{getLocalized(bigBanner, "description")}</p>

              <QuickViewTrigger productId={bigBanner.button_link} as="a"
                className={`inline-flex font-medium text-custom-sm text-white ${
                  getThemeClasses(bigBanner.theme_color).bg
                } py-[11px] px-9.5 rounded-md ease-out duration-200 ${
                  getThemeClasses(bigBanner.theme_color).hover
                } mt-7.5`}
              >
                {getLocalized(bigBanner, "button_text")}
              </QuickViewTrigger>
            </div>

            <QuickViewTrigger productId={bigBanner.button_link} className="absolute bottom-0 right-4 lg:right-26 rtl:right-auto rtl:left-4 rtl:lg:left-26 -z-1">
              <Image
                src={bigBanner.image_url}
                alt={getLocalized(bigBanner, "title") || "banner"}
                width={274}
                height={350}
              />
            </QuickViewTrigger>
          </div>
        )}

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {/* <!-- promo banner small left img --> */}
          {smallLeftBanner && (
            <div
              className="relative z-1 overflow-hidden rounded-lg py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10"
              style={{ backgroundColor: smallLeftBanner.bg_color }}
            >
              <QuickViewTrigger productId={smallLeftBanner.button_link} className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 rtl:left-auto rtl:right-3 rtl:sm:right-10 -z-1">
                <Image
                  src={smallLeftBanner.image_url}
                  alt={getLocalized(smallLeftBanner, "title") || "banner"}
                  width={241}
                  height={241}
                />
              </QuickViewTrigger>

              <div className="text-right rtl:text-left">
                <span className="block text-lg text-dark mb-1.5">
                  {getLocalized(smallLeftBanner, "subtitle")}
                </span>

                <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                  {getLocalized(smallLeftBanner, "title")}
                </h2>

                <p
                  className={`font-semibold text-custom-1 ${
                    getThemeClasses(smallLeftBanner.theme_color).text
                  }`}
                >
                  {getLocalized(smallLeftBanner, "description")}
                </p>

                <QuickViewTrigger productId={smallLeftBanner.button_link} as="a"
                  className={`inline-flex font-medium text-custom-sm text-white ${
                    getThemeClasses(smallLeftBanner.theme_color).bg
                  } py-2.5 px-8.5 rounded-md ease-out duration-200 ${
                    getThemeClasses(smallLeftBanner.theme_color).hover
                  } mt-9`}
                >
                  {getLocalized(smallLeftBanner, "button_text")}
                </QuickViewTrigger>
              </div>
            </div>
          )}

          {/* <!-- promo banner small right img --> */}
          {smallRightBanner && (
            <div
              className="relative z-1 overflow-hidden rounded-lg py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10"
              style={{ backgroundColor: smallRightBanner.bg_color }}
            >
              <QuickViewTrigger productId={smallRightBanner.button_link} className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 rtl:right-auto rtl:left-3 rtl:sm:left-8.5 -z-1">
                <Image
                  src={smallRightBanner.image_url}
                  alt={getLocalized(smallRightBanner, "title") || "banner"}
                  width={200}
                  height={200}
                />
              </QuickViewTrigger>

              <div>
                <span className="block text-lg text-dark mb-1.5">
                  {getLocalized(smallRightBanner, "subtitle")}
                </span>

                <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                  {getLocalized(smallRightBanner, "title")}
                </h2>

                <p className="max-w-[285px] text-custom-sm">
                  {getLocalized(smallRightBanner, "description")}
                </p>

                <QuickViewTrigger productId={smallRightBanner.button_link} as="a"
                  className={`inline-flex font-medium text-custom-sm text-white ${
                    getThemeClasses(smallRightBanner.theme_color).bg
                  } py-2.5 px-8.5 rounded-md ease-out duration-200 ${
                    getThemeClasses(smallRightBanner.theme_color).hover
                  } mt-7.5`}
                >
                  {getLocalized(smallRightBanner, "button_text")}
                </QuickViewTrigger>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
