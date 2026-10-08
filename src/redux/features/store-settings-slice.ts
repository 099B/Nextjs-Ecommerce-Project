import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/lib/supabaseClient";

export type StoreSettings = {
  id: number;
  store_name: string;
  logo_url: string;
  contact_email: string;
};

type StoreSettingsState = {
  settings: StoreSettings | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: StoreSettingsState = {
  settings: null,
  status: "idle",
  error: null,
};

export const fetchStoreSettings = createAsyncThunk("storeSettings/fetchStoreSettings", async () => {
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data as StoreSettings;
});

const storeSettingsSlice = createSlice({
  name: "storeSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreSettings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStoreSettings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.settings = action.payload;
      })
      .addCase(fetchStoreSettings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load store settings";
      });
  },
});

export default storeSettingsSlice.reducer;
