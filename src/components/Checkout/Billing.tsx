import React from "react";
import { useTranslation } from "@/contexts/TranslationContext";

const Billing = () => {
  const { t } = useTranslation();

  return (
    <div className="mt-9">
      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
        {t("billing.billing_details")}
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label htmlFor="firstName" className="block mb-2.5">
              {t("billing.first_name")} <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="firstName"
              id="firstName"
              required
              placeholder="John"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="w-full">
            <label htmlFor="lastName" className="block mb-2.5">
              {t("billing.last_name")} <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="lastName"
              id="lastName"
              required
              placeholder="Doe"
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            {t("billing.phone_number")} <span className="text-red">*</span>
          </label>

          <input
            type="tel"
            name="phone"
            id="phone"
            required
            placeholder="06..."
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="city" className="block mb-2.5">
            {t("billing.city")} <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="city"
            id="city"
            required
            placeholder="Casablanca"
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="address" className="block mb-2.5">
            {t("billing.address")} <span className="text-red">*</span>
          </label>

          <textarea
            name="address"
            id="address"
            required
            rows={3}
            placeholder={t("billing.address_placeholder")}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-primary/20"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Billing;
