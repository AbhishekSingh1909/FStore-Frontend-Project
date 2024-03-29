import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

import { CreateProductWithAccessToken } from "../../../types/CreateProduct";
import Product from "../../../types/Product";

export const createProductAsync = createAsyncThunk<
  Product,
  CreateProductWithAccessToken,
  { rejectValue: AxiosError }
>("products/createProduct", async (product, { rejectWithValue }) => {

  const config = {
    headers: {
      Authorization: `Bearer ${product.access_token}`,
    },
  };

  try {
    const response = await axios.post(
      "https://fakestore.azurewebsites.net/api/v1/products",
      product.createProduct, config
    );
    return response.data;
  } catch (e) {
    const error = e as AxiosError;
    return rejectWithValue(error);
  }
});
