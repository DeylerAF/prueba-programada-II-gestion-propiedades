"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  fullWidth?: boolean;
  labelClassName?: string;
  containerClassName?: string;
}

export default function Input({
  label,
  id,
  error,
  fullWidth = true,
  className = "",
  labelClassName = "",
  containerClassName = "",
  ...props
}: InputProps) {
  return (
    <div
      className={`mb-4 ${
        fullWidth ? "w-full" : "w-auto"
      } ${containerClassName} max-w-full`}
    >
      <label
        htmlFor={id}
        className={`block text-sm font-medium mb-1 ${labelClassName}`}
        style={{ color: "var(--text-color)" }}
      >
        {label}
      </label>
      <input
        id={id}
        className={`block ${
          fullWidth ? "w-full" : "w-auto"
        } px-3 py-2 border rounded-md shadow-sm transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-[var(--info-500)]
        ${
          error
            ? "border-[var(--danger-500)] focus:border-[var(--danger-600)]"
            : "border-[var(--border-color)]"
        }
        bg-[var(--bg-color)] text-[var(--text-color)]
        placeholder:text-[var(--neutral-400)] dark:placeholder:text-[var(--neutral-500)]
        ${className}`}
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
          borderColor: error ? "var(--danger-500)" : "var(--border-color)",
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm" style={{ color: "var(--danger-600)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
