import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://wakatime.com/share/@hilbrakaku/",
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
        url: "eea4d614-7178-46fa-8828-54ef59996ac1.json", // Cambia esto por el endpoint que necesites
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          status: true,
          statusDescription: "Query completed successfully.",
          data: response[0].data,
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
          data: response[0].data,
        };
      },
      transformErrorResponse: (response) => response?.data,
      extraOptions: { maxRetries: 0 },
    }),
    queryFour: builder.query({
      query: () => ({
        url: "96dd4b3d-19f6-4f40-8637-facf512c41a1.json", // Cambia esto por el endpoint que necesites
        method: "GET",
      }),
      transformResponse: (response) => {
        return {
          status: true,
          statusDescription: "Query completed successfully.",
          data: response[0].data,
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
