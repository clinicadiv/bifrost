"use client";

import { Button } from "@/components";
import { formatDate } from "@/utils";
import { minuteToHour } from "@/utils/minuteToHour";
import { Clock, CurrencyDollar, Link as IconLink, User } from "@phosphor-icons/react";
import Link from "next/link";

const CONSULTAS = [
	{
		id: 1,
		date: "2025-05-05 14:00:00.000",
		doctor: "Guilherme Oliveira",
		amount: 100,
		duration: 90,
		url: "https://google.com.br/",
		type: 1
	},
	{
		id: 2,
		date: "2025-06-05 14:00:00.000",
		doctor: "Guilherme Oliveira",
		amount: 80,
		duration: 60,
		url: "https://google.com.br/",
		type: 2
	},
	{
		id: 3,
		date: "2025-07-05 14:00:00.000",
		doctor: "Guilherme Oliveira",
		amount: 75,
		duration: 30,
		url: "https://google.com.br/",
		type: 1
	},
	{
		id: 4,
		date: "2025-08-05 14:00:00.000",
		doctor: "Guilherme Oliveira",
		amount: 150,
		duration: 60,
		url: "https://google.com.br/",
		type: 2
	},
	{
		id: 5,
		date: "2025-05-05 14:00:00.000",
		doctor: "Guilherme Oliveira",
		amount: 100,
		duration: 90,
		url: "https://google.com.br/",
		type: 1
	},
];

export default function Consultas() {
  return (
    <div className="w-full flex flex-col gap-5">
			<div className="w-full flex items-center justify-between">
				<h1 className="font-satoshi text-2xl font-semibold text-gray-700">Minhas consultas</h1>

				<Button>Agendar nova consulta</Button>
			</div>

			<hr className="text-gray-300 block mb-2" />

			<div className="grid grid-cols-4 gap-10">
				{CONSULTAS.map((consulta) => {
					const { dia, horario, nomeMes } = formatDate(consulta.date);

					return (
						<div key={consulta.id} className="shadow-xl rounded-lg border border-gray-200 flex flex-col">
							<div className="border-b border-gray-200 p-4 font-satoshi font-medium text-center text-gray-700">Consulta {consulta.type === 1 ? "psicologica" : "psiquiátrica"}</div>

							<div className="border-b border-gray-200 p-5 flex flex-col gap-2">
								<p className="font-satoshi text-4xl text-center text-gray-700">
									{dia}/{nomeMes}
								</p>

								<p className="font-satoshi text-4xl text-center text-gray-700">
									{horario}
								</p>
							</div>

							<div className="border-b border-gray-200 py-2.5 px-4 flex flex-col gap-1.5">
								<p className="flex items-center text-gray-500 font-medium text-sm gap-1.5">
									<span className="text-secondary">
										<User size={14} weight="bold" />
									</span>

									Psicologo: <span className="font-semibold">{consulta.doctor}</span>
								</p>

								<p className="flex items-center text-gray-500 font-medium text-sm gap-1.5">
									<span className="text-highlight-dark">
										<Clock size={14} weight="bold" />
									</span>

									Duração: <span className="font-semibold">{minuteToHour(consulta.duration)}h</span>
								</p>

								<p className="flex items-center text-gray-500 font-medium text-sm gap-1.5">
									<span className="text-primary">
										<CurrencyDollar size={14} weight="bold" />
									</span>

									Valor:
									<span className="font-semibold">
										{new Intl.NumberFormat('pt-BR', {
											style: 'currency',
											currency: 'BRL',
											minimumFractionDigits: 2,
											maximumFractionDigits: 2
										}).format(consulta.amount)}
									</span>
								</p>
							</div>

							<div className="py-4">
								<p className="flex items-end justify-end text-gray-500 font-medium text-sm px-5">
									<span className="text-blue-500">
										<IconLink size={16} />
									</span>

									<Link className="ml-1 text-blue-500 transition-all cursor-pointer border-b border-transparent hover:border-blue-500" href={consulta.url} target="_blank">Link google meet</Link>
								</p>
							</div>
						</div>
					);
				})}
			</div>
    </div>
  );
}
