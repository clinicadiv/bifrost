import { Header, Sidebar } from "@/components";

export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-screen h-screen">
			<div className="w-full h-full grid grid-cols-[auto_1fr]">
				<Sidebar />

				<div className="w-full h-full flex flex-col">
					<Header />

					<div className="p-10 flex flex-1">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
};
