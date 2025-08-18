import { InputHTMLAttributes } from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  path: string;
  register: UseFormRegister<any>;
  options?: RegisterOptions<any, "">;
  error: FieldError | undefined;
  mask?: (value: string) => string;
  disabled?: boolean;
}

export const Input = ({
  label,
  register,
  options = {},
  path,
  error,
  mask,
  disabled,
  ...rest
}: InputProps) => {
  return (
    <div className="relative flex flex-col gap-3">
      <label
        className={`text-sm font-semibold ${
          disabled
            ? "text-gray-500 dark:text-slate-400"
            : "text-gray-700 dark:text-slate-300"
        } outline-hidden`}
        htmlFor={path}
      >
        {label}
      </label>

      <input
        {...rest}
        {...register(path, {
          ...options,
          onChange: (e) => {
            // If there's a mask function, apply it
            if (mask) {
              const maskedValue = mask(e.target.value);
              e.target.value = maskedValue;
            }
            // Call the original onChange if it exists
            rest.onChange?.(e);
          },
        })}
        id={path}
        name={path}
        disabled={disabled}
        className={`
          bg-div-gray/15 dark:bg-slate-700 text-gray-800 dark:text-slate-200 text-sm border-gray-400 dark:border-slate-600 border outline-hidden w-full rounded-md p-4 shadow transition-colors
          ${rest.className || ""}
          ${error?.message ? "border-red-600 dark:border-red-400" : ""}
          ${
            disabled
              ? "bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-slate-400 cursor-not-allowed border-gray-300 dark:border-slate-500"
              : "bg-gray-100 dark:bg-slate-700"
          }
        `}
      />

      <p className="absolute bottom-[-20px] right-0 text-right text-[10px] font-medium text-red-600 dark:text-red-400">
        {error?.message && error.message}
      </p>
    </div>
  );
};
