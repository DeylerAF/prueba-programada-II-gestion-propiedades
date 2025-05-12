"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Property, PropertyType, Owner } from "@/types";
import { propertyService } from "@/services/propertyService";
import { propertyTypeService } from "@/services/propertyTypeService";
import { ownerService } from "@/services/ownerService";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";

export default function EditPropertyPage({
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
        setProperty((prev) => ({ ...prev, id: parsedId }));
      } catch (error) {
        console.error("Error resolving params:", error);
        router.push("/properties");
      }
    }

    resolveParams();
  }, [params, router]);

  const [property, setProperty] = useState<Property>({
    id: 0,
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
      if (id === null) return; // Skip fetching if id is null

      try {
        setIsLoading(true);
        const [propertyData, typesData, ownersData] = await Promise.all([
          propertyService.getById(id),
          propertyTypeService.getAll(),
          ownerService.getAll(),
        ]);
        setProperty(propertyData);
        setPropertyTypes(typesData);
        setOwners(ownersData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to load property data. Redirecting to list.");
        router.push("/properties");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!property.number.trim()) {
      newErrors.number = "Number is required";
    }

    if (!property.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (
      property.area === undefined ||
      property.area === null ||
      isNaN(parseFloat(property.area.toString())) ||
      parseFloat(property.area.toString()) < 0
    ) {
      newErrors.area = "Area is required and must be a positive decimal number";
    }
    if (
      property.constructionArea !== undefined &&
      property.constructionArea !== null &&
      (isNaN(parseFloat(property.constructionArea.toString())) ||
        parseFloat(property.constructionArea.toString()) < 0)
    ) {
      newErrors.constructionArea =
        "Construction Area must be a positive decimal number";
    }

    if (!property.propertyTypeId) {
      newErrors.propertyTypeId = "Property type is required";
    }

    if (!property.ownerId) {
      newErrors.ownerId = "Owner is required";
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
      await propertyService.update(id, property);
      router.push("/properties");
      router.refresh();
    } catch (error) {
      console.error("Failed to update property:", error);
      alert("Failed to update property. Please try again.");
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
    setProperty({
      ...property,
      [name]:
        name === "propertyTypeId" || name === "ownerId"
          ? parseInt(value, 10) || 0
          : name === "area" || name === "constructionArea"
          ? parseFloat(value) || 0
          : value,
    });
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading property data...</div>;
  }
  return (
    <div className="max-w-2xl mx-auto w-full px-2 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-[var(--accent-700)] dark:text-[var(--accent-400)]">
        Edit Property
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl p-6"
      >
        <Input
          id="number"
          name="number"
          label="Number"
          value={property.number}
          onChange={handleInputChange}
          error={errors.number}
          required
        />
        <Input
          id="address"
          name="address"
          label="Address"
          value={property.address}
          onChange={handleInputChange}
          error={errors.address}
          required
        />{" "}
        <Input
          id="area"
          name="area"
          label="Area"
          type="number"
          min="0"
          step="0.01"
          value={property.area}
          onChange={handleInputChange}
          error={errors.area}
          required
        />{" "}
        <Input
          id="constructionArea"
          name="constructionArea"
          label="Construction Area"
          type="number"
          min="0"
          step="0.01"
          value={property.constructionArea}
          onChange={handleInputChange}
          error={errors.constructionArea}
        />
        <Select
          id="propertyTypeId"
          name="propertyTypeId"
          label="Property Type"
          value={property.propertyTypeId || ""}
          onChange={handleInputChange}
          options={propertyTypes.map((type) => ({
            value: type.id,
            label: type.description,
          }))}
          error={errors.propertyTypeId}
          required
        />
        <Select
          id="ownerId"
          name="ownerId"
          label="Owner"
          value={property.ownerId || ""}
          onChange={handleInputChange}
          options={owners.map((owner) => ({
            value: owner.id,
            label: owner.name,
          }))}
          error={errors.ownerId}
          required
        />
        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6 w-full">
          <Button
            type="button"
            variant="danger"
            icon="x"
            onClick={() => router.push("/properties")}
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
