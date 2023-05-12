/**
 * URLS DE RETORNO PARA CADA AMBIENTE
 * QA:
 * PRE:
 * PRODUCCIÓN:
 */

const API_ENDPOINT = process.env.NODE_ENV === "production" ? "prod" : "";

const defaultResponses = {
  noResponseFromApi:
    "No hay respuesta por parte del servidor. Por favor intente de nuevo más tarde.",
};

const {
  REACT_APP_EMAIL_SERVICE_ID,
  REACT_APP_EMAIL_TEMPLATE_ID,
  REACT_APP_EMAIL_USER_ID,
  REACT_APP_URL_STATS_LANGUAGE,
  REACT_APP_URL_STATS_TOTAL
} = process.env;

const emailKey = {
  serviceId: REACT_APP_EMAIL_SERVICE_ID,
  templateId: REACT_APP_EMAIL_TEMPLATE_ID,
  userId: REACT_APP_EMAIL_USER_ID,
};

const urlStats = {
    statsLanguage: REACT_APP_URL_STATS_LANGUAGE,
    statsTotal: REACT_APP_URL_STATS_TOTAL
};

export { API_ENDPOINT, defaultResponses, emailKey, urlStats };
