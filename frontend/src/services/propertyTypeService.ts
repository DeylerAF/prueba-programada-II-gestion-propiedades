import { PropertyType } from "../types";
import {
  createEntity,
  getEntities,
  getEntityById,
  updateEntity,
  deleteEntity,
} from "./api";

const ENDPOINT = "/PropertyTypes";

export const propertyTypeService = {
  getAll: (language?: string) => getEntities<PropertyType>(ENDPOINT, language),
  getById: (id: number, language?: string) =>
    getEntityById<PropertyType>(ENDPOINT, id, language),
  create: (data: Omit<PropertyType, "id">, language?: string) =>
    createEntity<PropertyType>(ENDPOINT, data as PropertyType, language),
  update: (id: number, data: PropertyType, language?: string) =>
    updateEntity<PropertyType>(ENDPOINT, id, data, language),
  delete: (id: number, language?: string) =>
    deleteEntity(ENDPOINT, id, language),
};
