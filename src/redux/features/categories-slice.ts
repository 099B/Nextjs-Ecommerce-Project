import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabaseClient";

export type Category = {
  id: number;
  name_fr: string;
  name_en: string;
  name_ar: string;
  slug: string;
  image_url: string;
  [key: string]: any;
};

type CategoriesState = {
  items: Category[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedCategory: number | null;
};

const initialState: CategoriesState = {
  items: [],
  status: "idle",
  error: null,
  selectedCategory: null,
};

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id");

  if (error) {
    throw new Error(error.message);
  }
  
  return data.map(cat => ({
    id: cat.id,
    name_fr: cat.name_fr,
    name_en: cat.name_en,
    name_ar: cat.name_ar,
    slug: cat.slug,
    image_url: cat.image_url
  })) as Category[];
});

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load categories";
      });
  },
});

export const { setSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
