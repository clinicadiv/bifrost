"use client";

import { Button } from "@/components";
import { Cake, Dot, EnvelopeSimple, IdentificationCard, Info, PaperPlaneTilt, Pen, Trash, User, UserPlus } from "@phosphor-icons/react";

export default function Dependentes() {
  return (
    <div className="w-full flex flex-col gap-5">
			<h1 className="font-satoshi text-2xl font-semibold text-gray-700">Meus dependentes</h1>

			<hr className="text-gray-300 block mb-2" />

			<div className="p-5 shadow-lg rounded-xl border border-gray-200 border-l-6 border-l-green-400 flex items-center gap-4">
				<div className="text-green-400 text-5xl">
					<Info weight="fill" />
				</div>

				<div className="flex flex-col gap-2">
					<h3 className="font-satoshi font-semibold text-lg">Gerenciamento de dependentes</h3>
					<p className="text-sm text-gray-500 font-medium">Adicione seus dependentes para facilitar o agendamento de consultas para toda sua família. Seus convênios ativos podem ser utilizados para seus dependentes.</p>
				</div>
			</div>

			<div className="flex items-end justify-end my-5">
				<Button variant="primary.regular">
					<UserPlus weight="fill" size={24} />

					Adicionar dependente
				</Button>
			</div>

			<div>
				<div className="w-fit min-w-80 shadow-lg rounded-lg border border-gray-200">
					<div className="p-7 border-b border-gray-200 flex gap-4">
						<div className="rounded-full w-16 h-16 flex items-center justify-center bg-emerald-500 text-white text-3xl border border-emerald-700 shadow shadow-emerald-700">
							<User weight="duotone" />
						</div>

						<div className="flex flex-col gap-2">
							<h3 className="font-satoshi font-semibold text-lg text-gray-700">Matheus Antunes Melo</h3>
							<span className="block rounded border border-gray-200 bg-gray-200/50 text-gray-500 text-sm w-fit px-2 py-1">Outro</span>
						</div>
					</div>

					<div className="p-7 border-b border-gray-200 flex flex-col gap-2.5">
						<div className="flex items-center gap-2">
							<div className="text-blue-500 text-lg">
								<Cake weight="fill" />
							</div>

							<p className="text-gray-500 font-medium text-sm">17/03/1999 (26 anos)</p>
						</div>

						<div className="flex items-center gap-2">
							<div className="text-blue-500 text-lg">
								<IdentificationCard weight="fill" />
							</div>

							<p className="text-gray-500 font-medium text-sm">111.337.129-32</p>
						</div>

						<div className="flex items-center gap-2">
							<div className="text-blue-500 text-lg">
								<EnvelopeSimple weight="fill" />
							</div>

							<p className="text-gray-500 font-medium text-sm">matheusantmelo@gmail.com</p>
						</div>
					</div>

					<div className="p-7 border-b border-gray-200">
						<div className="flex items-center gap-2">
							<div className="text-amber-500 text-lg">
								<Dot weight="fill" />
							</div>

							<p className="text-gray-500 font-medium text-sm">Status: <span className="font-semibold">Pendente</span></p>
						</div>
					</div>

					<div className="p-7 flex items-center justify-between gap-4">
						<Button variant="secondary.regular">
							<Pen weight="fill" />

							Editar
						</Button>

						<Button variant="tertiary.regular">
							<Trash weight="fill" />

							Excluir
						</Button>

						<Button variant="highlight.dark">
							<PaperPlaneTilt weight="fill" />

							Reenviar
						</Button>
					</div>
				</div>
			</div>
    </div>
  );
}
