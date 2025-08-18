import { Path, UseFormRegister } from "react-hook-form";

type CheckboxProps = {
  path: Path<any>;
  register: UseFormRegister<any>;
  label?: string;
  subLabel?: string;
};

export const Checkbox = ({
  path,
  register,
  label,
  subLabel,
}: CheckboxProps) => {
  return (
    <div className="relative flex items-start">
      <div className="flex h-5 items-center">
        <input
          id="comments"
          aria-describedby="comments-description"
          type="checkbox"
          className="h-4 w-4 accent-[#BCFF00] rounded-sm border-gray-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          {...register(path)}
        />
      </div>
      <div className="ml-1 text-sm">
        {label && (
          <label
            htmlFor="comments"
            className="font-normal text-neutral-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        {subLabel && (
          <p
            id="comments-description"
            className="text-gray-500 dark:text-slate-400"
          >
            {subLabel}
          </p>
        )}
      </div>
    </div>
  );
};
