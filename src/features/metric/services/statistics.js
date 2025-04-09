import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlStats } from "./../../../config/config";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: urlStats.baseStatsUrl,
  }), // Cambia esto por la URL de tu API
  endpoints: (builder) => ({
    queryOne: builder.query({
      query: () => ({
        url: "f6ec4610-5ec8-4e0a-b40d-aec4d11abefd.json", // Cambia esto por el endpoint que necesites
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          status: true,
          statusDescription: "Query completed successfully.",
          data: response,
        };
      },
      transformErrorResponse: (response) => response?.data,
      extraOptions: { maxRetries: 0 },
    }),
    queryTwo: builder.query({
      query: () => ({
        url: urlStats.statsLanguage, // Cambia esto por el endpoint que necesites
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          status: true,
          statusDescription: "Query completed successfully.",
          data: response.data,
        };
      },
      transformErrorResponse: (response) => response?.data,
      extraOptions: { maxRetries: 0 },
    }),
    queryThree: builder.query({
      query: () => ({
        url: "b4730f03-b81c-464a-953c-567e27e89a34.json", // Cambia esto por el endpoint que necesites
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          status: true,
          statusDescription: "Query completed successfully.",
          data: response.data,
        };
      },
      transformErrorResponse: (response) => response?.data,
      extraOptions: { maxRetries: 0 },
    }),
    queryFour: builder.query({
      query: () => ({
        url: urlStats.statsTotal, // Cambia esto por el endpoint que necesites
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          status: true,
          statusDescription: "Query completed successfully.",
          data: response.data,
        };
      },
      transformErrorResponse: (response) => response?.data,
      extraOptions: { maxRetries: 0 },
    }),
  }),
});

// Exporta los hooks generados para usar en componentes
export const {
  useQueryOneQuery,
  useQueryTwoQuery,
  useQueryThreeQuery,
  useQueryFourQuery,
} = api;
