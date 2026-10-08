"use client";

import { store } from "./store";
import { Provider } from "react-redux";
import React, { useEffect } from "react";
import { fetchProducts } from "./features/products-slice";
import { fetchStoreSettings } from "./features/store-settings-slice";
import { fetchCategories } from "./features/categories-slice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(fetchProducts());
    store.dispatch(fetchStoreSettings());
    store.dispatch(fetchCategories());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
