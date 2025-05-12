"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Owner } from "@/types";
import { ownerService } from "@/services/ownerService";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function NewOwnerPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [owner, setOwner] = useState<Omit<Owner, "id">>({
    name: "",
    telephone: "",
    email: "",
    identificationNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!owner.name.trim()) {
      newErrors.name = t("validation.required", { field: t("owners.name") });
    }

    if (!owner.telephone.trim()) {
      newErrors.telephone = t("validation.required", {
        field: t("owners.telephone"),
      });
    }

    if (!owner.email.trim()) {
      newErrors.email = t("validation.required", { field: t("owners.email") });
    } else if (!emailRegex.test(owner.email)) {
      newErrors.email = t("validation.email");
    }

    if (!owner.identificationNumber.trim()) {
      newErrors.identificationNumber = t("validation.required", {
        field: t("owners.identificationNumber"),
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await ownerService.create(owner, locale.toString());
      router.push(`/${locale}/owners`);
      router.refresh();
    } catch (error) {
      console.error("Failed to create owner:", error);
      alert(t("errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOwner({
      ...owner,
      [name]: value,
    });
  };

  return (
    <div className="max-w-lg mx-auto w-full px-2 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-[var(--accent-700)] dark:text-[var(--accent-400)]">
        {t("owners.newOwner")}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl p-6"
      >
        <Input
          id="name"
          name="name"
          label={t("owners.name")}
          value={owner.name}
          onChange={handleInputChange}
          error={errors.name}
          required
        />

        <Input
          id="telephone"
          name="telephone"
          label={t("owners.telephone")}
          type="tel"
          value={owner.telephone}
          onChange={handleInputChange}
          error={errors.telephone}
          required
        />

        <Input
          id="email"
          name="email"
          label={t("owners.email")}
          type="email"
          value={owner.email}
          onChange={handleInputChange}
          error={errors.email}
          required
        />

        <Input
          id="identificationNumber"
          name="identificationNumber"
          label={t("owners.identificationNumber")}
          value={owner.identificationNumber}
          onChange={handleInputChange}
          error={errors.identificationNumber}
          required
        />

        <Input
          id="address"
          name="address"
          label={t("owners.address")}
          value={owner.address || ""}
          onChange={handleInputChange}
          error={errors.address}
        />

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6 w-full">
          <Button
            type="button"
            variant="danger"
            icon="x"
            onClick={() => router.push(`/${locale}/owners`)}
            fullWidth
          >
            {t("actions.cancel")}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            icon={isSubmitting ? "loader" : "save"}
            fullWidth
          >
            {isSubmitting ? t("loading") : t("actions.save")}
          </Button>
        </div>
      </form>
    </div>
  );
}
