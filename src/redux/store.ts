import { configureStore } from "@reduxjs/toolkit";

import quickViewReducer from "./features/quickView-slice";
import cartReducer from "./features/cart-slice";

import productDetailsReducer from "./features/product-details";
import productsReducer from "./features/products-slice";
import storeSettingsReducer from "./features/store-settings-slice";
import categoriesReducer from "./features/categories-slice";

import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    quickViewReducer,
    cartReducer,

    productDetailsReducer,
    productsReducer,
    storeSettingsReducer,
    categoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
