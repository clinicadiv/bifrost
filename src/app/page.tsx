"use client";

import { Button } from "@/components";
import { Calendar, CalendarPlus } from "@phosphor-icons/react";

export default function Home() {
  return (
    <div className="w-full h-full border-red-600 flex flex-col gap-5">
			<h1 className="font-satoshi text-2xl font-medium text-gray-800">Bem vindo de volta, Matheus!</h1>

			<div className="grid grid-cols-3 gap-5">
				<div className="w-full shadow-lg rounded-xl border border-gray-200 col-start-1 col-end-3">
					<div className="border-b border-gray-200 p-5">
						<h2 className="font-satoshi text-2xl font-bold text-gray-700">Índice de Saúde Mental</h2>
					</div>

					<div className="flex w-full">
						<div className="flex flex-col items-center justify-center gap-5 border-r border-gray-200 px-10 py-8">
							<div className="w-32 h-32 rounded-full shadow bg-amber-400 flex items-center justify-center">
								<p className="font-satoshi font-bold text-4xl text-gray-200">12</p>
							</div>

							<div className="flex flex-col items-center justify-center gap-2.5">
								<p className="text-center text-sm text-gray-500">Seu nível atual</p>
								<p className="text-center font-satoshi text-xl font-semibold text-gray-700">Moderado</p>
								<p className="text-center text-xs text-gray-500">Última avaliação: 24/03/2025 23:53</p>
							</div>
						</div>

						<div className="flex-1 flex flex-col items-center justify-center">
							<div className="w-full py-5 px-7 flex flex-col gap-2.5">
								<div className="flex item-center justify-between">
									<div>
										<span className="font-semibold font-satoshi text-gray-700">Depressão</span>
									</div>

									<div className="flex items-center gap-4">
										<span className="font-semibold font-satoshi text-gray-700">5</span>
										<span className="text-sm text-gray-600 font-medium">Leve</span>
									</div>
								</div>

								<div>
									<span className="block w-full h-2.5 rounded-2xl bg-gray-300">
										<span className="block w-2/12 h-full rounded-2xl bg-indigo-700"></span>
									</span>
								</div>
							</div>

							<div className="w-full py-5 px-7 flex flex-col gap-2.5">
								<div className="flex item-center justify-between">
									<div>
										<span className="font-semibold font-satoshi text-gray-700">Ansiedade</span>
									</div>

									<div className="flex items-center gap-4">
										<span className="font-semibold font-satoshi text-gray-700">12</span>
										<span className="text-sm text-gray-600 font-medium">Moderado</span>
									</div>
								</div>

								<div>
									<span className="block w-full h-2.5 rounded-2xl bg-gray-300">
										<span className="block w-6/12 h-full rounded-2xl bg-teal-400"></span>
									</span>
								</div>
							</div>

							<div className="w-full py-5 px-7 flex flex-col gap-2.5">
								<div className="flex item-center justify-between">
									<div>
										<span className="font-semibold font-satoshi text-gray-700">Estresse</span>
									</div>

									<div className="flex items-center gap-4">
										<span className="font-semibold font-satoshi text-gray-700">21</span>
										<span className="text-sm text-gray-600 font-medium">Muito severo</span>
									</div>
								</div>

								<div>
									<span className="block w-full h-2.5 rounded-2xl bg-gray-300">
										<span className="block w-full h-full rounded-2xl bg-red-400"></span>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="w-full flex-1 flex flex-col shadow-lg rounded-xl border border-gray-200">
					<div className="border-b border-gray-200 p-5">
						<h2 className="font-satoshi text-2xl font-bold text-gray-700">Próxima consulta</h2>
					</div>

					<div className="flex flex-1 p-5 gap-5 relative">
						<div className="flex h-fit gap-5">
							<div className="absolute top-5 right-5 rounded-full bg-green-400/25 text-green-600 font-satoshi font-medium border border-green-300 shadow flex items-center gap-2 text-sm py-0.5 px-2.5">
								<span className="block w-2 h-2 rounded-full bg-green-600"></span>
								<p>Aprovado</p>
							</div>

							<div className="flex items-center justify-center rounded-xl bg-indigo-600 flex-col gap-2.5 text-white min-w-32 min-h-32">
								<span className="font-satoshi uppercase font-bold text-2xl">08</span>
								<span className="font-satoshi uppercase">Maio</span>
							</div>

							<div className="flex-1 flex flex-col justify-between">
								<p className="text-lg font-semibold font-satoshi text-gray-700">Consulta Psicologica</p>
								<p className="text-sm text-gray-500">Doutor: Guilherme Oliveira</p>
								<p className="text-sm text-gray-500">Horário: 19:00 - 20:00</p>

								<span className="text-sm hover:underline text-indigo-600 font-satoshi cursor-pointer">Ver detalhes</span>
							</div>
						</div>
					</div>

					<div className="flex justify-between gap-5 p-5">
						<Button className="flex items-center justify-center bg-indigo-500 text-white font-satoshi font-medium border-indigo-700">
							<Calendar size={18} weight="bold" />
							Reagendar consulta
						</Button>

						<Button className="flex items-center justify-center bg-div-green text-gray-700 font-satoshi font-medium border-div-green-darker">
							<CalendarPlus size={18} weight="bold" />
							Nova consulta
						</Button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-5">
				<div className="w-full shadow-lg rounded-xl border border-gray-200 min-h-80">
					<div className="border-b border-gray-200 p-5">
						<h2 className="font-satoshi text-2xl font-bold text-gray-700">Resumo de Consultas</h2>
					</div>
				</div>

				<div className="w-full shadow-lg rounded-xl border border-gray-200 min-h-80">
					<div className="border-b border-gray-200 p-5">
						<h2 className="font-satoshi text-2xl font-bold text-gray-700">Meus Convênios</h2>
					</div>
				</div>
			</div>

			<div className="grid gap-5">
				<div className="w-full shadow-lg rounded-xl border border-gray-200 min-h-80">
					<div className="border-b border-gray-200 p-5">
						<h2 className="font-satoshi text-2xl font-bold text-gray-700">Seu Psico+</h2>
					</div>
				</div>
			</div>
    </div>
  );
}
