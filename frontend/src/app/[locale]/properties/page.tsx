"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Property, PropertyType, Owner } from "@/types";
import { propertyService } from "@/services/propertyService";
import { propertyTypeService } from "@/services/propertyTypeService";
import { ownerService } from "@/services/ownerService";
import Button from "@/components/Button";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function PropertiesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [propertiesData, propertyTypesData, ownersData] = await Promise.all(
        [
          propertyService.getAll(locale.toString()),
          propertyTypeService.getAll(locale.toString()),
          ownerService.getAll(locale.toString()),
        ]
      );
      setProperties(propertiesData);
      setPropertyTypes(propertyTypesData);
      setOwners(ownersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyTypeName = (propertyTypeId: number) => {
    const propertyType = propertyTypes.find((pt) => pt.id === propertyTypeId);
    return propertyType
      ? propertyType.localizedDescription || propertyType.description
      : "";
  };

  const getOwnerName = (ownerId: number) => {
    const owner = owners.find((o) => o.id === ownerId);
    return owner ? owner.localizedName || owner.name : "";
  };

  const handleEditClick = (id: number) => {
    router.push(`/${locale}/properties/${id}/edit`);
  };

  const handleAddClick = () => {
    router.push(`/${locale}/properties/new`);
  };

  const openDeleteModal = (property: Property) => {
    setPropertyToDelete(property);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    try {
      await propertyService.delete(propertyToDelete.id, locale.toString());
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);
      fetchData();
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  if (loading) {
    return <div className="py-10 text-center">{t("loading")}</div>;
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0 w-full">
          <h1 className="text-2xl font-bold text-[var(--accent-700)] dark:text-[var(--accent-400)]">
            {t("properties.title")}
          </h1>
          <Button
            type="button"
            variant="accent"
            fullWidth={true}
            icon="add"
            className="w-full sm:w-auto"
            onClick={handleAddClick}
          >
            {t("actions.add")}
          </Button>
        </div>
        {properties && Array.isArray(properties) && properties.length === 0 ? (
          <p className="text-center p-8 bg-[var(--card-bg)] rounded-lg text-[var(--text-color)] border border-[var(--border-color)] shadow-md">
            {t("noData")}
          </p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-[var(--neutral-300)] dark:divide-[var(--neutral-700)] bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl text-[var(--text-color)] dark:text-[var(--text-color)]">
              <thead className="bg-[var(--header-bg)] dark:bg-[var(--header-bg)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    {t("properties.number")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    {t("properties.address")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    {t("properties.area")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    {t("properties.constructionArea")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    {t("properties.propertyType")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    {t("properties.owner")}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    {t("actions.edit")}
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
                        {property.localizedAddress || property.address}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {property.area?.toLocaleString(locale, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {property.constructionArea?.toLocaleString(locale, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }) || "N/A"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getPropertyTypeName(property.propertyTypeId)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {getOwnerName(property.ownerId)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right flex flex-col sm:flex-row gap-2 justify-end">
                        <Button
                          variant="accent"
                          size="small"
                          icon="edit"
                          onClick={() => handleEditClick(property.id)}
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
                          onClick={() => openDeleteModal(property)}
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
      </div>
      <ConfirmDeleteModal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={t("properties.deleteConfirmation")}
        message={
          propertyToDelete
            ? t("properties.deleteMessage", { number: propertyToDelete.number })
            : ""
        }
      />
    </>
  );
}
