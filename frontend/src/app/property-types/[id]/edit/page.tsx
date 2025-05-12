"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PropertyType } from "@/types";
import { propertyTypeService } from "@/services/propertyTypeService";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function EditPropertyTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [id, setId] = useState<number | null>(null);

  // Use effect to resolve the params promise
  useEffect(() => {
    async function resolveParams() {
      try {
        const resolvedParams = await params;
        const parsedId = parseInt(resolvedParams.id, 10);
        setId(parsedId);
        setPropertyType((prev) => ({ ...prev, id: parsedId }));
      } catch (error) {
        console.error("Error resolving params:", error);
        router.push("/property-types");
      }
    }

    resolveParams();
  }, [params, router]);

  const [propertyType, setPropertyType] = useState<PropertyType>({
    id: 0,
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchPropertyType = async () => {
      if (id === null) return; // Skip fetching if id is null

      try {
        setIsLoading(true);
        const data = await propertyTypeService.getById(id);
        setPropertyType(data);
      } catch (error) {
        console.error("Failed to fetch property type:", error);
        alert("Failed to load property type. Redirecting to list.");
        router.push("/property-types");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyType();
  }, [id, router]);

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

    if (!validateForm() || id === null) {
      return;
    }

    setIsSubmitting(true);

    try {
      await propertyTypeService.update(id, propertyType);
      router.push("/property-types");
      router.refresh();
    } catch (error) {
      console.error("Failed to update property type:", error);
      alert("Failed to update property type. Please try again.");
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

  if (isLoading) {
    return <div className="text-center p-8">Loading property type...</div>;
  }
  return (
    <div className="max-w-lg mx-auto w-full px-2 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-[var(--accent-700)] dark:text-[var(--accent-400)]">
        Edit Property Type
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
