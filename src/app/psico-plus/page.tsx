"use client";

import { CalendarCheck, Check, Crown, EnvelopeOpen, Gift, HourglassLow, Info, Monitor, Percent, Ticket } from "@phosphor-icons/react";
import { useState } from "react";

function HistoricoSelos() {
	return (
		<div className="flex items-center justify-center flex-col gap-5 p-10">
			<div className="text-6xl text-gray-400">
				<Ticket weight="fill" />
			</div>

			<h2 className="text-2xl text-gray-700 font-satoshi font-semibold">Nenhum selo acumulado ainda</h2>

			<p className="text-gray-500">Você ainda não acumulou selos. Os selos são adicionados automaticamente a cada atendimento realizado.</p>
		</div>
	);
}

function Resgates() {
	return (
		<div className="flex items-center justify-center flex-col gap-5 p-10">
			<div className="text-6xl text-gray-400">
				<Gift weight="fill" />
			</div>

			<h2 className="text-2xl text-gray-700 font-satoshi font-semibold">Nenhum resgate ainda</h2>

			<p className="text-gray-500">Você ainda não resgatou nenhum prêmio. Acumule 100 selos para resgatar 1 mês grátis de streaming.</p>
		</div>
	);
}

function Sobre() {
	return (
		<div className="flex justify-center flex-col gap-10 p-10">
			<div className="flex flex-col gap-3">
				<h2 className="text-2xl text-gray-700 font-satoshi font-bold">O que é o psico+</h2>
				<p className="text-gray-500">O Psico+ é um programa de fidelidade exclusivo para pacientes da Clínica Div, criado para recompensar sua confiança em nossos serviços.</p>
			</div>

			<div className="flex flex-col gap-5">
				<h2 className="text-2xl text-gray-700 font-satoshi font-bold">Como funciona?</h2>

				<div className="grid grid-cols-3 gap-10">
					<div className="flex gap-5">
						<div className="w-20 h-20 rounded-full bg-blue-500/25 text-blue-500 text-4xl flex items-center justify-center">
							<Ticket weight="fill" />
						</div>

						<div className="flex flex-col flex-1 gap-2">
							<h3 className="text-xl text-gray-700 font-semibold font-satoshi">Acúmulo de selos</h3>
							<p className="text-left text-gray-500 text-sm">Para cada R$ 1,00 gasto em consultas e serviços na Clínica Div, você acumula 1 selo automaticamente.</p>
						</div>
					</div>

					<div className="flex gap-5">
						<div className="w-20 h-20 rounded-full bg-blue-500/25 text-blue-500 text-4xl flex items-center justify-center">
							<Ticket weight="fill" />
						</div>

						<div className="flex flex-col flex-1 gap-2">
							<h3 className="text-xl text-gray-700 font-semibold font-satoshi">Acúmulo de selos</h3>
							<p className="text-left text-gray-500 text-sm">Para cada R$ 1,00 gasto em consultas e serviços na Clínica Div, você acumula 1 selo automaticamente.</p>
						</div>
					</div>

					<div className="flex gap-5">
						<div className="w-20 h-20 rounded-full bg-blue-500/25 text-blue-500 text-4xl flex items-center justify-center">
							<Ticket weight="fill" />
						</div>

						<div className="flex flex-col flex-1 gap-2">
							<h3 className="text-xl text-gray-700 font-semibold font-satoshi">Acúmulo de selos</h3>
							<p className="text-left text-gray-500 text-sm">Para cada R$ 1,00 gasto em consultas e serviços na Clínica Div, você acumula 1 selo automaticamente.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-5">
				<h2 className="text-2xl text-gray-700 font-satoshi font-bold">Vantagens do programa</h2>

				<div className="grid grid-cols-4 gap-10">
					<div className="flex gap-5 p-2.5 bg-gray-100 rounded-lg">
						<div className="text-green-600 text-lg flex pt-2.5 justify-center gap-5">
							<Check weight="bold" />

							<Monitor weight="fill" color="#2b7fff" size={28} className="-translate-y-1" />
						</div>

						<div className="flex flex-col flex-1 gap-1">
							<p className="text-left text-gray-500 text-sm">Serviço de streaming mensal gratuito (Netflix, Disney+ ou Prime Video)</p>
						</div>
					</div>

					<div className="flex gap-5 p-2.5 bg-gray-100 rounded-lg">
						<div className="text-green-600 text-lg flex pt-2.5 justify-center gap-5">
							<Check weight="bold" />

							<CalendarCheck weight="fill" color="#2b7fff" size={28} className="-translate-y-1" />
						</div>

						<div className="flex flex-col flex-1 gap-1">
							<p className="text-left text-gray-500 text-sm">Prioridade no agendamento de consultas</p>
						</div>
					</div>

					<div className="flex gap-5 p-2.5 bg-gray-100 rounded-lg">
						<div className="text-green-600 text-lg flex pt-2.5 justify-center gap-5">
							<Check weight="bold" />

							<Percent weight="bold" color="#2b7fff" size={28} className="-translate-y-1" />
						</div>

						<div className="flex flex-col flex-1 gap-1">
							<p className="text-left text-gray-500 text-sm">Descontos exclusivos em eventos e workshops da Clínica Div</p>
						</div>
					</div>

					<div className="flex gap-5 p-2.5 bg-gray-100 rounded-lg">
						<div className="text-green-600 text-lg flex pt-2.5 justify-center gap-5">
							<Check weight="bold" />

							<EnvelopeOpen weight="fill" color="#2b7fff" size={28} className="-translate-y-1" />
						</div>

						<div className="flex flex-col flex-1 gap-1">
							<p className="text-left text-gray-500 text-sm">Acesso antecipado a novidades e conteúdos exclusivos</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function PsicoPlus() {
	const [activeTab, setActiveTab] = useState<"historico" | "resgates" | "sobre">("historico");

  return (
    <div className="w-full flex flex-col gap-5">
			<h1 className="font-satoshi text-2xl font-semibold text-gray-700">Índice de saúde mental!</h1>

			<hr className="text-gray-300 block mb-2" />

			<div className="shadow-lg border border-gray-100 bg-white rounded-xl flex flex-col relative">
				<div className="absolute top-5 right-5 px-5 py-2.5 bg-emerald-600/25 border border-emerald-800 text-emerald-900 font-semibold text-sm rounded-full">Membro ativo</div>

				<div className="flex items-center gap-2 text-gray-700 font-satoshi uppercase font-bold text-2xl p-10 border-b border-gray-200">
					<div className="text-5xl text-amber-500">
						<Crown weight="fill" />
					</div>
					psico+
				</div>

				<div className="p-10 flex gap-10 border-b border-gray-200">
					<div className="flex flex-col gap-2.5">
						<div className="px-10 py-5 flex items-center justify-center bg-blue-500 rounded-xl font-satoshi text-white font-bold text-4xl">10</div>

						<p className="text-gray-500 text-sm">Selos acumulados</p>
					</div>

					<div className="w-max flex flex-1 flex-col gap-5 justify-center">
						<div>
							<span className="block w-full h-2.5 rounded-2xl bg-gray-300">
								<span className="block w-1/12 h-full rounded-2xl bg-blue-500"></span>
							</span>
						</div>

						<p className="text-sm flex items-center gap-1.5 text-amber-600">
							<HourglassLow weight="fill" />

							Faltam <span className="font-semibold"> 90 selos </span> para você resgatar seu prêmio!
						</p>

						<p className="text-sm flex items-center gap-1.5 text-gray-500">
							<Info weight="fill" />

							Cada R$ 100,00 gastos em consultas = 1 selo
						</p>
					</div>
				</div>

				<div className="p-10 flex flex-col gap-5">
					<div className="flex items-center gap-2.5">
						<div
							className={`transition-all px-5 py-2.5 rounded font-medium cursor-pointer ${activeTab === "historico" ? "bg-blue-500 text-white" : "bg-transparent text-gray-600 hover:bg-gray-200"}`}
							onClick={() => setActiveTab("historico")}
						>
							Histórico de selos
						</div>

						<div
							className={`transition-all px-5 py-2.5 rounded font-medium cursor-pointer ${activeTab === "resgates" ? "bg-blue-500 text-white" : "bg-transparent text-gray-600 hover:bg-gray-200"}`}
							onClick={() => setActiveTab("resgates")}
						>
							Resgates
						</div>

						<div
							className={`transition-all px-5 py-2.5 rounded font-medium cursor-pointer ${activeTab === "sobre" ? "bg-blue-500 text-white" : "bg-transparent text-gray-600 hover:bg-gray-200"}`}
							onClick={() => setActiveTab("sobre")}
						>
							Sobre o programa
						</div>
					</div>

					<hr className="text-gray-300 block mb-2" />

					<div className="bg-gray-50 rounded-xl">
						{activeTab === "historico" && <HistoricoSelos />}
						{activeTab === "resgates" && <Resgates />}
						{activeTab === "sobre" && <Sobre />}
					</div>
				</div>
			</div>
    </div>
  );
}
