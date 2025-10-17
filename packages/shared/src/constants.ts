// Svenska kommuner och län
export const SWEDISH_COUNTIES = [
  "Stockholms län",
  "Västra Götalands län",
  "Skåne län",
  "Östergötlands län",
  "Jönköpings län",
  "Kronobergs län",
  "Kalmar län",
  "Gotlands län",
  "Blekinge län",
  "Hallands län",
  "Värmlands län",
  "Örebro län",
  "Västmanlands län",
  "Dalarnas län",
  "Gävleborgs län",
  "Västernorrlands län",
  "Jämtlands län",
  "Västerbottens län",
  "Norrbottens län",
  "Uppsala län",
  "Södermanlands län",
] as const;

export type SwedishCounty = (typeof SWEDISH_COUNTIES)[number];

// Föreningskategorier
export const ASSOCIATION_CATEGORIES = [
  "Idrott",
  "Kultur",
  "Social",
  "Politisk",
  "Religiös",
  "Facklig",
  "Utbildning",
  "Miljö",
  "Internationell",
  "Näringsliv",
  "Övrigt",
] as const;

export type AssociationCategory = (typeof ASSOCIATION_CATEGORIES)[number];

// API-konstanter
export const API_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_TIMEOUT: 30000,
  RATE_LIMIT_DELAY: 1000,
} as const;

// Valideringsregler
export const VALIDATION_RULES = {
  ORG_NUMBER_PATTERN: /^\d{6}-\d{4}$/,
  POSTAL_CODE_PATTERN: /^\d{3} \d{2}$/,
  PHONE_PATTERN: /^(\+46|0)[1-9]\d{7,9}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL_PATTERN: /^https?:\/\/.+/,
} as const;
