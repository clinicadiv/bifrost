"use client";

import { Bell, Sun } from "@phosphor-icons/react";

export const Header = () => {
	return (
		<header className="sticky top-0 w-full flex items-center justify-between px-10 py-5 border-b border-gray-300 bg-white z-20">
			<h1 className="uppercase font-medium font-satoshi text-gray-700">Dashboard</h1>

			<div className="flex items-center gap-5">
				<div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center shadow-xl">
					<Bell size={14} weight="duotone" />
				</div>

				<div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center shadow-xl">
					<Sun size={14} weight="duotone" />
				</div>

				<div className="w-10 h-10 rounded-full bg-div-green ml-5"></div>
			</div>
		</header>
	);
};
