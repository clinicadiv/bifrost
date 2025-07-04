"use client";

import { Button, TableList, TableListProps } from "@/components";
import { Rating } from "@/types";
import { Download } from "@phosphor-icons/react";
import { useState } from "react";

export default function IndiceSaude() {
	const [ratings] = useState<Rating[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [total] = useState(10);

	const pageChangeHandler = (page: number) => {
		setCurrentPage(page);
	};

	const perPageChangeHandler = (newPerPage: number) => {
		setPerPage(newPerPage);
	};

	const tableProps: TableListProps<Rating> = {
		title: "",
		heading: [
			{
				id: "created_at",
				name: "Data"
			},
			{
				id: "general_index",
				name: "Índice geral"
			},
			{
				id: "depression",
				name: "Depressão"
			},
			{
				id: "anxiety",
				name: "Ansiedade"
			},
			{
				id: "stress",
				name: "Estresse"
			},
		],
		items: ratings,
		upButtons: <div className="flex items-center gap-5">
			<Button variant="primary.regular">
				<Download size={20} weight="bold" />
				Realizar teste DASS-21
			</Button>

			<Button variant="secondary.light">
				<Download size={20} weight="bold" />
				Exportar histórico
			</Button>
		</div>,
		paginationOptions: {
			total,
			perPage,
			currentPage,
			pageChangeHandler,
			perPageChangeHandler,
		},
	}

  return (
    <div className="w-full flex flex-col gap-5">
			<h1 className="font-satoshi text-2xl font-semibold text-gray-700">Índice de saúde mental!</h1>

			{/* <hr className="text-gray-300 block" /> */}

			<div className="my-4 w-full flex flex-col gap-5">
				<div className="border border-gray-200 border-l-6 border-l-indigo-500 rounded-xl min-h-40 w-full shadow-lg flex">
					<div className="flex-1 flex items-center p-10 w-fit">
						<span className="w-28 h-28 rounded-full bg-red-950 border border-amber-950 flex items-center justify-center text-gray-100 text-3xl font-satoshi font-bold">21</span>
					</div>

					<div className="w-full flex flex-col justify-center gap-2">
						<h2 className="text-2xl font-bold font-satoshi text-gray-700 uppercase">preocupante</h2>
						<p className="text-gray-600 text-sm">Os indicadores de saúde mental estão em níveis preocupantes. Necessita de atenção imediata e intervenções direcionadas.</p>
						<p className="text-gray-600 text-sm font-semibold">Última avaliação: <span className="ml-[31px]">24/03/2025 23:53</span></p>
						<p className="text-gray-600 text-sm font-semibold">Próxima avaliação: <span className="ml-5">Disponível agora</span></p>
					</div>
				</div>
			</div>

			<hr className="text-gray-300 block mb-2" />

			<h2 className="text-2xl text-gray-700 font-satoshi font-semibold">Métricas de saúde mental</h2>

			<div className="grid grid-cols-3 gap-10 pb-5">
				<div className="transition-all hover:-translate-y-2 p-10 rounded-lg border border-gray-200 shadow-lg flex flex-col gap-2.5">
					<h3 className="text-gray-700 font-satoshi font-bold text-lg">Depressão</h3>
					<p className="text-gray-500 text-sm">Avalia sentimentos como desânimo, falta de interesse e baixa autoestima.</p>
				</div>

				<div className="transition-all hover:-translate-y-2 p-10 rounded-lg border border-gray-200 shadow-lg flex flex-col gap-2.5">
					<h3 className="text-gray-700 font-satoshi font-bold text-lg">Ansiedade</h3>
					<p className="text-gray-500 text-sm">Avalia sensações de nervosismo, preocupação excessiva e reações físicas de ansiedade.</p>
				</div>

				<div className="transition-all hover:-translate-y-2 p-10 rounded-lg border border-gray-200 shadow-lg flex flex-col gap-2.5">
					<h3 className="text-gray-700 font-satoshi font-bold text-lg">Estresse</h3>
					<p className="text-gray-500 text-sm">Avalia irritabilidade, tensão e dificuldade em relaxar.</p>
				</div>
			</div>

			<hr className="text-gray-300 block mb-2" />

			<h2 className="text-2xl text-gray-700 font-satoshi font-semibold">Recomendações personalizadas</h2>

			<div className="transition-all hover:-translate-y-2 border border-gray-200 border-l-6 border-l-amber-500 rounded-xl min-h-40 w-full shadow-lg flex flex-col p-10 gap-4">
				<h3 className="text-2xl font-satoshi font-semibold text-gray-700">Estratégias para Depressão</h3>

				<p className="text-gray-500 text-sm">Sua pontuação de depressão está elevada. Considere implementar as seguintes estratégias:</p>

				<ul className="list-disc pl-5 flex flex-col gap-1 text-gray-600">
					<li>Pratique atividades que antes lhe traziam prazer, mesmo que inicialmente não sinta vontade</li>
					<li>Mantenha uma rotina regular de sono e alimentação</li>
					<li>Busque apoio de amigos e familiares</li>
					<li>Considere uma consulta com um profissional de saúde mental</li>
				</ul>
			</div>

			<div className="transition-all hover:-translate-y-2 border border-gray-200 border-l-6 border-l-amber-500 rounded-xl min-h-40 w-full shadow-lg flex flex-col p-10 gap-4">
				<h3 className="text-2xl font-satoshi font-semibold text-gray-700">Melhorando a Ansiedade</h3>

				<p className="text-gray-500 text-sm">Para reduzir sua ansiedade, considere:</p>

				<ul className="list-disc pl-5 flex flex-col gap-1 text-gray-600">
					<li>Praticar técnicas de respiração profunda por 5 minutos, 3 vezes ao dia</li>
					<li>Praticar mindfulness ou meditação guiada</li>
					<li>Manter um diário de pensamentos ansiosos</li>
					<li>Limitar o tempo de exposição a notícias e redes sociais</li>
					<li>Consultar um profissional para avaliar outras opções de tratamento</li>
				</ul>
			</div>

			<div className="transition-all hover:-translate-y-2 border border-gray-200 border-l-6 border-l-amber-500 rounded-xl min-h-40 w-full shadow-lg flex flex-col p-10 gap-4">
				<h3 className="text-2xl font-satoshi font-semibold text-gray-700">Estratégias para Estresse</h3>

				<p className="text-gray-500 text-sm">Sua pontuação de estresse está elevada. Considere implementar as seguintes estratégias:</p>

				<ul className="list-disc pl-5 flex flex-col gap-1 text-gray-600">
					<li>Reservar tempo para atividades relaxantes</li>
					<li>Reduzir o consumo de cafeína</li>
					<li>Estabelecer limites claros entre trabalho e vida pessoal</li>
					<li>Praticar atividade física moderada pelo menos 30 minutos por dia</li>
					<li>Adotar técnicas de gerenciamento de tempo e priorização de tarefas</li>
				</ul>
			</div>

			<hr className="text-gray-300 block mb-2" />

			<h2 className="text-2xl text-gray-700 font-satoshi font-semibold">Histórico de avaliações</h2>

			<div className="w-full">
				<TableList {...tableProps} />
			</div>
    </div>
  );
}
