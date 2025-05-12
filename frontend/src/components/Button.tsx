"use client";

import React from "react";
import {
  Loader2,
  Check,
  X,
  Edit,
  Trash2,
  Plus,
  Save,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "accent" | "success";
  size?: "small" | "normal" | "large";
  outline?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  icon?:
    | "edit"
    | "delete"
    | "add"
    | "save"
    | "check"
    | "x"
    | "left"
    | "right"
    | "loader";
  iconPosition?: "left" | "right";
}

export default function Button({
  type = "button",
  onClick,
  variant = "primary",
  size = "normal",
  outline = false,
  disabled = false,
  className = "",
  children,
  fullWidth = false,
  icon,
  iconPosition = "left",
}: ButtonProps) {
  // Icon mapping for lucide-react
  const iconMap = {
    edit: <Edit className="w-4 h-4" aria-hidden="true" />,
    delete: <Trash2 className="w-4 h-4" aria-hidden="true" />,
    add: <Plus className="w-4 h-4" aria-hidden="true" />,
    save: <Save className="w-4 h-4" aria-hidden="true" />,
    check: <Check className="w-4 h-4" aria-hidden="true" />,
    x: <X className="w-4 h-4" aria-hidden="true" />,
    left: <ArrowLeft className="w-4 h-4" aria-hidden="true" />,
    right: <ArrowRight className="w-4 h-4" aria-hidden="true" />,
    loader: <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />,
  };
  const baseStyle =
    "rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";

  // Using the CSS variables defined in globals.css
  const variantStyles = {
    primary: outline
      ? "btn-outline-accent border-2" // Use accent outline for primary
      : "bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white focus:ring-[var(--accent-500)]",
    secondary:
      "bg-[var(--neutral-200)] hover:bg-[var(--neutral-300)] text-[var(--neutral-800)] focus:ring-[var(--neutral-500)]",
    danger:
      "bg-[var(--danger-600)] hover:bg-[var(--danger-700)] text-white focus:ring-[var(--danger-500)]",
    accent: outline
      ? "btn-outline-accent border-2"
      : "bg-[var(--accent-600)] hover:bg-[var(--accent-700)] text-white focus:ring-[var(--accent-500)]",
    success:
      "bg-[var(--success-600)] hover:bg-[var(--success-700)] text-white focus:ring-[var(--success-500)]",
  };

  // Size classes imported from globals.css
  const sizeClasses = {
    small: "btn-size-small",
    normal: "btn-size-normal",
    large: "btn-size-large",
  };

  const buttonClasses = `
    ${baseStyle} 
    ${variantStyles[variant]} 
    ${sizeClasses[size]}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {icon && iconPosition === "left" && (
        <span
          className={`flex items-center ${
            ["edit", "delete"].includes(icon) ? "mr-0 sm:mr-2" : "mr-2"
          }`}
        >
          {iconMap[icon]}
        </span>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <span className="ml-2 flex items-center">{iconMap[icon]}</span>
      )}
    </button>
  );
}
