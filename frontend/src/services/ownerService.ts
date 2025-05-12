import { Owner } from "../types";
import {
  createEntity,
  getEntities,
  getEntityById,
  updateEntity,
  deleteEntity,
} from "./api";

const ENDPOINT = "/Owners";

export const ownerService = {
  getAll: (language?: string) => getEntities<Owner>(ENDPOINT, language),
  getById: (id: number, language?: string) =>
    getEntityById<Owner>(ENDPOINT, id, language),
  create: (data: Omit<Owner, "id">, language?: string) =>
    createEntity<Owner>(ENDPOINT, data as Owner, language),
  update: (id: number, data: Owner, language?: string) =>
    updateEntity<Owner>(ENDPOINT, id, data, language),
  delete: (id: number, language?: string) =>
    deleteEntity(ENDPOINT, id, language),
};
