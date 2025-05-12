"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { PropertyType } from "@/types";
import { propertyTypeService } from "@/services/propertyTypeService";
import Button from "@/components/Button";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function PropertyTypesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyTypeToDelete, setPropertyTypeToDelete] =
    useState<PropertyType | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchPropertyTypes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await propertyTypeService.getAll(locale.toString());
      setPropertyTypes(data);
    } catch (error) {
      console.error("Error fetching property types:", error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchPropertyTypes();
  }, [fetchPropertyTypes]);

  const handleEditClick = (id: number) => {
    router.push(`/${locale}/property-types/${id}/edit`);
  };

  const handleAddClick = () => {
    router.push(`/${locale}/property-types/new`);
  };

  const openDeleteModal = (propertyType: PropertyType) => {
    setPropertyTypeToDelete(propertyType);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!propertyTypeToDelete) return;
    setDeleteError(null);
    try {
      await propertyTypeService.delete(
        propertyTypeToDelete.id,
        locale.toString()
      );
      setIsDeleteModalOpen(false);
      setPropertyTypeToDelete(null);
      fetchPropertyTypes();
    } catch (error) {
      // Detect backend error and show i18n message if matches
      const backendMsg = error instanceof Error ? error.message : "";
      if (
        backendMsg.includes("associated properties") ||
        backendMsg.includes("propiedades asociadas")
      ) {
        setDeleteError(t("propertyTypes.deleteErrorInUse"));
      } else {
        setDeleteError(t("errors.generic"));
      }
      console.error("Error deleting property type:", error);
    }
  };
  if (loading) {
    return <div className="text-center p-8">{t("loading")}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
      {" "}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0 w-full">
        <h1 className="text-2xl font-bold text-[var(--accent-700)] dark:text-[var(--accent-400)]">
          {t("propertyTypes.title")}
        </h1>
        <div className="w-full sm:w-auto">
          <Button
            variant="accent"
            fullWidth={true}
            icon="add"
            onClick={handleAddClick}
          >
            {t("actions.add")}
          </Button>
        </div>
      </div>
      {propertyTypes.length === 0 ? (
        <p className="text-center p-8 bg-[var(--card-bg)] rounded-lg text-[var(--text-color)] border border-[var(--border-color)] shadow-md">
          {t("noData")}
        </p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-[var(--neutral-300)] dark:divide-[var(--neutral-700)] bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl text-[var(--text-color)] dark:text-[var(--text-color)]">
            <thead className="bg-[var(--header-bg)] dark:bg-[var(--header-bg)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                  {t("propertyTypes.description")}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                  {t("actions.actions")}
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
                    {propertyType.localizedDescription ||
                      propertyType.description}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right flex flex-col sm:flex-row gap-2 justify-end">
                    <Button
                      variant="accent"
                      size="small"
                      icon="edit"
                      onClick={() => handleEditClick(propertyType.id)}
                      className="w-10 h-10 sm:min-w-[100px] sm:h-10 flex items-center justify-center"
                    >
                      <span className="hidden sm:inline">
                        {t("actions.edit")}
                      </span>
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      icon="delete"
                      onClick={() => openDeleteModal(propertyType)}
                      className="w-10 h-10 sm:min-w-[100px] sm:h-10 flex items-center justify-center"
                    >
                      <span className="hidden sm:inline">
                        {t("actions.delete")}
                      </span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        title={t("propertyTypes.deleteConfirmation")}
        message={
          propertyTypeToDelete
            ? `${t("propertyTypes.deleteConfirmationMessage", {
                description:
                  propertyTypeToDelete.localizedDescription ||
                  propertyTypeToDelete.description,
              })}`
            : ""
        }
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={false}
      />
      {deleteError && (
        <div className="text-center p-4 text-[var(--danger-600)]">
          {deleteError}
        </div>
      )}
    </div>
  );
}
