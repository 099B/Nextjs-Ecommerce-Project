import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/product";

type InitialState = {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: InitialState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*, categories(*)")
    .order("id");

  if (productsError) {
    throw new Error(productsError.message);
  }

  // Format data to match the expected Product type
  const formattedProducts: Product[] = products.map((product) => {
    return {
      id: product.id,
      title_fr: product.title_fr,
      title_en: product.title_en,
      title_ar: product.title_ar,
      reviews: product.reviews,
      price: product.price,
      discountedPrice: product.discounted_price,
      category_id: product.category_id,
      category: product.categories,
      description_fr: product.description_fr,
      description_en: product.description_en,
      description_ar: product.description_ar,
      stock: product.stock,
      imgs: product.imgs,
    };
  });

  return formattedProducts;
});

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export default productsSlice.reducer;
