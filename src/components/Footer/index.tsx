import React from "react";
import Image from "next/image";

import { useAppSelector } from "@/redux/store";

const Footer = () => {
  const year = new Date().getFullYear();
  const storeSettings = useAppSelector((state) => state.storeSettingsReducer.settings);

  return (
    <footer className="overflow-hidden">


      {/* <!-- footer bottom start --> */}
      <div className="py-5 xl:py-7.5 bg-gray-1">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-5 flex-wrap items-center justify-between">
            <p className="text-dark font-medium">
              &copy; {year}. All rights reserved by yourtitle.
            </p>

          </div>
        </div>
      </div>
      {/* <!-- footer bottom end --> */}
    </footer>
  );
};

export default Footer;
