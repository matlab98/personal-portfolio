import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlStats } from "@/config/config";

/**
 * Métricas públicas del tracker (WakaTime "share"). Cuatro endpoints, un solo
 * contrato de salida:
 *
 *   { status: true, statusDescription: string, data: <payload.data> }
 *
 * Los cuatro JSON llegan envueltos en `{ data: ... }`, así que el desenvuelto
 * ocurre aquí y el consumidor siempre lee `result.data`. Antes `queryOne`
 * devolvía el sobre completo y los otros tres el contenido: la forma dependía
 * del endpoint y eso lo descubría el componente.
 *
 * Qué trae cada `data`:
 *  - queryOne   → editores: [{ name, percent, color }]
 *  - queryTwo   → lenguajes: [{ name, percent, color }] (no hay `total_seconds`
 *                 ni `text`; `percent` es porcentaje del total `all_time`)
 *  - queryThree → sistemas operativos: [{ name, percent, color }]
 *  - queryFour  → totales: { grand_total, range, best_day, ... }
 */

const OK_DESCRIPTION = "Query completed successfully.";

/** Un solo desenvuelto para los cuatro endpoints. */
const unwrap = (response) => ({
  status: true,
  statusDescription: OK_DESCRIPTION,
  data: response?.data,
});

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: urlStats.baseStatsUrl,
  }),
  endpoints: (builder) => ({
    // Editores / IDE.
    queryOne: builder.query({
      query: () => ({
        url: urlStats.statsEditors,
        method: "GET",
      }),
      transformResponse: unwrap,
      transformErrorResponse: (response) => response?.data,
      extraOptions: { maxRetries: 0 },
    }),
    // Lenguajes.
    queryTwo: builder.query({
      query: () => ({
        url: urlStats.statsLanguage,
        method: "GET",
      }),
      transformResponse: unwrap,
      transformErrorResponse: (response) => response?.data,
      extraOptions: { maxRetries: 0 },
    }),
    // Sistemas operativos.
    queryThree: builder.query({
      query: () => ({
        url: urlStats.statsOs,
        method: "GET",
      }),
      transformResponse: unwrap,
      transformErrorResponse: (response) => response?.data,
      extraOptions: { maxRetries: 0 },
    }),
    // Totales del rango completo.
    queryFour: builder.query({
      query: () => ({
        url: urlStats.statsTotal,
        method: "GET",
      }),
      transformResponse: unwrap,
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
