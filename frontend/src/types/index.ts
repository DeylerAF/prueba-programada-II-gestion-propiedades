// Property Type
export interface PropertyType {
  id: number;
  description: string;
  localizedDescription?: string;
}

// Owner
export interface Owner {
  id: number;
  name: string;
  telephone: string;
  email: string;
  identificationNumber: string;
  address?: string;
  localizedName?: string;
  localizedAddress?: string;
}

// Property
export interface Property {
  id: number;
  number: string;
  address: string;
  area: number;
  constructionArea?: number;
  propertyTypeId: number;
  ownerId: number;
  propertyType?: PropertyType;
  owner?: Owner;
  localizedAddress?: string;
}

// Form validation errors
export interface ValidationErrors {
  [key: string]: string[];
}
