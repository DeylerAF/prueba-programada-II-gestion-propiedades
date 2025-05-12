"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Owner } from "../../types";
import { ownerService } from "../../services/ownerService";
import Button from "../../components/Button";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";

export default function OwnerListPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ownerToDelete, setOwnerToDelete] = useState<Owner | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        const data = await ownerService.getAll();
        setOwners(data);
        setError(null);
      } catch (err) {
        setError("Failed to load owners");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const openDeleteModal = (owner: Owner) => {
    setOwnerToDelete(owner);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setOwnerToDelete(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!ownerToDelete) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await ownerService.delete(ownerToDelete.id);
      setOwners(owners.filter((owner) => owner.id !== ownerToDelete.id));
      closeDeleteModal();
    } catch (error) {
      setDeleteError(
        "Failed to delete the owner. They may have properties assigned to them."
      );
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };
  if (loading) {
    return <div className="text-center p-8">Loading owners...</div>;
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
            Owners
          </h1>
          <Link href="/owners/new" className="w-full sm:w-auto">
            <Button variant="accent" fullWidth={true} icon="add">
              Add Owner
            </Button>
          </Link>
        </div>{" "}
        {owners.length === 0 ? (
          <p className="text-center p-8 bg-[var(--card-bg)] rounded-lg text-[var(--text-color)] border border-[var(--border-color)] shadow-md">
            No owners found. Add your first owner!
          </p>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-[var(--neutral-300)] dark:divide-[var(--neutral-700)] bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl text-[var(--text-color)] dark:text-[var(--text-color)]">
              <thead className="bg-[var(--header-bg)] dark:bg-[var(--header-bg)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Telephone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    ID Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-[var(--text-color)] dark:text-[var(--text-color)] uppercase tracking-wider">
                    Actions
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
                      {owner.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {owner.telephone}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {owner.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {owner.identificationNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {owner.address || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right flex flex-col sm:flex-row gap-2 justify-end">
                      <Link href={`/owners/${owner.id}/edit`} className="">
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
                        onClick={() => openDeleteModal(owner)}
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
        title="Delete Owner"
        message={
          ownerToDelete
            ? `Are you sure you want to delete owner "${ownerToDelete.name}"? This action cannot be undone.`
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
