"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "@/contexts/TranslationContext";

const MapComponent = dynamic(() => import("./MapComponent"), { ssr: false });

const MapSection = () => {
  const { t } = useTranslation();
  return (
    <section className="pb-20 pt-10">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mb-10 text-center">
          <h2 className="text-heading-3 font-bold text-dark mb-3">{t("headings.our_shops")}</h2>
          <p className="text-dark-4 text-custom-lg">{t("headings.find_us_locations")}</p>
        </div>
        <div className="shadow-1 rounded-lg overflow-hidden border border-gray-3">
          <MapComponent />
        </div>
      </div>
    </section>
  );
};

export default MapSection;
