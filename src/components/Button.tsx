import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  variant?:
    | "primary.lighter"
    | "primary.light"
    | "primary.regular"
    | "primary.dark"
    | "secondary.lighter"
    | "secondary.light"
    | "secondary.regular"
    | "secondary.dark"
    | "tertiary.lighter"
    | "tertiary.light"
    | "tertiary.regular"
    | "tertiary.dark"
    | "highlight.lighter"
    | "highlight.light"
    | "highlight.regular"
    | "highlight.dark"
    | "gray.lighter"
    | "gray.light"
    | "gray.regular"
    | "gray.dark";
}

const variantStyles = {
  "primary.lighter":
    "bg-transparent text-primary border-primary hover:bg-primary/10 focus:bg-primary/10 active:bg-primary/20",
  "primary.light":
    "bg-transparent text-primary-dark border-primary-dark hover:bg-primary-dark/10 focus:bg-primary-dark/10 active:bg-primary-dark/20",
  "primary.regular":
    "bg-primary text-white border-primary-dark hover:bg-primary-dark focus:bg-primary-dark active:bg-primary-darker shadow-primary/20",
  "primary.dark":
    "bg-primary-dark text-white border-primary-darker hover:bg-primary-darker focus:bg-primary-darker active:bg-primary-darker shadow-primary-dark/20",
  "secondary.lighter":
    "bg-transparent text-secondary border-secondary hover:bg-secondary/10 focus:bg-secondary/10 active:bg-secondary/20",
  "secondary.light":
    "bg-transparent text-secondary-dark border-secondary-dark hover:bg-secondary-dark/10 focus:bg-secondary-dark/10 active:bg-secondary-dark/20",
  "secondary.regular":
    "bg-secondary text-white border-secondary-dark hover:bg-secondary-dark focus:bg-secondary-dark active:bg-secondary-darker shadow-secondary/20",
  "secondary.dark":
    "bg-secondary-dark text-white border-secondary-darker hover:bg-secondary-darker focus:bg-secondary-darker active:bg-secondary-darker shadow-secondary-dark/20",
  "tertiary.lighter":
    "bg-transparent text-tertiary border-tertiary hover:bg-tertiary/10 focus:bg-tertiary/10 active:bg-tertiary/20",
  "tertiary.light":
    "bg-transparent text-tertiary-dark border-tertiary-dark hover:bg-tertiary-dark/10 focus:bg-tertiary-dark/10 active:bg-tertiary-dark/20",
  "tertiary.regular":
    "bg-tertiary text-white border-tertiary-dark hover:bg-tertiary-dark focus:bg-tertiary-dark active:bg-tertiary-darker shadow-tertiary/20",
  "tertiary.dark":
    "bg-tertiary-dark text-white border-tertiary-darker hover:bg-tertiary-darker focus:bg-tertiary-darker active:bg-tertiary-darker shadow-tertiary-dark/20",
  "highlight.lighter":
    "bg-transparent text-highlight border-highlight hover:bg-highlight/10 focus:bg-highlight/10 active:bg-highlight/20",
  "highlight.light":
    "bg-transparent text-highlight-dark border-highlight-dark hover:bg-highlight-dark/10 focus:bg-highlight-dark/10 active:bg-highlight-dark/20",
  "highlight.regular":
    "bg-highlight text-white border-highlight-dark hover:bg-highlight-dark focus:bg-highlight-dark active:bg-highlight-darker shadow-highlight/20",
  "highlight.dark":
    "bg-highlight-dark text-white border-highlight-darker hover:bg-highlight-darker focus:bg-highlight-darker active:bg-highlight-darker shadow-highlight-dark/20",
  "gray.lighter":
    "bg-transparent text-gray-500 border-gray-300 hover:bg-gray-50 focus:bg-gray-50 active:bg-gray-100",
  "gray.light":
    "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-200",
  "gray.regular":
    "bg-gray-100 text-gray-700 border-gray-400 hover:bg-gray-200 focus:bg-gray-200 active:bg-gray-300",
  "gray.dark":
    "bg-gray-200 text-gray-800 border-gray-500 hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-400",
} as const;

const sizeStyles = {
  sm: "py-2 px-4 text-sm gap-1.5 rounded-md",
  md: "py-2.5 px-6 text-base gap-2 rounded-lg",
  lg: "py-3 px-8 text-lg gap-2.5 rounded-xl",
} as const;

export const Button = ({
  children,
  icon,
  variant = "primary.regular",
  size = "md",
  className = "",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = `
    flex items-center justify-center font-medium
    border transition-all duration-200 ease-in-out
    transform hover:scale-[1.02] active:scale-[0.98]
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    shadow-sm hover:shadow-md active:shadow-sm
    relative overflow-hidden
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
    before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
  `;

  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Carregando...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="relative z-10">{children}</span>
        </div>
      )}
    </button>
  );
};
