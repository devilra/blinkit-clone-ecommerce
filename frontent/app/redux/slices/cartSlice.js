import API from "@/app/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Utility: recalc total
const calculateTotal = (items) =>
  items.reduce(
    (acc, item) =>
      acc + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/cart");
      //console.log(data.cart);
      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, thunkAPI) => {
    console.log(productId, quantity);
    try {
      const { data } = await API.post("/cart/add", { productId, quantity });
      console.log(data);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (productId, thunkAPI) => {
    try {
      const { data } = await API.put("/cart/increase", { productId });
      //console.log(data.cart);
      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to increase quantity"
      );
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (productId, thunkAPI) => {
    try {
      const { data } = await API.put("/cart/decrease", { productId });
      //console.log(data.cart);
      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to decrease quantity"
      );
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const { data } = await API.put("/cart/update", { productId, quantity });
      console.log(data.cart);
      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

export const removeQuantity = createAsyncThunk(
  "cart/removeQuantity",
  async (productId, thunkAPI) => {
    try {
      const { data } = await API.delete("/cart/remove", {
        data: { productId },
      });
      console.log(data.cart);
      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.delete("/cart/clear");
      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    loading: false,
    error: null,
    inc_dec: null,
    updating: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.error = null;
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected);
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // If backend full cart return pannal
        if (action.payload.items) {
          state.items = action.payload.items;
          state.totalPrice = action.payload.totalPrice;
          return;
        }

        // If backend single item return pannal
        const newItem = action.payload.item;
        if (!newItem) return; // safety guard

        const existIndex = state.items.findIndex(
          (item) => item.productId === newItem.productId
        );

        if (existIndex >= 0) {
          state.items[existIndex].quantity += newItem.quantity;
          state.items[existIndex].price = newItem.price;
        } else {
          state.items.push(newItem);
        }

        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(increaseQuantity.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      // .addCase(increaseQuantity.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.error = null;
      //   state.inc_dec = action.payload;
      // })

      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.updating = false;
        const productId = action.meta.arg; // thunk arg = productId
        const item = state.items.find((i) => i.product._id === productId);
        if (item) {
          item.quantity += 1;
        }
        state.totalPrice = calculateTotal(state.items);
      })
      .addCase(increaseQuantity.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      .addCase(decreaseQuantity.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      // .addCase(decreaseQuantity.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.error = null;
      //   state.inc_dec = action.payload;
      // })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.updating = false;
        const productId = action.meta.arg;
        const item = state.items.find((i) => i.product._id === productId);
        if (item && item.quantity > 1) {
          item.quantity -= 1;
        }
        state.totalPrice = calculateTotal(state.items);
      })
      .addCase(decreaseQuantity.rejected, (state, action) => {
        state.updating = false;

        state.error = action.payload;
      })
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.inc_dec = action.payload;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeQuantity.pending, (state) => {
        state.error = null;
      })
      .addCase(removeQuantity.fulfilled, (state, action) => {
        state.error = null;

        // if backend full cart return pannal
        if (action.payload?.items) {
          state.items = action.payload.items;
          state.totalPrice = action.payload.totalPrice;
          return;
        }

        // if backend single productId return pannal
        const removedId = action.meta.arg; // thunk arg (productId)
        state.items = state.items.filter((i) => i.product._id !== removedId);
        state.totalPrice = calculateTotal(state.items);
      })
      .addCase(removeQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items = [];
        state.totalPrice = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
