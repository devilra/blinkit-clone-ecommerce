import API from "@/app/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/categories");
      console.log(data);
      return data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/categories/${id}`);
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/categories", categoryData);
      console.log(data.category);
      return data.category;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/categories/${id}`, updates);
      console.log(data.category);
      return data.category;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const deleteCategory = createAsyncThunk('categories/deleteCategory', async(id, {rejectWithValue}) => {
  try {
    await API.delete(`/categories/${id}`)
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
})

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    selectedCategory: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    // get all categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get category by id
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      // create category
builder
  .addCase(createCategory.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
   .addCase(createCategory.fulfilled, (state, action) => {
    state.loading = false;
    state.items.push(action.payload);
  })
  .addCase(createCategory.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
  // update category
builder
  .addCase(updateCategory.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(updateCategory.fulfilled, (state, action) => {
    state.loading = false;
    const idx = state.items.findIndex((c) => c._id === action.payload._id);
    if (idx !== -1) state.items[idx] = action.payload;
  })
  .addCase(updateCategory.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
  
// delete category
builder
  .addCase(deleteCategory.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(deleteCategory.fulfilled, (state, action) => {
    state.loading = false;
    state.items = state.items.filter((c) => c._id !== action.payload);
  })
  .addCase(deleteCategory.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  });
  },
});

export const { clearSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;
