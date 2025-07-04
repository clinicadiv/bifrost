"use client";

import { Button, TableList, TableListProps } from "@/components";
import { MedicalRecord } from "@/types";
import { useState } from "react";

export default function Prontuarios() {
	const [medicalRecords] = useState<MedicalRecord[]>([]);

	const tableProps: TableListProps<MedicalRecord> = {
		title: "",
		heading: [
			{
				id: "created_at",
				name: "Data"
			},
			{
				id: "professional",
				name: "Profissional"
			},
			{
				id: "type",
				name: "Tipo"
			},
			{
				id: "description",
				name: "Ansiedade"
			},
			{
				id: "id",
				name: "Ações",
				render: () => (
					<div>
						<Button>Ver</Button>
					</div>
				)
			},
		],
		items: medicalRecords,
	}

  return (
    <div className="w-full flex flex-col gap-5">
			<h1 className="font-satoshi text-2xl font-semibold text-gray-700">Meus prontuários</h1>

			<hr className="text-gray-300 block mb-2" />

			<div>
				<TableList {...tableProps} />
			</div>
    </div>
  );
}
