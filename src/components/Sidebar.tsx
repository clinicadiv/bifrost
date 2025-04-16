"use client";

import { Brain, BuildingOffice, CalendarDots, DoorOpen, FilePlus, Gear, Medal, SquaresFour, UsersThree } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./Button";

const LINKS = [
	{ id: 1, Icon: SquaresFour, title: "Dashboard", href: "/" },
	{ id: 2, Icon: CalendarDots, title: "Consultas", href: "/consultas" },
	{ id: 3, Icon: Brain, title: "Índice saúde mental", href: "/indice-saude" },
	{ id: 4, Icon: Medal, title: "Psico+", href: "/psico-plus" },
	{ id: 5, Icon: BuildingOffice, title: "Convênios", href: "/convenios" },
	{ id: 6, Icon: UsersThree, title: "Dependentes", href: "/dependentes" },
	{ id: 7, Icon: FilePlus, title: "Prontuários", href: "/prontuarios" },
];

export const Sidebar = () => {
	const pathname = usePathname();

	return (
		<div className="relative min-w-72 max-h-screen py-5 flex flex-col gap-10 h-full bg-black/90">
			<div className="px-5 flex items-center justify-center">
				<Image src="/logo.png" alt="" width={142} height={36} className="invert translate-y-2.5" />
			</div>

			<div className="px-5">
				<Button variant="primary" className="w-full flex items-center justify-center py-2.5 bg-div-green text-neutral-800 rounded border-div-green-darker">Agendar consulta</Button>
			</div>

			<nav className="flex flex-col gap-4 flex-1 w-full font-satoshi overflow-y-auto">
				<h2 className="uppercase text-gray-400 font-semibold ml-6 text-sm">Geral</h2>

				<ul className="flex flex-col items-start gap-2.5 mb-5 w-full font-medium">
					{LINKS.map((link) => (
						<li key={link.id} className="px-5 relative bg-transparent hover:text-div-green cursor-pointer transition-all duration-200 ease-in-out rounded w-full flex items-center gap-3">
							{pathname === link.href && (
								<div className="absolute left-0 w-1.5 h-full rounded-r-xl bg-div-green"></div>
							)}

							<Link href={link.href} className={`w-full py-2.5 flex items-center gap-3 hover:text-div-green transition-all ease-in-out ${pathname === link.href ? "text-div-green" : "text-gray-300"}`}>
								<link.Icon size={20} weight="bold" />
								{link.title}
							</Link>
						</li>
					))}
				</ul>

				<h2 className="uppercase text-gray-400 font-semibold ml-6 text-sm">Conta</h2>

				<ul className="flex flex-col items-start gap-2.5 w-full font-medium">
					<li className="px-5 relative bg-transparent hover:text-div-green cursor-pointer transition-all duration-200 ease-in-out text-gray-300 p-2 py-2.5 rounded w-full flex items-center gap-3">
						<Gear size={20} weight="bold" />
						Configurações
					</li>

					<li className="px-5 relative bg-transparent hover:text-div-green cursor-pointer transition-all duration-200 ease-in-out text-gray-300 p-2 py-2.5 rounded w-full flex items-center gap-3">
						<DoorOpen size={20} weight="bold" />
						Desconectar
					</li>
				</ul>
			</nav>

			<div className="text-sm text-gray-300 flex flex-col gap-2 items-center justify-center">
				<span>© 2025 Clinica Div LTDA.</span>
				<span className="italic">Created with ❤️ by Clinica Div!</span>
			</div>
		</div>
	);
};
