"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Property } from "../../types";
import { propertyService } from "../../services/propertyService";
import Button from "../../components/Button";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

export default function PropertyListPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyService.getAll();
        if (data) {
          setProperties(Array.isArray(data) ? data : []);
          setError(null);
        } else {
          setProperties([]);
          setError("No properties data received");
        }
      } catch (err) {
        setError("Failed to load properties");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const openDeleteModal = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPropertyToDelete(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await propertyService.delete(propertyToDelete.id);
      setProperties(
        properties.filter((property) => property.id !== propertyToDelete.id)
      );
      closeDeleteModal();
    } catch (error) {
      setDeleteError("Failed to delete the property.");
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading properties...</div>;
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
            Properties
          </h1>
          <Link href="/properties/new" className="w-full sm:w-auto">
            <Button variant="accent" fullWidth={true} icon="add">
              Add Property
            </Button>
          </Link>
        </div>{" "}
        {properties && Array.isArray(properties) && properties.length === 0 ? (
          <p className="text-center p-8 bg-[var(--card-bg)] rounded-lg text-[var(--text-color)] border border-[var(--border-color)] shadow-md">
            No properties found. Add your first property!
          </p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-[var(--neutral-300)] dark:divide-[var(--neutral-700)] bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl text-[var(--text-color)] dark:text-[var(--text-color)]">
              <thead className="bg-[var(--header-bg)] dark:bg-[var(--header-bg)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Construction Area
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Property Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--neutral-300)] dark:divide-[var(--neutral-700)]">
                {properties &&
                  Array.isArray(properties) &&
                  properties.map((property) => (
                    <tr
                      key={property.id}
                      className="hover:bg-[var(--hover-bg)] dark:hover:bg-[var(--hover-bg)] transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        {property.number}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {property.address}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {property.area?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {property.constructionArea?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {property.propertyType?.description || "Unknown"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {property.owner?.name || "Unknown"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right flex flex-col sm:flex-row gap-2 justify-end">
                        <Link
                          href={`/properties/${property.id}/edit`}
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
                          onClick={() => openDeleteModal(property)}
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
        title="Delete Property"
        message={
          propertyToDelete
            ? `Are you sure you want to delete property "${propertyToDelete.number}"? This action cannot be undone.`
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
