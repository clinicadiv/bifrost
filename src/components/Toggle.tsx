/* This example requires Tailwind CSS v2.0+ */
"use client";
import { useState } from "react";

import { Switch } from "@headlessui/react";
import { Path, UseFormSetValue } from "react-hook-form";

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

interface ToggleProps {
	path: Path<any>;
	setValue: UseFormSetValue<any>;
	label?: string;
	subLabel?: string;
	onChange?: () => void;
	defaultValue?: boolean;
}

export const Toggle = ({
	path,
	setValue,
	label,
	subLabel,
	onChange,
	defaultValue = false,
}: ToggleProps) => {
	const [enabled, setEnabled] = useState(defaultValue);

	return (
		<Switch.Group
			as="div"
			className="flex items-center"
		>
			<Switch
				checked={enabled}
				onChange={() => {
					setEnabled(!enabled);
					setValue(path, !enabled);

					if (onChange) {
						onChange();
					}
				}}
				className={classNames(
					enabled
						? "bg-div-green"
						: "bg-neutral-200",
					"relative inline-flex shadow-sm shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-hidden"
				)}
			>
				<span className="sr-only">Use setting</span>
				<span
					className={classNames(
						enabled
							? "translate-x-5 bg-white"
							: "translate-x-0 bg-div-green",
						"pointer-events-none relative inline-block h-5 w-5 rounded-full shadow-sm transform ring-0 transition ease-in-out duration-200"
					)}
				>
					<span
						className={classNames(
							enabled
								? "opacity-0 ease-out duration-100"
								: "opacity-100 ease-in duration-200",
							"absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
						)}
						aria-hidden="true"
					>
						<svg
							className="h-4 w-4 text-white"
							fill="none"
							viewBox="0 0 12 12"
						>
							<path
								d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</span>
					<span
						className={classNames(
							enabled
								? "opacity-100 ease-in duration-200"
								: "opacity-0 ease-out duration-100",
							"absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
						)}
						aria-hidden="true"
					>
						<svg
							className="h-4 w-4 text-div-green"
							fill="currentColor"
							viewBox="0 0 12 12"
						>
							<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
						</svg>
					</span>
				</span>
			</Switch>
			<Switch.Label
				as="span"
				className="ml-3 hover:cursor-default"
			>
				{label && (
					<span className="text-sm font-medium text-gray-900">
						{label}
					</span>
				)}
				<br />
				{subLabel && <span className="text-sm text-gray-500">{subLabel}</span>}
			</Switch.Label>
		</Switch.Group>
	);
}
