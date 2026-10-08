"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Link from "next/link";
import QuickViewTrigger from "../PromoBanner/QuickViewTrigger";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

interface SlideData {
  id: number;
  discount: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  image_url: string;
  button_text_fr: string;
  button_text_en: string;
  button_text_ar: string;
  target_id: number;
}

const HeroCarousal = ({ slides, locale }: { slides: SlideData[], locale: string }) => {
  const getLocalized = (item: any, field: string) => {
    return item ? item[`${field}_${locale}`] : "";
  };

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
            <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
              <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                <span className="block font-semibold text-heading-3 sm:text-heading-1 text-primary">
                  {slide.discount}%
                </span>
                <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                  Sale
                  <br />
                  Off
                </span>
              </div>

              <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                <QuickViewTrigger productId={slide.target_id?.toString() || ""} as="a" className="cursor-pointer hover:text-primary transition-colors">
                  {getLocalized(slide, "title")}
                </QuickViewTrigger>
              </h1>

              <p>{getLocalized(slide, "description")}</p>

              <QuickViewTrigger
                productId={slide.target_id?.toString() || ""}
                as="a"
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-primary mt-10"
              >
                {getLocalized(slide, "button_text")}
              </QuickViewTrigger>
            </div>

            <QuickViewTrigger productId={slide.target_id?.toString() || ""}>
              <Image
                src={slide.image_url}
                alt={getLocalized(slide, "title")}
                width={351}
                height={358}
              />
            </QuickViewTrigger>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroCarousal;
