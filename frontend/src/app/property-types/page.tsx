"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PropertyType } from "../../types";
import { propertyTypeService } from "../../services/propertyTypeService";
import Button from "../../components/Button";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

export default function PropertyTypeListPage() {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyTypeToDelete, setPropertyTypeToDelete] =
    useState<PropertyType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        setLoading(true);
        const data = await propertyTypeService.getAll();
        setPropertyTypes(data);
        setError(null);
      } catch (err) {
        setError("Failed to load property types");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyTypes();
  }, []);

  const openDeleteModal = (propertyType: PropertyType) => {
    setPropertyTypeToDelete(propertyType);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPropertyTypeToDelete(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!propertyTypeToDelete) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await propertyTypeService.delete(propertyTypeToDelete.id);
      setPropertyTypes(
        propertyTypes.filter((type) => type.id !== propertyTypeToDelete.id)
      );
      closeDeleteModal();
    } catch (error) {
      setDeleteError(
        "Failed to delete the property type. It may be referenced by properties."
      );
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading property types...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-8 text-[var(--danger-600)]">{error}</div>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0 w-full">
          <h1 className="text-2xl font-bold text-[var(--accent-700)] dark:text-[var(--accent-400)]">
            Property Types
          </h1>
          <Link href="/property-types/new" className="w-full sm:w-auto">
            <Button variant="accent" fullWidth={true} icon="add">
              Add Property Type
            </Button>
          </Link>
        </div>{" "}
        {propertyTypes.length === 0 ? (
          <p className="text-center p-8 bg-[var(--card-bg)] rounded-lg text-[var(--text-color)] border border-[var(--border-color)] shadow-md">
            No property types found. Add your first property type!
          </p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-[var(--neutral-300)] dark:divide-[var(--neutral-700)] bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl text-[var(--text-color)] dark:text-[var(--text-color)]">
              <thead className="bg-[var(--header-bg)] dark:bg-[var(--header-bg)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--neutral-300)] dark:divide-[var(--neutral-700)]">
                {propertyTypes.map((propertyType) => (
                  <tr
                    key={propertyType.id}
                    className="hover:bg-[var(--hover-bg)] dark:hover:bg-[var(--hover-bg)] transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      {propertyType.id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {propertyType.description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right flex flex-col sm:flex-row gap-2 justify-end">
                      <Link
                        href={`/property-types/${propertyType.id}/edit`}
                        className=""
                      >
                        <Button
                          variant="accent"
                          size="small"
                          icon="edit"
                          className="w-10 h-10 sm:min-w-[100px] sm:h-10 flex items-center justify-center"
                        >
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        icon="delete"
                        onClick={() => openDeleteModal(propertyType)}
                        className="w-10 h-10 sm:min-w-[100px] sm:h-10 flex items-center justify-center"
                      >
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmDeleteModal
        open={deleteModalOpen}
        title="Delete Property Type"
        message={
          propertyTypeToDelete
            ? `Are you sure you want to delete property type "${propertyTypeToDelete.description}"? This action cannot be undone.`
            : ""
        }
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
        loading={deleteLoading}
      />
      {deleteError && (
        <div className="text-center p-4 text-[var(--danger-600)]">
          {deleteError}
        </div>
      )}
    </>
  );
}
