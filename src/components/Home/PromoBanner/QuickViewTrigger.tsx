"use client";
import React from "react";
import { useModalContext } from "@/app/context/QuickViewModalContext";
import { updateQuickView } from "@/redux/features/quickView-slice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/store";
import { AppDispatch } from "@/redux/store";

interface QuickViewTriggerProps {
  productId: string;
  children: React.ReactNode;
  className?: string;
  as?: "a" | "button" | "div";
}

const QuickViewTrigger = ({ productId, children, className, as = "div" }: QuickViewTriggerProps) => {
  const { openModal } = useModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const shopData = useAppSelector((state) => state.productsReducer.items);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const product = shopData.find((p) => p.id.toString() === productId);
    if (product) {
      dispatch(updateQuickView({ ...product }));
      openModal();
    }
  };

  if (as === "a") {
    return (
      <a href="#" onClick={handleClick} className={className}>
        {children}
      </a>
    );
  }

  if (as === "button") {
    return (
      <button onClick={handleClick} className={className}>
        {children}
      </button>
    );
  }

  return (
    <div onClick={handleClick} className={`cursor-pointer ${className || ""}`}>
      {children}
    </div>
  );
};

export default QuickViewTrigger;
