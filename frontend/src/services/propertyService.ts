import { Property } from "../types";
import {
  createEntity,
  getEntities,
  getEntityById,
  updateEntity,
  deleteEntity,
} from "./api";

const ENDPOINT = "/Properties";

export const propertyService = {
  getAll: (language?: string) => getEntities<Property>(ENDPOINT, language),
  getById: (id: number, language?: string) =>
    getEntityById<Property>(ENDPOINT, id, language),
  create: (data: Omit<Property, "id">, language?: string) =>
    createEntity<Property>(ENDPOINT, data as Property, language),
  update: (id: number, data: Property, language?: string) =>
    updateEntity<Property>(ENDPOINT, id, data, language),
  delete: (id: number, language?: string) =>
    deleteEntity(ENDPOINT, id, language),
};
