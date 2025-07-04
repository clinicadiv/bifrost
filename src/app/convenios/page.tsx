"use client";

import { Button } from "@/components";
import { Info } from "@phosphor-icons/react";
import Image from "next/image";

const CONVENIOS = [
	{ id: 1, title: "PsicoCare", img: "/psicocare.png", accessMethod: "CPF" },
	{ id: 2, title: "GM Pharm", img: "/logo.png", accessMethod: "Código" },
	{ id: 3, title: "Comunidade Divergente", img: "/psicocare.png", accessMethod: "CPF" },
	{ id: 4, title: "Sinpro - Osasco", img: "/logo.png", accessMethod: "Código" },
	{ id: 5, title: "Sintricom", img: "/psicocare.png", accessMethod: "CPF" },
	{ id: 6, title: "PsicoCare", img: "/logo.png", accessMethod: "Código" },
	{ id: 7, title: "GM Pharm", img: "/psicocare.png", accessMethod: "CPF" },
];

export default function Convenios() {
  return (
    <div className="w-full flex flex-col gap-5">
			<h1 className="font-satoshi text-2xl font-semibold text-gray-700">Meus convênios</h1>

			<hr className="text-gray-300 block mb-2" />

			<div className="p-5 shadow-lg rounded-xl border border-gray-200 border-l-6 border-l-green-400 flex items-center gap-4">
				<div className="text-green-400 text-5xl">
					<Info weight="fill" />
				</div>

				<div className="flex flex-col gap-2">
					<h3 className="font-satoshi font-semibold text-lg">Como agendar sua consulta</h3>
					<p className="text-sm text-gray-500 font-medium">Selecione um convênio ou a opção de atendimento particular abaixo para agendar sua consulta.</p>
				</div>
			</div>

			<div className="grid grid-cols-5 gap-5 mt-4">
				{CONVENIOS.map((convenio) => (
					<div key={convenio.id} className="w-full flex flex-col items-center justify-center border border-gray-300 shadow-lg rounded-lg p-10">
						<div>
							<Image src={convenio.img} alt="" width={142} height={36} />
						</div>

						<div className="flex flex-col text-center">
							<div className="my-6 flex flex-col gap-2">
								<h3 className="text-gray-700 font-semibold font-satoshi text-lg">{convenio.title}</h3>
								<p className="text-gray-500 text-sm font-medium">Método de acesso: <span>{convenio.accessMethod}</span></p>
							</div>

							<Button variant="primary.regular">Agendar consulta</Button>
						</div>
					</div>
				))}
			</div>
    </div>
  );
}
