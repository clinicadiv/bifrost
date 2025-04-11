import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	icon?: ReactNode;
	isLoading?: boolean;
	variant?: "primary" | "secondary" | "tertiary" | "highlight";
};

export const Button = ({
	children,
	icon,
	variant = "primary",
	className,
	isLoading = false,
	...props
}: ButtonProps) => {
	return (
		<button
			{...props}
			className={`
				flex items-center gap-2 rounded py-2.5 px-7 shadow-md border hover:cursor-pointer
				${variant === "primary" && "bg-[#1E1E1E] text-[#BCFF00] border-[#1E1E1E]"}
				${variant === "secondary" && "bg-[#FFFFFF] text-[#1E1E1E] border-[#1E1E1E]"}
				${variant === "tertiary" && "bg-[#1E1E1E] text-[#FFFFFF] border-[#FFFFFF]"}
				${className}
			`}
		>
			{isLoading ? "Carregando..." : (
				<>
					{icon && icon}
					{children}
				</>
			)}
		</button>
	);
};
