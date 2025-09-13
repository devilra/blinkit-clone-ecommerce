import API from "@/app/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const checkout = createAsyncThunk(
  "checkout/checkout",
  async ({ addressId, manualAddress }, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/orders/checkout", {
        addressId,
        manualAddress,
      });
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    cartSummary: null,
    shippingAddress: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCheckout: (state) => {
      state.cartSummary = null;
      state.shippingAddress = null;
      state.loading = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.loading = false;
        state.cartSummary = action.payload.cartSummary;
        state.shippingAddress = action.payload.shippingAddress;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
