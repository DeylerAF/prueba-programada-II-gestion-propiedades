"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PropertyType } from "@/types";
import { propertyTypeService } from "@/services/propertyTypeService";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function NewPropertyTypePage() {
  const router = useRouter();
  const [propertyType, setPropertyType] = useState<Omit<PropertyType, "id">>({
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!propertyType.description.trim()) {
      newErrors.description = "Description is required";
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
      await propertyTypeService.create(propertyType);
      router.push("/property-types");
      router.refresh();
    } catch (error) {
      console.error("Failed to create property type:", error);
      alert("Failed to create property type. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPropertyType({
      ...propertyType,
      [name]: value,
    });
  };
  return (
    <div className="max-w-lg mx-auto w-full px-2 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-[var(--accent-700)] dark:text-[var(--accent-400)]">
        Add New Property Type
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl p-6"
      >
        <Input
          id="description"
          name="description"
          label="Description"
          value={propertyType.description}
          onChange={handleInputChange}
          error={errors.description}
          required
        />

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6 w-full">
          <Button
            type="button"
            variant="danger"
            icon="x"
            onClick={() => router.push("/property-types")}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            icon={isSubmitting ? "loader" : "save"}
            fullWidth
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
