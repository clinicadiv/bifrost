interface PageNumberProps {
	active: boolean;
	number: number | string;
	pageChangeHandler: (number: number) => void;
}

export function PageNumber({
	active,
	number,
	pageChangeHandler
}: PageNumberProps) {
	return (
		<a
			className={`
				relative
				inline-flex
				items-center
				${active
					? "z-10 border-indigo-500 bg-indigo-600 text-white"
					: "border-0 bg-white text-gray-500"
				}
				cursor-pointer
				px-4
				rounded
				py-1.5
				text-sm
				font-medium
				transition-all
				duration-300
			`}
			onClick={() => pageChangeHandler(+number)}
		>
			{number}
		</a>
	);
}
