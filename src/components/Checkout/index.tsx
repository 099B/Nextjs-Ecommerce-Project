"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Billing from "./Billing";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { useSelector } from "react-redux";
import { selectTotalPrice, removeAllItemsFromCart } from "@/redux/features/cart-slice";
import { supabase } from "@/lib/supabaseClient";
import { useTranslation } from "@/contexts/TranslationContext";

const Checkout = () => {
  const { t } = useTranslation();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    supabase.from("store_settings").select("delivery_fee").limit(1).single().then(({ data }) => {
      if (data && data.delivery_fee) {
        setDeliveryFee(data.delivery_fee);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      address: formData.get("address"),
      notes: formData.get("notes"),
      total_price: totalPrice + deliveryFee,
      items: cartItems,
    };

    if (!data.first_name || !data.last_name || !data.phone || !data.city || !data.address) {
      alert(t("checkout.fill_required"));
      return;
    }

    if (cartItems.length === 0) {
      alert(t("checkout.cart_empty"));
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("orders").insert([data]);

    setLoading(false);
    if (error) {
      alert("Error placing order: " + error.message);
    } else {
      setSuccess(true);
      dispatch(removeAllItemsFromCart());
    }
  };

  if (success) {
    return (
      <>
        <Breadcrumb title={t("checkout.checkout_title")} pages={["checkout"]} />
        <section className="overflow-hidden py-20 bg-gray-2 text-center">
          <div className="max-w-[600px] mx-auto bg-white p-10 rounded-[10px] shadow-1">
            <h2 className="text-3xl font-bold text-dark mb-4">{t("checkout.success_title")}</h2>
            <p className="text-lg text-dark-4">{t("checkout.success_message")}</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title={t("checkout.checkout_title")} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- billing details --> */}
                <Billing />

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      {t("checkout.other_notes")}
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder={t("checkout.notes_placeholder")}
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-primary/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px] mt-9">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      {t("checkout.your_order")}
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">{t("checkout.product")}</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          {t("checkout.subtotal")}
                        </h4>
                      </div>
                    </div>

                    {/* <!-- product items --> */}
                    {cartItems.map((item, key) => (
                      <div key={key} className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div className="flex-1 pr-4">
                          <p className="text-dark">{item.title} <span className="text-dark-4 text-sm">x {item.quantity}</span></p>
                        </div>
                        <div>
                          <p className="text-dark text-right whitespace-nowrap">{item.discountedPrice * item.quantity} dh</p>
                        </div>
                      </div>
                    ))}
                    
                    {cartItems.length === 0 && (
                      <div className="py-5 text-center text-dark-5">{t("checkout.cart_empty")}</div>
                    )}

                    {/* <!-- subtotal --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-dark">{t("checkout.subtotal")}</p>
                      </div>
                      <div>
                        <p className="font-medium text-dark text-right">
                          {totalPrice} dh
                        </p>
                      </div>
                    </div>

                    {/* <!-- delivery --> */}
                    <div className="flex items-center justify-between pt-3">
                      <div>
                        <p className="font-medium text-dark">{t("checkout.delivery_fee")}</p>
                      </div>
                      <div>
                        <p className="font-medium text-dark text-right">
                          {deliveryFee} dh
                        </p>
                      </div>
                    </div>

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5 mt-5 border-t border-gray-3">
                      <div>
                        <p className="font-medium text-lg text-dark">{t("checkout.total")}</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right text-primary">
                          {totalPrice + deliveryFee} dh
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="w-full flex justify-center font-medium text-white bg-primary py-3 px-6 rounded-md ease-out duration-200 hover:bg-primary-dark mt-7.5 disabled:opacity-50"
                >
                  {loading ? t("checkout.processing") : t("checkout.process_to_checkout")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
