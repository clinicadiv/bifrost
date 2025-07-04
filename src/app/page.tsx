"use client";

import { Button } from "@/components";
import { useAuthStore } from "@/hooks/useAuthStore";
import {
  CalendarIcon,
  CalendarPlusIcon,
  GitlabLogoSimpleIcon,
  SpotifyLogoIcon,
  StarIcon,
  SteamLogoIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const CONVENIOS = [
  { id: 1, title: "PsicoCare", img: "/psicocare.png", accessMethod: "CPF" },
  { id: 2, title: "GM Pharm", img: "/logo.png", accessMethod: "Código" },
  {
    id: 3,
    title: "Comunidade Divergente",
    img: "/psicocare.png",
    accessMethod: "CPF",
  },
  { id: 4, title: "Sinpro - Osasco", img: "/logo.png", accessMethod: "Código" },
  { id: 5, title: "Sintricom", img: "/psicocare.png", accessMethod: "CPF" },
  { id: 6, title: "PsicoCare", img: "/logo.png", accessMethod: "Código" },
  { id: 7, title: "GM Pharm", img: "/psicocare.png", accessMethod: "CPF" },
];

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="w-full h-full border-red-600 flex flex-col gap-5">
      <h1 className="font-satoshi text-2xl font-medium text-gray-800">
        Bem vindo de volta, {user?.name.split(" ")[0]}!
      </h1>

      <div className="grid grid-cols-3 gap-5">
        <div className="w-full shadow-lg rounded-xl border border-gray-200 col-start-1 col-end-3">
          <div className="border-b border-gray-200 p-5">
            <h2 className="font-satoshi text-2xl font-bold text-gray-700">
              Índice de Saúde Mental
            </h2>
          </div>

          <div className="flex w-full">
            <div className="flex flex-col items-center justify-center gap-5 border-r border-gray-200 px-10 py-8">
              <div className="w-32 h-32 rounded-full shadow bg-amber-400 flex items-center justify-center">
                <p className="font-satoshi font-bold text-4xl text-white">12</p>
              </div>

              <div className="flex flex-col items-center justify-center gap-2.5">
                <p className="text-center text-sm text-gray-500">
                  Seu nível atual
                </p>
                <p className="text-center font-satoshi text-xl font-semibold text-gray-700">
                  Moderado
                </p>
                <p className="text-center text-xs text-gray-500">
                  Última avaliação: 24/03/2025 23:53
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full py-5 px-7 flex flex-col gap-2.5">
                <div className="flex item-center justify-between">
                  <div>
                    <span className="font-semibold font-satoshi text-gray-700">
                      Depressão
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-semibold font-satoshi text-gray-700">
                      5
                    </span>
                    <span className="text-sm text-gray-600 font-medium">
                      Leve
                    </span>
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
                    <span className="font-semibold font-satoshi text-gray-700">
                      Ansiedade
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-semibold font-satoshi text-gray-700">
                      12
                    </span>
                    <span className="text-sm text-gray-600 font-medium">
                      Moderado
                    </span>
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
                    <span className="font-semibold font-satoshi text-gray-700">
                      Estresse
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-semibold font-satoshi text-gray-700">
                      21
                    </span>
                    <span className="text-sm text-gray-600 font-medium">
                      Muito severo
                    </span>
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
            <h2 className="font-satoshi text-2xl font-bold text-gray-700">
              Próxima consulta
            </h2>
          </div>

          <div className="flex flex-1 p-5 gap-5 relative">
            <div className="flex h-fit gap-5">
              <div className="absolute top-5 right-5 rounded-full bg-green-400/25 text-green-600 font-satoshi font-medium border border-green-300 shadow flex items-center gap-2 text-sm py-0.5 px-2.5">
                <span className="block w-2 h-2 rounded-full bg-green-600"></span>
                <p>Aprovado</p>
              </div>

              <div className="flex items-center justify-center rounded-xl bg-indigo-500 flex-col gap-2.5 text-white min-w-32 min-h-32">
                <span className="font-satoshi uppercase font-bold text-2xl">
                  08
                </span>
                <span className="font-satoshi uppercase">Maio</span>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <p className="text-lg font-semibold font-satoshi text-gray-700">
                  Consulta Psicologica
                </p>
                <p className="text-sm text-gray-500">
                  Doutor:{" "}
                  <span className="font-semibold text-gray-600">
                    Guilherme Oliveira
                  </span>
                </p>
                <p className="text-sm text-gray-500">Horário: 19:00 - 20:00</p>

                <span className="text-sm hover:underline text-indigo-600 font-satoshi cursor-pointer">
                  Ver detalhes
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-5 p-5">
            <Button variant="secondary.dark">
              <CalendarIcon size={18} weight="bold" />
              Reagendar consulta
            </Button>

            <Button variant="primary.regular">
              <CalendarPlusIcon size={18} weight="bold" />
              Nova consulta
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-5">
        <div className="w-full shadow-lg col-start-1 col-end-4 rounded-xl border border-gray-200 min-h-80 flex flex-col">
          <div className="border-b border-gray-200 p-5">
            <h2 className="font-satoshi text-2xl font-bold text-gray-700">
              Resumo de Consultas
            </h2>
          </div>

          <div className="w-full flex-1 p-5 flex flex-col gap-5">
            <div className="w-full grid grid-cols-2 gap-5 items-center">
              <div className="rounded-xl shadow bg-indigo-500/25 p-10 flex items-center justify-center flex-col gap-2.5">
                <h3 className="text-4xl text-indigo-700 font-satoshi font-bold">
                  5
                </h3>
                <p className="text-sm font-semibold text-gray-600 text-center">
                  Consultas Psicológicas
                </p>
              </div>

              <div className="rounded-xl shadow bg-indigo-500/25 p-10 flex items-center justify-center flex-col gap-2.5">
                <h3 className="text-4xl text-indigo-700 font-satoshi font-bold">
                  6
                </h3>
                <p className="text-sm font-semibold text-gray-600 text-center">
                  Consultas Psiquiátricas
                </p>
              </div>
            </div>

            <div className="w-full">
              <span className="px-3 py-1.5 rounded bg-amber-300/15 w-full flex items-center gap-2 font-medium text-amber-600">
                <StarIcon size={16} />
                Parabéns pelo seu compromisso com a saúde mental! Você já
                realizou 11 consultas.
              </span>
            </div>

            <div className="w-full flex items-center justify-end">
              <p className="text-indigo-500 hover:underline text-sm cursor-pointer">
                Ver histórico completo
              </p>
            </div>
          </div>
        </div>

        <div className="w-full shadow-lg col-start-4 col-end-9 rounded-xl border border-gray-200 min-h-80 flex flex-col">
          <div className="border-b border-gray-200 p-5">
            <h2 className="font-satoshi text-2xl font-bold text-gray-700">
              Meus Convênios
            </h2>
          </div>

          <div className="flex-1">
            <div className="h-full">
              <Swiper
                spaceBetween={8}
                slidesPerView={3}
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
                className="h-full"
                modules={[Autoplay]}
                autoplay={{
                  delay: 5000,
                }}
                style={{
                  padding: "30px",
                }}
              >
                {CONVENIOS.map((convenio) => (
                  <SwiperSlide
                    key={convenio.id}
                    className="shadow-xl rounded-lg border border-gray-200 p-2"
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div>
                        <Image
                          src={convenio.img}
                          alt=""
                          width={142}
                          height={36}
                        />
                      </div>

                      <div className="flex flex-col text-center">
                        <div className="my-6 flex flex-col gap-2">
                          <h3 className="text-gray-700 font-semibold font-satoshi text-lg">
                            {convenio.title}
                          </h3>
                          <p className="text-gray-500 text-sm font-medium">
                            Método de acesso:{" "}
                            <span>{convenio.accessMethod}</span>
                          </p>
                        </div>

                        <Button variant="primary.regular">
                          Agendar consulta
                        </Button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="w-full shadow-lg rounded-xl border border-gray-200 min-h-80 flex flex-col">
          <div className="border-b border-gray-200 p-5">
            <h2 className="font-satoshi text-2xl font-bold text-gray-700">
              Seu Psico+
            </h2>
          </div>

          <div className="flex-1 p-5">
            <div className="h-full">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold font-satoshi text-gray-600 text-xl">
                    Selos acumulados
                  </h4>

                  <span className="block rounded-4xl bg-blue-500 font-bold font-satoshi text-white py-1 px-2">
                    10/100
                  </span>
                </div>

                <div>
                  <span className="block w-full h-2.5 rounded-2xl bg-gray-300">
                    <span className="block w-1/12 h-full rounded-2xl bg-blue-500"></span>
                  </span>
                </div>

                <div className="flex flex-col gap-1 font-medium">
                  <p className="text-sm text-gray-500 font-satoshi">
                    Acumule selos com seus atendimentos no programa Psico+.
                  </p>
                  <p className="text-sm text-gray-500 font-satoshi">
                    Cada R$ 1,00 = 1 selo
                  </p>
                </div>

                <div className="my-5 grid grid-cols-3 gap-5">
                  <div className="rounded-lg transition-all hover:-translate-y-2 cursor-pointer border border-gray-400 bg-white flex items-center justify-center text-gray-600 py-5">
                    <GitlabLogoSimpleIcon size={32} weight="duotone" />
                  </div>

                  <div className="rounded-lg transition-all hover:-translate-y-2 cursor-pointer border border-gray-400 bg-white flex items-center justify-center text-gray-600 py-5">
                    <SpotifyLogoIcon size={32} weight="duotone" />
                  </div>

                  <div className="rounded-lg transition-all hover:-translate-y-2 cursor-pointer border border-gray-400 bg-white flex items-center justify-center text-gray-600 py-5">
                    <SteamLogoIcon size={32} weight="duotone" />
                  </div>
                </div>

                <div>
                  <div className="rounded-lg flex flex-col gap-5 relative shadow-xl border-l-[6px] bg-amber-200/50 border-amber-500 outline outline-amber-200">
                    <div className="p-2.5 flex flex-col gap-5">
                      <h2 className="font-medium font-satoshi text-amber-700 text-center text-sm">
                        Faltam <span className="font-semibold">90 selos</span>{" "}
                        para você resgatar seu prêmio!
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
