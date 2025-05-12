"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Property, PropertyType, Owner } from "@/types";
import { propertyService } from "@/services/propertyService";
import { propertyTypeService } from "@/services/propertyTypeService";
import { ownerService } from "@/services/ownerService";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";

export default function NewPropertyPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [property, setProperty] = useState<Omit<Property, "id">>({
    number: "",
    address: "",
    area: 0.0,
    constructionArea: undefined,
    propertyTypeId: 0,
    ownerId: 0,
  });

  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [typesData, ownersData] = await Promise.all([
          propertyTypeService.getAll(locale.toString()),
          ownerService.getAll(locale.toString()),
        ]);
        setPropertyTypes(typesData);
        setOwners(ownersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert(t("errors.generic"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [locale, t]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!property.number.trim()) {
      newErrors.number = t("validation.required", {
        field: t("properties.number"),
      });
    }

    if (!property.address.trim()) {
      newErrors.address = t("validation.required", {
        field: t("properties.address"),
      });
    }

    if (
      property.area === undefined ||
      property.area === null ||
      isNaN(parseFloat(property.area.toString())) ||
      parseFloat(property.area.toString()) < 0
    ) {
      newErrors.area = t("validation.number");
    }

    if (
      property.constructionArea !== undefined &&
      property.constructionArea !== null &&
      (isNaN(parseFloat(property.constructionArea.toString())) ||
        parseFloat(property.constructionArea.toString()) < 0)
    ) {
      newErrors.constructionArea = t("validation.number");
    }

    if (!property.propertyTypeId) {
      newErrors.propertyTypeId = t("validation.required", {
        field: t("properties.propertyType"),
      });
    }

    if (!property.ownerId) {
      newErrors.ownerId = t("validation.required", {
        field: t("properties.owner"),
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
      await propertyService.create(property, locale.toString());
      router.push(`/${locale}/properties`);
      router.refresh();
    } catch (error) {
      console.error("Failed to create property:", error);
      alert(t("errors.generic"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle numeric inputs
    if (name === "area" || name === "constructionArea") {
      setProperty({
        ...property,
        [name]: value === "" ? undefined : parseFloat(value),
      });
    }
    // Handle select inputs
    else if (name === "propertyTypeId" || name === "ownerId") {
      setProperty({
        ...property,
        [name]: parseInt(value, 10) || 0,
      });
    }
    // Handle text inputs
    else {
      setProperty({
        ...property,
        [name]: value,
      });
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">{t("loading")}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-2 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-[var(--accent-700)] dark:text-[var(--accent-400)]">
        {t("properties.newProperty")}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl p-6"
      >
        <Input
          id="number"
          name="number"
          label={t("properties.number")}
          value={property.number}
          onChange={handleInputChange}
          error={errors.number}
          required
        />

        <Input
          id="address"
          name="address"
          label={t("properties.address")}
          value={property.address}
          onChange={handleInputChange}
          error={errors.address}
          required
        />

        <Input
          id="area"
          name="area"
          label={t("properties.area")}
          type="number"
          min="0"
          step="0.01"
          value={property.area?.toString() || ""}
          onChange={handleInputChange}
          error={errors.area}
          required
        />

        <Input
          id="constructionArea"
          name="constructionArea"
          label={t("properties.constructionArea")}
          type="number"
          min="0"
          step="0.01"
          value={property.constructionArea?.toString() || ""}
          onChange={handleInputChange}
          error={errors.constructionArea}
        />

        <Select
          id="propertyTypeId"
          name="propertyTypeId"
          label={t("properties.propertyType")}
          value={property.propertyTypeId.toString()}
          onChange={handleInputChange}
          error={errors.propertyTypeId}
          required
          options={propertyTypes.map((type) => ({
            value: type.id,
            label: type.description,
          }))}
        >
          <option value="">{t("actions.select")}</option>
        </Select>

        <Select
          id="ownerId"
          name="ownerId"
          label={t("properties.owner")}
          value={property.ownerId.toString()}
          onChange={handleInputChange}
          error={errors.ownerId}
          required
          options={owners.map((owner) => ({
            value: owner.id,
            label: owner.name,
          }))}
        >
          <option value="">{t("actions.select")}</option>
        </Select>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6 w-full">
          <Button
            type="button"
            variant="danger"
            icon="x"
            onClick={() => router.push(`/${locale}/properties`)}
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
