"use client";

import {
	Dispatch,
	ReactNode,
	SetStateAction,
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";

import { Pagination } from "@/components";
import { CaretDown, DotsThree } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";

type HeaderTableProps<T> = {
  id: keyof T;
  name: string;
  render?: (index: T) => ReactNode;
};

interface ActionItem<T> {
  label: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  render?: (item: T) => ReactNode;
}

export interface TableListProps<T> {
  heading: HeaderTableProps<T>[];
  items: T[];
  onDoubleClick?: (index: T) => void;
  actions?: ActionItem<T>[];
	title: string;
  actionsDropdown?: {
    useDropdown: boolean;
    buttonIcon?: ReactNode;
    dropdownTitle?: string;
  };
  actionButton?: {
    label?: string;
    button: (index: T) => ReactNode;
  };
  checkbox?: {
    is: boolean;
    id?: keyof T;
    selectedRows: number[];
    setSelectedRows?: Dispatch<SetStateAction<number[]>>;
    isAllChecked: boolean;
    setIsAllChecked?: Dispatch<SetStateAction<boolean>>;
  };
  paginationOptions?: {
    currentPage: number;
    perPage: number;
    total: number;
    pageChangeHandler: (page: number) => void;
    perPageChangeHandler: (newPerPage: number) => void;
  };
  upButtons?: ReactNode;
  classNameTableContainer?: string;
}

export const TableList = <T,>({
  heading,
  items,
  actionButton,
  actions,
  actionsDropdown = { useDropdown: true },
  checkbox = {
    is: false,
    selectedRows: [],
    isAllChecked: false,
  },
  paginationOptions,
  classNameTableContainer = "",
  onDoubleClick,
  upButtons,
	title
}: TableListProps<T>) => {
  const ref = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
	const actionButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  const {
    selectedRows,
    id,
    is,
    isAllChecked,
    setSelectedRows,
    setIsAllChecked,
  } = checkbox;

  function toggleAll() {
    setSelectedRows!(checked || indeterminate ? [] : selectedRows);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
    setIsAllChecked!(!isAllChecked);

    if (!isAllChecked) {
      items.map((item) =>
        setSelectedRows!((oldState) => [...oldState, Number(item[id!])])
      );
    }
  }

  useLayoutEffect(() => {
    if (is) {
      const isIndeterminate =
        selectedRows.length > 0 && selectedRows.length < items.length;
      setChecked(selectedRows.length === items.length);
      setIndeterminate(isIndeterminate);
      ref.current!.indeterminate = isIndeterminate;

      if (selectedRows.length < items.length) {
        setIsAllChecked!(false);
      }

      if (selectedRows.length === items.length) {
        setIsAllChecked!(true);
      }
    }
  }, [selectedRows]);

	const handleClickOutside = useCallback((event: MouseEvent) => {
		const dropdownTriggerButtons = actionButtonRefs.current;
		const dropdownMenus = document.querySelectorAll('.dropdown-menu');

		const isClickInsideDropdown = Array.from(dropdownMenus).some(menu =>
			menu.contains(event.target as Node)
		);

		const isClickOnTriggerButton = dropdownTriggerButtons.some(button =>
			button && button.contains(event.target as Node)
		);

		if (!isClickInsideDropdown && !isClickOnTriggerButton) {
			setOpenDropdownIndex(null);
		}
	}, []);

	useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const calculateDropdownPosition = useCallback((index: number) => {
    const button = actionButtonRefs.current[index];
    if (button) {
      const buttonRect = button.getBoundingClientRect();
      return {
        top: buttonRect.bottom + window.scrollY + 5,
        left: buttonRect.left + window.scrollX - 120,
      };
    }
    return { top: 0, left: 0 };
  }, []);

	const toggleDropdown = useCallback((index: number) => {
    setOpenDropdownIndex(current => current === index ? null : index);
  }, []);

  const renderActions = (item: T, index: number) => {
    if (!actions || actions.length === 0) {
      return actionButton?.button && actionButton.button(item);
    }

    if (!actionsDropdown.useDropdown) {
      return (
        <div className="flex items-center space-x-2">
          {actions.map((action, actionIndex) => (
            <button
              key={`action-${actionIndex}`}
              onClick={() => action.onClick(item)}
              className="p-1 rounded-sm hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              title={action.label}
            >
              {action.render ? (
                action.render(item)
              ) : (
                <div className="flex items-center">
                  {action.icon && <span className="mr-1">{action.icon}</span>}
                  <span className="text-xs">{action.label}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      );
    }

		const isDropdownOpen = openDropdownIndex === index;
    const dropdownPosition = calculateDropdownPosition(index);

    return (
      <div className="relative">
        <button
          ref={(el) => {
            actionButtonRefs.current[index] = el;
          }}
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(index);
          }}
          className="p-1 rounded-sm hover:bg-gray-100 text-gray-600 hover:text-gray-900"
        >
          {actionsDropdown.buttonIcon || <DotsThree weight="bold" size={20} />}
        </button>

        {isDropdownOpen && createPortal(
          <AnimatePresence mode="wait">
            <motion.div
              key={`dropdown-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "tween",
                duration: 0.1
              }}
              className="dropdown-menu fixed z-50 w-48 origin-top-right rounded-md bg-white shadow-xs ring-1 ring-gray-500 ring-opacity-5 focus:outline-hidden"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {actionsDropdown.dropdownTitle && (
                <div className="px-4 py-2 text-xs font-medium text-gray-700 border-b">
                  {actionsDropdown.dropdownTitle}
                </div>
              )}
              <div className="py-1">
                {actions.map((action, actionIndex) => (
                  <div
                    key={`dropdown-action-${actionIndex}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      action.onClick(item);
                      toggleDropdown(index);
                    }}
                  >
                    {action.render ? (
                      action.render(item)
                    ) : (
                      <div className="flex items-center">
                        {action.icon && (
                          <span className="mr-2">{action.icon}</span>
                        )}
                        <span>{action.label}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
      </div>
    );
  };

  return (
    <div className="">
			<div className="px-5 flex items-center justify-between">
				<div>
					<h1 className="font-sagace text-xl text-div-black/80 font-medium">{title}</h1>
				</div>

				<div className="flex items-center gap-5">
					{upButtons && upButtons}

					{paginationOptions && (
						<Pagination
							totalCount={paginationOptions.total}
							{...paginationOptions}
						/>
					)}
				</div>
			</div>

      <div className="flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div
              className={`relative overflow-hidden overflow-y-auto lg:shadow-sm ${classNameTableContainer}`}
            >
              <table className="min-w-full overflow-auto border-separate border-spacing-3 divide-y divide-gray-300 lg:border-collapse">
                <thead className="hidden sticky z-10 top-0 bg-gray-50 lg:table-header-group">
                  <tr className="bg-div-gray/10">
                    {is && (
                      <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          ref={ref}
                          checked={checked}
                          onChange={toggleAll}
                        />
                      </th>
                    )}
                    {heading.map((head, index) => (
                      <td
                        key={String(head.id)}
                        scope="col"
                        className={`
													${index !== 0 && "hidden"}
													py-3
													pl-4
													pr-3
													text-left
													text-xs
													font-bold
													uppercase
													tracking-wide
													text-gray-500
													sm:pl-6
													${index !== 0 && "lg:table-cell"}
												`}
                      >
                        {head.name}
                      </td>
                    ))}

                    {((actions && actions?.length > 0) || actionButton?.button) && (
                      <th
                        key="actions"
                        scope="col"
                        className="w-[125px] py-3 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-gray-500 sm:pl-6"
                      >
                        {(actions && actions?.length > 0) ? "Ações" : actionButton?.label}
                      </th>
                    )}

                    <th
                      scope="col"
                      className="hidden w-[125px] py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:pl-6"
                    ></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white h-10 overflow-y-scroll">
                  {items &&
                    items?.map((item, index) => (
                      <tr
                        key={`table-row-${index}`}
                        className="relative shadow-sm even:bg-gray-50 lg:shadow-none"
                        onDoubleClick={() => {
                          if (onDoubleClick) {
                            onDoubleClick(item);
                          }
                        }}
                      >
                        {is && (
                          <td className="relative px-7 sm:w-12 sm:px-6">
                            {selectedRows.includes(Number(item[id!])) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              checked={selectedRows.includes(Number(item[id!]))}
                              onChange={(e) => {
                                setSelectedRows!(
                                  e.target.checked
                                    ? [...selectedRows, Number(item[id!])]
                                    : selectedRows.filter(
                                        (p) => p !== Number(item[id!])
                                      )
                                );
                              }}
                            />
                          </td>
                        )}

                        {heading.map((head, headIndex) => (
                          <td
                            key={`${String(head.id)}${headIndex}`}
                            className={`
														${headIndex !== 0 && "hidden"}
														py-3
														pl-4
														pr-3
														text-sm
														font-medium
														text-gray-500
														sm:pl-6
														${headIndex !== 0 && "lg:table-cell"}
													`}
                          >
                            <input
                              type="checkbox"
                              className="peer absolute inset-x-0 top-0 z-10 h-12 w-full cursor-pointer opacity-0 lg:hidden"
                            />

                            <div className="flex justify-between">
                              {head.render
                                ? head.render(item)
                                : String(item[head.id])}
                            </div>

                            <div className="absolute top-3 right-3 rotate-0 transition-transform duration-500 peer-checked:rotate-180 lg:hidden">
                              <CaretDown
                                size={24}
                                color="#545454"
                                weight="fill"
                              />
                            </div>

                            <div
                              className="
															relative
															max-h-0
															overflow-hidden
															transition-all
															duration-500
															ease-in-out
															peer-checked:max-h-screen
														"
                            >
                              <div
                                className="
																grid
																grid-cols-1
																gap-4
																pt-4
																pb-2
																sm:grid-cols-2
																md:grid-cols-3
																lg:hidden
															"
                              >
                                {heading.map(
                                  (head, idx) =>
                                    idx > 0 && (
                                      <div
                                        key={String(head.id)}
                                        className="flex flex-col"
                                      >
                                        <label className="font-semibold">
                                          {head.name}
                                        </label>
                                        <label className="font-normal">
                                          {head.render
                                            ? head.render(item)
                                            : String(item[head.id])}
                                        </label>
                                      </div>
                                    )
                                )}

                                {/* Renderização das actions no mobile */}
                                {((actions && actions?.length > 0) || actionButton?.button) && (
                                  <div className="flex flex-col">
                                    <label className="font-semibold">
                                      {(actions && actions?.length > 0) ? "Ações" : actionButton?.label}
                                    </label>
                                    <div>{renderActions(item, index)}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        ))}

                        {/* Renderização das actions no desktop */}
                        {((actions && actions?.length > 0) || actionButton?.button) && (
                          <td
                            width="10%"
                            className="hidden w-[125px] py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:table-cell"
                          >
                            {renderActions(item, index)}
                          </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>

              {items.length === 0 && (
                <div className="flex items-center text-gray-700 justify-center pb-7 w-full">
                  <span>Não há itens para mostrar</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
