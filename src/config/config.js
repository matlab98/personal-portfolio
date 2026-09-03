/**
 * URLS DE RETORNO PARA CADA AMBIENTE
 * QA:
 * PRE:
 * PRODUCCIÓN:
 */

// const API_ENDPOINT = process.env.NODE_ENV === "production" ? "prod" : "";

const defaultResponses = {
  noResponseFromApi:
    "No hay respuesta por parte del servidor. Por favor intente de nuevo más tarde.",
};

const {
  VITE_EMAIL_SERVICE_ID,
  VITE_EMAIL_TEMPLATE_ID,
  VITE_EMAIL_USER_ID,
  VITE_URL_BASE_STATS,
  VITE_URL_STATS_LANGUAGE,
  VITE_URL_STATS_TOTAL,
  VITE_URL_STATS_EDITORS,
  VITE_URL_STATS_OS
} = import.meta.env;

const emailKey = {
  serviceId: VITE_EMAIL_SERVICE_ID,
  templateId: VITE_EMAIL_TEMPLATE_ID,
  userId: VITE_EMAIL_USER_ID,
};

// Son URLs de "share" revocables por el dueño: van en entorno, no en el código.
const urlStats = {
    baseStatsUrl: VITE_URL_BASE_STATS,
    statsLanguage: VITE_URL_STATS_LANGUAGE,
    statsTotal: VITE_URL_STATS_TOTAL,
    statsEditors: VITE_URL_STATS_EDITORS,
    statsOs: VITE_URL_STATS_OS
};

export { defaultResponses, emailKey, urlStats };