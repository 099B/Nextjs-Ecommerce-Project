"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCallback, useRef } from "react";
import Image from "next/image";

// Import Swiper styles
import "swiper/css/navigation";
import "swiper/css";
import SingleItem from "./SingleItem";

const Testimonials = () => {
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <section className="overflow-hidden pb-16.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="">
          <div className="swiper testimonial-carousel common-carousel p-5">
            {/* <!-- section title --> */}


            <Swiper
              ref={sliderRef}
              slidesPerView={3}
              spaceBetween={20}
              breakpoints={{
                // when window width is >= 640px
                0: {
                  slidesPerView: 1,
                },
                1000: {
                  slidesPerView: 2,
                  // spaceBetween: 4,
                },
                // when window width is >= 768px
                1200: {
                  slidesPerView: 3,
                },
              }}
            >

            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
