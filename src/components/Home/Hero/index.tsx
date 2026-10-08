import React from "react";
import HeroCarousel from "./HeroCarousel";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { getTranslation } from "@/utils/serverTranslate";
import QuickViewTrigger from "../PromoBanner/QuickViewTrigger";

const Hero = async () => {
  const { data: slides } = await supabase.from("hero_sliders").select("*").order("id");
  const { data: sideBanners } = await supabase.from("hero_side_banners").select("*").order("id");
  const { t, locale } = await getTranslation();

  const getLocalized = (item: any, field: string) => {
    return item ? item[`${field}_${locale}`] : "";
  };

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel slides={slides || []} locale={locale} />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              {sideBanners?.map((banner) => (
                <div key={banner.id} className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                  <div className="flex items-center gap-14">
                    <div>
                      <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-20">
                        <QuickViewTrigger productId={banner.target_id?.toString() || ""} as="a" className="cursor-pointer hover:text-primary transition-colors">
                          {getLocalized(banner, "title")}
                        </QuickViewTrigger>
                      </h2>

                      <div>
                        <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                          {t("hero.limited_time_offer")}
                        </p>
                        <span className="flex items-center gap-3">
                          <span className="font-medium text-heading-5 text-red">
                            {banner.price}
                          </span>
                          {banner.original_price && (
                            <span className="font-medium text-2xl text-dark-4 line-through">
                              {banner.original_price}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <QuickViewTrigger productId={banner.target_id?.toString() || ""}>
                      <Image
                        src={banner.image_url}
                        alt={getLocalized(banner, "title") || "banner"}
                        width={123}
                        height={161}
                      />
                    </QuickViewTrigger>
                  </div>
                </div>
              ))}


            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
    </section>
  );
};

export default Hero;
