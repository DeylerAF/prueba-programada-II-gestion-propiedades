"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Owner } from "@/types";
import { ownerService } from "@/services/ownerService";
import Button from "@/components/Button";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

export default function OwnersPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ownerToDelete, setOwnerToDelete] = useState<Owner | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchOwners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ownerService.getAll(locale.toString());
      setOwners(data);
    } catch (error) {
      console.error("Error fetching owners:", error);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    fetchOwners();
  }, [fetchOwners]);

  const openDeleteModal = (owner: Owner) => {
    setOwnerToDelete(owner);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!ownerToDelete) return;
    setDeleteError(null);
    try {
      await ownerService.delete(ownerToDelete.id, locale.toString());
      setIsDeleteModalOpen(false);
      setOwnerToDelete(null);
      fetchOwners();
    } catch (error) {
      // Use a more specific error type if possible
      const backendMsg = error instanceof Error ? error.message : "";
      if (
        backendMsg.includes("associated properties") ||
        backendMsg.includes("propiedades asociadas")
      ) {
        setDeleteError(t("owners.deleteErrorInUse"));
      } else {
        setDeleteError(t("errors.generic"));
      }
      console.error("Error deleting owner:", error);
    }
  };

  if (loading) {
    return <div className="py-10 text-center">{t("loading")}</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0 w-full">
        <h1 className="text-2xl font-bold text-[var(--accent-700)] dark:text-[var(--accent-400)]">
          {t("owners.title")}
        </h1>
        <Link href={`/${locale}/owners/new`} className="w-full sm:w-auto">
          <Button variant="accent" fullWidth={true} icon="add">
            {t("actions.add")}
          </Button>
        </Link>
      </div>
      {owners.length === 0 ? (
        <p className="text-center p-8 bg-[var(--card-bg)] rounded-lg text-[var(--text-color)] border border-[var(--border-color)] shadow-md">
          {t("noData")}
        </p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-[var(--neutral-300)] dark:divide-[var(--neutral-700)] bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl text-[var(--text-color)] dark:text-[var(--text-color)]">
            <thead className="bg-[var(--header-bg)] dark:bg-[var(--header-bg)]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                  {t("owners.name")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                  {t("owners.telephone")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                  {t("owners.email")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                  {t("owners.identificationNumber")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                  {t("owners.address")}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                  {t("actions.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--neutral-300)] dark:divide-[var(--neutral-700)]">
              {owners.map((owner) => (
                <tr
                  key={owner.id}
                  className="hover:bg-[var(--hover-bg)] dark:hover:bg-[var(--hover-bg)] transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    {owner.localizedName || owner.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {owner.telephone}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{owner.email}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {owner.identificationNumber}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {owner.address || "N/A"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right flex flex-col sm:flex-row gap-2 justify-end">
                    <Link
                      href={`/${locale}/owners/${owner.id}/edit`}
                      className=""
                    >
                      <Button
                        variant="accent"
                        size="small"
                        icon="edit"
                        className="w-10 h-10 sm:min-w-[100px] sm:h-10 flex items-center justify-center"
                      >
                        <span className="hidden sm:inline">
                          {t("actions.edit")}
                        </span>
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="small"
                      icon="delete"
                      onClick={() => openDeleteModal(owner)}
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
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={t("owners.deleteConfirmation")}
        message={
          ownerToDelete
            ? t("owners.deleteConfirmationMessage", {
                name: ownerToDelete.name,
              })
            : ""
        }
      />
      {deleteError && (
        <div className="text-center p-4 text-[var(--danger-600)]">
          {deleteError}
        </div>
      )}
    </div>
  );
}
