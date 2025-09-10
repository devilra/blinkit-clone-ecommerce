import API from "@/app/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/products", { params });
      //console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// ✅ Create product

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { rejectWithValue }) => {
    // IMPORTANT: send as multipart/form-data (images + fields)

    try {
      const { data } = await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data.product);
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    topItems: [],
    selectedProduct: null,
    page: 1,
    pages: 1,
    total: 0,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // state.items.push(action.payload)

        // Overwrite safe handling → frontend list update if product already exists
        const exists = state.items.find((p) => p._id === action.payload._id);
        if (!exists) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct, resetSuccess } = productSlice.actions;
export default productSlice.reducer;
