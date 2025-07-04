import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
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

export const Button = ({
  children,
  icon,
  variant = "primary.regular",
  className,
  isLoading = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`
				flex items-center gap-2 rounded py-2.5 px-7 shadow-md border hover:cursor-pointer
				${
          variant === "primary.lighter"
            ? "bg-transparent text-primary border-primary"
            : ""
        }
				${
          variant === "primary.light"
            ? "bg-transparent text-primary-dark border-primary-dark"
            : ""
        }
				${
          variant === "primary.regular"
            ? "bg-primary text-white border-primary-dark"
            : ""
        }
				${
          variant === "primary.dark"
            ? "bg-primary-dark text-white border-primary-darker"
            : ""
        }
				${
          variant === "secondary.lighter"
            ? "bg-transparent text-secondary border-secondary"
            : ""
        }
				${
          variant === "secondary.light"
            ? "bg-transparent text-secondary-dark border-secondary-dark"
            : ""
        }
				${
          variant === "secondary.regular"
            ? "bg-secondary text-white border-secondary-dark"
            : ""
        }
				${
          variant === "secondary.dark"
            ? "bg-secondary-dark text-white border-secondary-dark"
            : ""
        }
				${
          variant === "tertiary.lighter"
            ? "bg-transparent text-tertiary border-tertiary"
            : ""
        }
				${
          variant === "tertiary.light"
            ? "bg-transparent text-tertiary-dark border-tertiary-dark"
            : ""
        }
				${
          variant === "tertiary.regular"
            ? "bg-tertiary text-white border-tertiary-dark"
            : ""
        }
				${
          variant === "tertiary.dark"
            ? "bg-tertiary-dark text-white border-tertiary-dark"
            : ""
        }
				${
          variant === "highlight.lighter"
            ? "bg-transparent text-highlight border-highlight"
            : ""
        }
				${
          variant === "highlight.light"
            ? "bg-transparent text-highlight-dark border-highlight-dark"
            : ""
        }
				${
          variant === "highlight.regular"
            ? "bg-highlight text-white border-highlight-dark"
            : ""
        }
				${
          variant === "highlight.dark"
            ? "bg-highlight-dark text-white border-highlight-darker"
            : ""
        }
				${
          variant === "gray.lighter"
            ? "bg-transparent text-gray-500 border-gray-500"
            : ""
        }
				${variant === "gray.light" ? "bg-gray-100 text-gray-600 border-gray-600" : ""}
				${variant === "gray.regular" ? "bg-gray-200 text-gray-700 border-gray-700" : ""}
				${variant === "gray.dark" ? "bg-gray-300 text-gray-800 border-gray-800" : ""}
				${className}
			`}
    >
      {isLoading ? (
        "Carregando..."
      ) : (
        <>
          {icon && icon}
          {children}
        </>
      )}
    </button>
  );
};
