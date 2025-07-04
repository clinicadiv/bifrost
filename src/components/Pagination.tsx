"use client";

import { PageNumber } from "@/components";
import { usePagination } from "@/hooks";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface PaginationProps {
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  perPage: number;
  pageChangeHandler: (page: number) => void;
  perPageChangeHandler: (newPerPage: number) => void;
}

export function Pagination({
  currentPage,
  perPage,
  siblingCount = 1,
  totalCount,
  pageChangeHandler,
  perPageChangeHandler,
}: PaginationProps) {
  const pagination = usePagination({
    currentPage: currentPage,
    pageSize: perPage,
    siblingCount: siblingCount,
    totalCount: totalCount,
  });

	const totalPages = Math.ceil(totalCount / perPage);

	// Verificar se está na primeira ou última página
	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === totalPages;

  return (
		<div className="sticky bottom-0 mx-3 flex flex-col gap-4 px-6 py-4 sm:flex-1 sm:items-center sm:justify-between lg:mx-0 lg:flex-row">
			<div className="flex flex-1 justify-between sm:hidden">
				<a
					className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
						isFirstPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
					}`}
					onClick={() => !isFirstPage && pageChangeHandler(currentPage - 1)}
				>
					Anterior
				</a>
				<a
					className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
						isLastPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
					}`}
					onClick={() => !isLastPage && pageChangeHandler(currentPage + 1)}
				>
					Próxima
				</a>
			</div>

			{/* Rows per page and pagination in fact */}
			<div className="hidden sm:flex sm:flex-col sm:items-center sm:justify-center sm:gap-4 lg:flex-row">
				<div>
					<nav
						className="relative z-0 inline-flex gap-2 -space-x-px rounded-md"
						aria-label="Pagination"
					>
						<a
							className={`relative inline-flex items-center rounded p-2 border border-gray-300 bg-white ${
								isFirstPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
							}`}
							onClick={() => !isFirstPage && pageChangeHandler(currentPage - 1)}
						>
							<span className="sr-only">Previous</span>
							<span>
								<CaretLeft size={20} color={isFirstPage ? "#CCCCCC" : "#545454"} weight="bold" />
							</span>
						</a>

						{pagination && pagination.map((pageNumber: number | string, index: number) => {
							if (pageNumber === "...") {
								return (
									<div
										key={pageNumber + index}
										className="flex h-[38px] w-[44px] items-center justify-center border border-gray-300"
									>
										...
									</div>
								);
							}

							return (
								<PageNumber
									key={pageNumber}
									number={pageNumber}
									active={currentPage === pageNumber}
									pageChangeHandler={pageChangeHandler}
								/>
							);
						})}

						<a
							className={`relative inline-flex items-center rounded p-2 border border-gray-300 bg-white ${
								isLastPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'
							}`}
							onClick={() => !isLastPage && pageChangeHandler(currentPage + 1)}
						>
							<span className="sr-only">Next</span>
							<span>
								<CaretRight size={20} color={isLastPage ? "#CCCCCC" : "#545454"} weight="bold" />
							</span>
						</a>
					</nav>
				</div>
			</div>
		</div>
	);
}
