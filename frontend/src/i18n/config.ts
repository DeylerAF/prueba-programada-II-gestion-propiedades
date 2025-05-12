export const defaultLocale = "en";
export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

// Utility function to get display names for each locale
export function getLanguageNames() {
  return {
    en: "English",
    es: "Español",
  };
}

// Mapping between backend field names and localized display names
export const fieldMappings = {
  // Property fields
  number: { en: "number", es: "número" },
  address: { en: "address", es: "dirección" },
  area: { en: "area", es: "área" },
  constructionArea: { en: "construction area", es: "área de construcción" },
  propertyType: { en: "property type", es: "tipo de propiedad" },
  owner: { en: "owner", es: "propietario" },

  // Property type fields
  description: { en: "description", es: "descripción" },

  // Owner fields
  name: { en: "name", es: "nombre" },
  telephone: { en: "telephone", es: "teléfono" },
  email: { en: "email", es: "correo electrónico" },
  identificationNumber: {
    en: "identification number",
    es: "número de identificación",
  },
};
