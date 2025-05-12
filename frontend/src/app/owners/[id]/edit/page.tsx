"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Owner } from "@/types";
import { ownerService } from "@/services/ownerService";
import Input from "@/components/Input";
import Button from "@/components/Button";

export default function EditOwnerPage({
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
        setOwner((prev) => ({ ...prev, id: parsedId }));
      } catch (error) {
        console.error("Error resolving params:", error);
        router.push("/owners");
      }
    }

    resolveParams();
  }, [params, router]);
  const [owner, setOwner] = useState<Owner>({
    id: 0,
    name: "",
    telephone: "",
    email: "",
    identificationNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchOwner = async () => {
      if (id === null) return; // Skip fetching if id is null

      try {
        setIsLoading(true);
        const data = await ownerService.getById(id);
        setOwner(data);
      } catch (error) {
        console.error("Failed to fetch owner:", error);
        alert("Failed to load owner. Redirecting to list.");
        router.push("/owners");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwner();
  }, [id, router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!owner.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!owner.telephone.trim()) {
      newErrors.telephone = "Telephone is required";
    }

    if (!owner.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(owner.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!owner.identificationNumber.trim()) {
      newErrors.identificationNumber = "Identification Number is required";
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
      await ownerService.update(id, owner);
      router.push("/owners");
      router.refresh();
    } catch (error) {
      console.error("Failed to update owner:", error);
      alert("Failed to update owner. Please try again.");
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

  if (isLoading) {
    return <div className="text-center p-8">Loading owner...</div>;
  }
  return (
    <div className="max-w-lg mx-auto w-full px-2 sm:px-0">
      <h1 className="text-2xl font-bold mb-6 text-[var(--accent-700)] dark:text-[var(--accent-400)]">
        Edit Owner
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--card-bg)] dark:bg-[var(--card-bg)] border border-[var(--border-color)] dark:border-[var(--neutral-700)] shadow-md rounded-xl p-6"
      >
        <Input
          id="name"
          name="name"
          label="Name"
          value={owner.name}
          onChange={handleInputChange}
          error={errors.name}
          required
        />

        <Input
          id="telephone"
          name="telephone"
          label="Telephone"
          type="tel"
          value={owner.telephone}
          onChange={handleInputChange}
          error={errors.telephone}
          required
        />

        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          value={owner.email}
          onChange={handleInputChange}
          error={errors.email}
          required
        />

        <Input
          id="identificationNumber"
          name="identificationNumber"
          label="Identification Number"
          value={owner.identificationNumber}
          onChange={handleInputChange}
          error={errors.identificationNumber}
          required
        />

        <Input
          id="address"
          name="address"
          label="Address"
          value={owner.address || ""}
          onChange={handleInputChange}
          error={errors.address}
        />

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6 w-full">
          <Button
            type="button"
            variant="danger"
            icon="x"
            onClick={() => router.push("/owners")}
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
