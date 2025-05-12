// Base API configuration
export const API_BASE_URL = "http://localhost:5119/api";

// Interface for responses that might include $values property (from ReferenceHandler.Preserve)
interface EntityCollection<T> {
  $values?: T[];
  [key: string]: unknown;
}

// Generic API fetch function
export async function fetchApi<T>(
  url: string,
  options: RequestInit = {},
  language?: string
): Promise<T> {
  // Add language parameter if provided
  const urlWithLang = language
    ? `${API_BASE_URL}${url}${url.includes("?") ? "&" : "?"}lang=${language}`
    : `${API_BASE_URL}${url}`;

  const response = await fetch(urlWithLang, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An unknown error occurred",
    }));
    throw new Error(error.message || "An unknown error occurred");
  }

  // Check if the response has content (for methods like DELETE that return no content)
  const contentType = response.headers.get("content-type");
  if (
    response.status === 204 ||
    !contentType ||
    !contentType.includes("application/json")
  ) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

// Generic CRUD services
export const createEntity = <T>(
  endpoint: string,
  data: T,
  language?: string
): Promise<T> => {
  return fetchApi<T>(
    endpoint,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    language
  );
};

export const getEntities = <T>(
  endpoint: string,
  language?: string
): Promise<T[]> => {
  // We need to handle both normal arrays and the Reference-preserved format
  return fetchApi<EntityCollection<T> | T[]>(endpoint, {}, language).then(
    (response) => {
      // Check if the response has $values property from ReferenceHandler.Preserve
      if (
        response &&
        typeof response === "object" &&
        "$values" in response &&
        Array.isArray(response.$values)
      ) {
        return (response as EntityCollection<T>).$values as T[];
      }
      return response as T[];
    }
  );
};

export const getEntityById = <T>(
  endpoint: string,
  id: number,
  language?: string
): Promise<T> => {
  // Use a more specific type instead of any
  return fetchApi<T>(`${endpoint}/${id}`, {}, language);
};

export const updateEntity = <T>(
  endpoint: string,
  id: number,
  data: T,
  language?: string
): Promise<void> => {
  return fetchApi<void>(
    `${endpoint}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    language
  );
};

export const deleteEntity = (
  endpoint: string,
  id: number,
  language?: string
): Promise<void> => {
  return fetchApi<void>(
    `${endpoint}/${id}`,
    {
      method: "DELETE",
    },
    language
  );
};
