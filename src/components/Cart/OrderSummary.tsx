import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "@/contexts/TranslationContext";

const OrderSummary = () => {
  const { t } = useTranslation();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">{t("cart.order_summary")}</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">{t("cart.product")}</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">{t("cart.subtotal")}</h4>
            </div>
          </div>

          {/* <!-- product item --> */}
          {cartItems.map((item, key) => (
            <div key={key} className="flex items-center justify-between py-5 border-b border-gray-3">
              <div>
                <p className="text-dark">{item.title}</p>
              </div>
              <div>
                <p className="text-dark text-right">
                  {item.discountedPrice * item.quantity} dh
                </p>
              </div>
            </div>
          ))}

          {/* <!-- total --> */}
          <div className="flex items-center justify-between pt-5">
            <div>
              <p className="font-medium text-lg text-dark">{t("cart.total")}</p>
            </div>
            <div>
              <p className="font-medium text-lg text-dark text-right">
                {totalPrice} dh
              </p>
            </div>
          </div>

          {/* <!-- checkout button --> */}
          <button
            type="submit"
            className="w-full flex justify-center font-medium text-white bg-primary py-3 px-6 rounded-md ease-out duration-200 hover:bg-primary-dark mt-7.5"
          >
            {t("cart.process_to_checkout")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
