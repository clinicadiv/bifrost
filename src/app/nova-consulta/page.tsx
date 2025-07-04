"use client";

import {
  Button,
  LoadingOverlay,
  PixPaymentResult,
  StepFive,
  StepFour,
  StepOne,
  StepSeven,
  StepSix,
  StepThree,
  StepTwo,
  type PaymentDataProps,
  type PersonalDataProps,
} from "@/components";
import { useAuthStore } from "@/hooks/useAuthStore";
import { deleteAppointment } from "@/services/http/appointments/delete-appointment";
import { createCreditCardPayment } from "@/services/http/payments/create-credit-card-payment";
import { createPixPayment } from "@/services/http/payments/create-pix-payment";
import { cancelReservation } from "@/services/http/time-slot/cancel-reservation";
import { confirmReservation } from "@/services/http/time-slot/confirm-reservation";
import { createGuestReservation } from "@/services/http/time-slot/create-guest-reservation";
import { createReservation } from "@/services/http/time-slot/create-reservation";
import { createUserAndLink } from "@/services/http/time-slot/create-user-and-link";
import { linkAndCreateAppointment } from "@/services/http/time-slot/link-and-create-appointment";
import { updateReservation } from "@/services/http/time-slot/update-reservation";
import { SelectedAppointment, Service, ServiceType } from "@/types";
import { Check } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";

const STEPS = [
  {
    id: 1,
    title: "Serviço",
    description: "Selecione o serviço que deseja contratar",
    status: 1,
  },
  {
    id: 2,
    title: "Informações",
    description: "Preencha as informações necessárias",
    status: 0,
  },
  { id: 3, title: "Agendar", description: "Agende a consulta", status: 0 },
  {
    id: 4,
    title: "Visão geral",
    description: "Revise os dados da consulta",
    status: 0,
  },
  {
    id: 5,
    title: "Dados pessoais",
    description: "Preencha seus dados pessoais",
    status: 0,
  },
  {
    id: 6,
    title: "Pagamento",
    description: "Insira os dados do pagamento",
    status: 0,
  },
  {
    id: 7,
    title: "Concluído",
    description: "Consulta agendada com sucesso!",
    status: 0,
  },
];

export default function NovaConsulta() {
  const [steps, setSteps] = useState(STEPS);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType>(null);
  const [selectedAppointment, setSelectedAppointment] =
    useState<SelectedAppointment | null>(null);
  const [personalData, setPersonalData] = useState<PersonalDataProps | null>(
    null
  );
  const [paymentData, setPaymentData] = useState<PaymentDataProps | null>(null);
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const [createdReservationId, setCreatedReservationId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingSubMessage, setLoadingSubMessage] = useState("");
  const [pixPaymentData, setPixPaymentData] = useState<{
    pixData: {
      qrCode: string;
      payload: string;
      expirationDate: string;
    };
    amount: number;
    description: string;
  } | null>(null);
  const [showPixModal, setShowPixModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const { user, token } = useAuthStore();

  // Função para determinar o tipo do serviço baseado no nome
  const getServiceType = (service: Service): ServiceType => {
    const serviceName = service.name.toLowerCase();
    if (serviceName.includes("psic") || serviceName.includes("psiq")) {
      return "psychologist";
    } else if (serviceName.includes("psiq")) {
      return "psychiatrist";
    }
    return null;
  };

  // Função para definir serviço e tipo
  const handleServiceSelection = async (service: Service | null) => {
    // Se existe uma reserva criada e está mudando de serviço, cancelar a reserva anterior
    if (createdReservationId && service !== selectedService) {
      setLoadingState(
        true,
        "Cancelando reserva anterior",
        "Desfazendo reserva do serviço anterior..."
      );

      try {
        await cancelReservation(createdReservationId);

        setCreatedReservationId(null);

        setLoadingState(false);
      } catch (error) {
        console.error("❌ Erro ao cancelar reserva ao mudar serviço:", error);
        setLoadingState(false);
      }
    }

    setSelectedService(service);
    setServiceType(service ? getServiceType(service) : null);
    // Limpar consultas selecionadas quando trocar de serviço
    setSelectedAppointment(null);
  };

  // Função utilitária para configurar o loading
  const setLoadingState = (
    isLoading: boolean,
    message = "",
    subMessage = ""
  ) => {
    setIsLoading(isLoading);
    setLoadingMessage(message);
    setLoadingSubMessage(subMessage);
  };

  // Função memoizada para prevenir loop infinito
  const handlePersonalDataChange = useCallback((data: PersonalDataProps) => {
    setPersonalData(data);
  }, []);

  // Função memoizada para dados de pagamento
  const handlePaymentDataChange = useCallback(
    (data: PaymentDataProps | null) => {
      setPaymentData(data);
    },
    []
  );

  // Função para converter seleção para formato do StepFour simplificado
  const formatAppointmentForStepFour = () => {
    if (!selectedAppointment) {
      return null;
    }

    return {
      date: selectedAppointment.date,
      time: selectedAppointment.time,
      professional: selectedAppointment.professional,
      type: selectedAppointment.type,
    };
  };

  // Calcula a consulta formatada usando useMemo
  const formattedAppointment = useMemo(() => {
    return formatAppointmentForStepFour();
  }, [selectedAppointment]);

  // Função para fazer reservas
  const handleReservation = async (): Promise<boolean> => {
    if (!selectedService) {
      return false;
    }

    if (!selectedAppointment) {
      return false;
    }

    setLoadingState(
      true,
      "Criando suas reservas",
      "Processando suas consultas selecionadas..."
    );
    setIsCreatingReservation(true);

    try {
      if (user && token) {
        const reservationData = {
          medicalId: selectedAppointment.medicalId,
          patientId: user.id,
          serviceId: selectedService.id,
          reservationDate: selectedAppointment.date,
          reservationTime: selectedAppointment.time,
          durationMinutes: 15,
        };

        const response = await createReservation(reservationData);

        if (response && response.data && response.data.id) {
          setCreatedReservationId(response.data.id);
        }
      } else {
        const reservationData = {
          medicalId: selectedAppointment.medicalId,
          reservationDate: selectedAppointment.date,
          reservationTime: selectedAppointment.time,
          serviceId: selectedService.id,
          durationMinutes: 15,
        };

        const response = await createGuestReservation(reservationData);

        if (response && response.data && response.data.id) {
          setCreatedReservationId(response.data.id);
        } else {
        }
      }

      setIsCreatingReservation(false);
      setLoadingState(false);
      return true;
    } catch (error) {
      console.error("❌ Erro ao criar reservas:", error);
      setIsCreatingReservation(false);
      setLoadingState(false);
      return false;
    }
  };

  // Função para criar usuário e linkar reservas (Step 5)
  const handleUserCreationAndLinking = async (): Promise<boolean> => {
    if (!personalData) {
      return false;
    }

    setLoadingState(
      true,
      "Criando sua conta e vinculando sua reserva",
      "Processando seus dados pessoais e vinculando sua reserva..."
    );

    try {
      const createUserResponse = await createUserAndLink({
        reservationId: createdReservationId!,
        body: {
          name: `${personalData.firstName} ${personalData.lastName}`,
          email: personalData.email,
          phone: personalData.phone,
        },
      });

      if (!createUserResponse.userCreated) {
        console.error("❌ Erro ao criar usuário:", createUserResponse);
        return false;
      }

      setLoadingState(
        true,
        "Conta criada com sucesso e consulta vinculada!",
        `Consulta vinculada à sua conta`
      );

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const confirmReservationResponse = await confirmReservation(
        createdReservationId!
      );

      if (confirmReservationResponse.success) {
        setAppointmentId(confirmReservationResponse.data.id);

        setLoadingState(
          true,
          "Consulta confirmada com sucesso!",
          "Consulta confirmada com sucesso!"
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      return true;
    } catch (error) {
      console.error("❌ Erro no processo de criação/linking:", error);

      return false;
    } finally {
      setLoadingState(false);
    }
  };

  const handlePayment = async (): Promise<boolean> => {
    // Verificações mais específicas
    if (!paymentData) {
      setLoadingState(
        true,
        "Dados de pagamento não encontrados",
        "Volte ao step anterior e selecione uma forma de pagamento"
      );

      setTimeout(() => {
        setLoadingState(false);
      }, 3000);
      return false;
    }

    if (!personalData) {
      setLoadingState(
        true,
        "Dados pessoais não encontrados",
        "Volte ao step anterior e preencha seus dados pessoais"
      );

      setTimeout(() => {
        setLoadingState(false);
      }, 3000);
      return false;
    }

    if (!createdReservationId) {
      setLoadingState(
        true,
        "Nenhuma reserva encontrada",
        "Reinicie o processo de agendamento"
      );
      setTimeout(() => {
        setLoadingState(false);
      }, 3000);
      return false;
    }

    // Verificar se é pagamento PIX
    if (paymentData.method === "pix") {
      if (!paymentData.pixData) {
        setLoadingState(
          true,
          "Dados PIX não encontrados",
          "Preencha o CPF para continuar"
        );
        setTimeout(() => {
          setLoadingState(false);
        }, 3000);
        return false;
      }

      if (!paymentData.pixData.cpf) {
        setLoadingState(
          true,
          "CPF é obrigatório",
          "Preencha o CPF para pagamento via PIX"
        );
        setTimeout(() => {
          setLoadingState(false);
        }, 3000);
        return false;
      }

      setLoadingState(
        true,
        "Processando pagamento PIX",
        "Gerando código PIX para pagamento..."
      );

      try {
        const pixResponse = await createPixPayment({
          appointmentId: appointmentId!,
          customer: {
            name: `${personalData.firstName} ${personalData.lastName}`,
            email: personalData.email,
            document: paymentData.pixData.cpf,
            phone: personalData.phone,
          },
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
          description: `Pagamento para consulta com ${selectedService?.name}`,
        });

        // Armazenar dados do PIX para exibir no modal
        setPixPaymentData({
          pixData: pixResponse.data.pixData,
          amount: pixResponse.data.amount,
          description: `Pagamento para consulta com ${selectedService?.name}`,
        });

        setLoadingState(false);
        setShowPixModal(true);

        // Redirecionar para o step 7 quando abrir o modal do PIX
        setCurrentStep(7);
        const newSteps = steps.map((step) => {
          if (step.id === 6) {
            return {
              ...step,
              status: 2,
            } as typeof step;
          } else if (step.id === 7) {
            return {
              ...step,
              status: 1,
            } as typeof step;
          } else {
            return step;
          }
        });
        setSteps(newSteps);

        return true;
      } catch (error) {
        console.error("❌ Erro ao processar pagamento PIX:", error);
        setLoadingState(
          true,
          "Erro ao processar pagamento PIX",
          "Tente novamente em alguns instantes..."
        );
        setTimeout(() => {
          setLoadingState(false);
        }, 3000);
        return false;
      }
    }

    // Verificar se é pagamento por cartão de crédito
    if (paymentData.method === "credit") {
      if (!paymentData.cardData) {
        setLoadingState(
          true,
          "Dados do cartão não encontrados",
          "Preencha os dados do cartão para continuar"
        );
        setTimeout(() => {
          setLoadingState(false);
        }, 3000);
        return false;
      }

      const { cardNumber, cardHolder, expiryDate, cvv } = paymentData.cardData;

      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        setLoadingState(
          true,
          "Dados do cartão incompletos",
          "Preencha todos os campos do cartão"
        );
        setTimeout(() => {
          setLoadingState(false);
        }, 3000);
        return false;
      }

      setLoadingState(
        true,
        "Processando pagamento",
        "Processando pagamento no cartão de crédito..."
      );

      try {
        // Extrair mês e ano da data de expiração
        const [month, year] = expiryDate.split("/");
        const fullYear = `20${year}`;

        const creditCardPaymentData = {
          appointmentId: appointmentId!,
          customer: {
            name: `${personalData.firstName} ${personalData.lastName}`,
            email: personalData.email,
            document: paymentData.cardData.cpf, // Usar CPF do cartão como documento
            phone: personalData.phone,
          },
          creditCard: {
            holderName: cardHolder,
            number: cardNumber.replace(/\s/g, ""), // Remover espaços
            expiryMonth: month,
            expiryYear: fullYear,
            ccv: cvv,
          },
          creditCardHolder: {
            name: cardHolder,
            email: personalData.email,
            cpfCnpj: paymentData.cardData.cpf, // Usar CPF do cartão como documento
            postalCode: "86065-440", // CEP padrão
            addressNumber: "100", // Número padrão
            phone: personalData.phone,
            mobilePhone: personalData.phone,
          },
          description: `Pagamento para consulta com ${selectedService?.name}`,
        };

        await createCreditCardPayment(creditCardPaymentData);

        setLoadingState(
          true,
          "Pagamento processado com sucesso!",
          "Seu pagamento foi aprovado e a consulta está confirmada."
        );

        setTimeout(() => {
          setLoadingState(false);
          // Redirecionar para o step 7 quando pagamento por cartão for bem-sucedido
          setCurrentStep(7);
          const newSteps = steps.map((step) => {
            if (step.id === 6) {
              return {
                ...step,
                status: 2,
              } as typeof step;
            } else if (step.id === 7) {
              return {
                ...step,
                status: 1,
              } as typeof step;
            } else {
              return step;
            }
          });
          setSteps(newSteps);
        }, 3000);

        return true;
      } catch (error) {
        console.error("❌ Erro ao processar pagamento no cartão:", error);
        setLoadingState(
          true,
          "Erro ao processar pagamento",
          "Verifique os dados do cartão e tente novamente..."
        );
        setTimeout(() => {
          setLoadingState(false);
        }, 3000);
        return false;
      }
    }

    // Método de pagamento não suportado
    setLoadingState(
      true,
      "Método de pagamento não suportado",
      "Selecione PIX ou cartão de crédito"
    );
    setTimeout(() => {
      setLoadingState(false);
    }, 3000);
    return false;
  };

  const handleNextStep = async () => {
    if (currentStep === 3) {
      if (!selectedService) {
        setLoadingState(
          true,
          "Erro: Nenhum serviço selecionado",
          "Volte ao passo anterior para selecionar um serviço"
        );
        setTimeout(() => {
          setLoadingState(false);
        }, 3000);
        return;
      }

      if (!selectedAppointment) {
        setLoadingState(
          true,
          "Erro: Nenhuma consulta selecionada",
          "Selecione uma consulta para continuar"
        );
        setTimeout(() => {
          setLoadingState(false);
        }, 3000);
        return;
      }

      const success = await handleReservation();

      if (!success) {
        setLoadingState(
          true,
          "Erro ao criar reservas",
          "Tente novamente em alguns instantes..."
        );
        setTimeout(() => {
          setLoadingState(false);
        }, 3000);
        return;
      }
    }

    if (currentStep === 4) {
      if (user && createdReservationId) {
        setLoadingState(true, "Confirmando reserva");

        const confirmReservationResponse = await confirmReservation(
          createdReservationId
        );

        if (confirmReservationResponse.success) {
          setAppointmentId(confirmReservationResponse.data.id);

          setLoadingState(true, "Reserva confirmada com sucesso!");

          setTimeout(() => {
            setLoadingState(false);
          }, 3000);
        }

        setTimeout(() => {
          setLoadingState(false);
        }, 3000);

        setCurrentStep(6);
        return;
      } else {
        setCurrentStep(currentStep + 1);
      }

      const newSteps = steps.map((step) => {
        if (step.id === currentStep) {
          return {
            ...step,
            status: 2,
          } as typeof step;
        } else if (step.id === currentStep + 1) {
          return {
            ...step,
            status: 2,
          } as typeof step;
        } else if (step.id === currentStep + 2) {
          return {
            ...step,
            status: 1,
          } as typeof step;
        } else {
          return step;
        }
      });

      setSteps(newSteps);
      return;
    }

    if (currentStep === 5) {
      if (!user || !token) {
        if (!personalData) {
          setLoadingState(
            true,
            "Dados incompletos",
            "Preencha todos os campos obrigatórios"
          );
          setTimeout(() => {
            setLoadingState(false);
          }, 3000);
          return;
        }

        const success = await handleUserCreationAndLinking();

        if (!success) {
          setLoadingState(
            true,
            "Erro ao criar conta",
            "Tente novamente em alguns instantes..."
          );

          setTimeout(() => {
            setLoadingState(false);
          }, 3000);
          return;
        }
      }
    }

    if (currentStep === 6) {
      const success = await handlePayment();
      if (!success) {
        return;
      }
      return;
    }

    if (currentStep === steps.length) {
      return;
    }

    setCurrentStep(currentStep + 1);

    const newSteps = steps.map((step) => {
      if (step.id === currentStep) {
        return {
          ...step,
          status: 2,
        } as typeof step;
      } else if (step.id === currentStep + 1) {
        return {
          ...step,
          status: 1,
        } as typeof step;
      } else {
        return step;
      }
    });

    setSteps(newSteps);
  };

  const handlePreviousStep = async () => {
    if (currentStep === 1) return;

    // Se está voltando do step 4 para o step 3, cancelar a reserva
    if (currentStep === 4 && createdReservationId) {
      setLoadingState(
        true,
        "Cancelando reserva anterior",
        "Desfazendo a reserva para permitir nova seleção..."
      );

      try {
        await cancelReservation(createdReservationId);

        // Limpar o ID da reserva criada
        setCreatedReservationId(null);

        setLoadingState(
          true,
          "Reserva cancelada",
          "Você pode fazer uma nova seleção de horário"
        );

        // Mostrar mensagem por 2 segundos
        setTimeout(() => {
          setLoadingState(false);
        }, 2000);
      } catch (error) {
        console.error("❌ Erro ao cancelar reserva:", error);
        setLoadingState(
          true,
          "Erro ao cancelar reserva",
          "Houve um problema ao cancelar a reserva anterior"
        );

        setTimeout(() => {
          setLoadingState(false);
        }, 3000);
        return; // Não prosseguir se não conseguiu cancelar
      }
    }

    if (
      currentStep === 6 &&
      user &&
      token &&
      appointmentId &&
      createdReservationId
    ) {
      setLoadingState(
        true,
        "Cancelando consulta",
        "Cancelando consulta para permitir nova seleção de horário..."
      );

      Promise.all([
        deleteAppointment(appointmentId),
        updateReservation(createdReservationId, "RESERVED"),
      ]);

      setLoadingState(
        true,
        "Consulta cancelada",
        "Você pode fazer uma nova seleção de horário"
      );

      setTimeout(() => {
        setLoadingState(false);
      }, 1500);

      setCurrentStep(4);

      const newSteps = steps.map((step) => {
        if (step.id === currentStep) {
          return {
            ...step,
            status: 0,
          } as typeof step;
        } else if (step.id === currentStep - 1) {
          return {
            ...step,
            status: 0,
          } as typeof step;
        } else if (step.id === currentStep - 2) {
          return {
            ...step,
            status: 1,
          } as typeof step;
        } else {
          return step;
        }
      });

      setSteps(newSteps);
      return;
    }

    setCurrentStep(currentStep - 1);

    const newSteps = steps.map((step) => {
      if (step.id === currentStep) {
        return {
          ...step,
          status: 0,
        } as typeof step;
      } else if (step.id === currentStep - 1) {
        return {
          ...step,
          status: 1,
        } as typeof step;
      } else {
        return step;
      }
    });

    setSteps(newSteps);
  };

  const handleLinkAndCreateAppointment = async () => {
    if (createdReservationId && user) {
      const response = await linkAndCreateAppointment(
        createdReservationId,
        user.id
      );

      if (response.success) {
        setAppointmentId(response.data.appointment.id);

        handleNextStep();
      }
    }
  };

  useEffect(() => {
    if (user) {
      setPersonalData({
        email: user.email,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ")[1],
        phone: user.phone,
      });

      if (createdReservationId) {
        handleLinkAndCreateAppointment();
      }
    }
  }, [user]);

  return (
    <div className="w-full max-h-full flex flex-col gap-5">
      <div className="w-full max-h-full flex flex-1 gap-5 ">
        {/* Esconder o menu lateral quando estiver no step 7 */}
        {currentStep !== 7 && (
          <div className="flex flex-col gap-2 w-max max-w-[280px] h-max bg-white border border-gray-200 shadow-sm p-5 rounded-xl">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <div
                  className={`flex w-full gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    step.status === 1
                      ? "bg-primary-dark/5 border-l-2 border-primary-dark"
                      : step.status === 2
                      ? "bg-green-50 border-l-2 border-green-500"
                      : "hover:bg-gray-50"
                  } ${step.status === 0 ? "opacity-60" : "opacity-100"}`}
                >
                  <div className="flex pt-0.5 justify-center">
                    {step.status === 2 && (
                      <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                        <Check weight="bold" />
                      </span>
                    )}

                    {step.status === 1 && (
                      <span className="w-6 h-6 rounded-full bg-primary-dark text-white flex items-center justify-center">
                        <span className="w-2 h-2 bg-white block rounded-full"></span>
                      </span>
                    )}

                    {step.status === 0 && (
                      <span className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-white/70 block rounded-full"></span>
                      </span>
                    )}
                  </div>

                  <div className="w-full flex flex-col gap-1 justify-center">
                    <h2
                      className={`font-satoshi font-medium text-sm ${
                        step.status === 1
                          ? "text-primary-dark"
                          : step.status === 2
                          ? "text-green-700"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </h2>
                    <p
                      className={`text-xs ${
                        step.status === 1
                          ? "text-primary-dark/70"
                          : step.status === 2
                          ? "text-green-600/80"
                          : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Linha conectora entre steps */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div
                      className={`w-px h-3 ${
                        step.status === 2
                          ? "bg-green-400"
                          : step.status === 1
                          ? "bg-primary-dark"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
            ))}

            {/* Indicador de progresso */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Progresso</span>
                <span>
                  {Math.round(
                    (steps.filter((s) => s.status === 2).length /
                      steps.length) *
                      100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-full bg-primary-dark rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (steps.filter((s) => s.status === 2).length /
                        steps.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`w-full flex-1 flex max-h-[calc(100vh-170px)] flex-col border border-gray-300 p-7 rounded-lg overflow-y-auto ${
            currentStep === 7 ? "max-w-none" : ""
          }`}
        >
          <h2 className="text-gray-700 text-2xl font-satoshi font-semibold mb-4">
            {currentStep === 1 && "Selecione o serviço"}
            {currentStep === 2 && "Informações do serviço"}
            {currentStep === 3 && "Agende suas consultas"}
            {currentStep === 4 && "Visão geral"}
            {currentStep === 5 && "Dados pessoais"}
            {currentStep === 6 && "Finalizar pagamento"}
            {currentStep === 7 && "Consulta Agendada!"}
          </h2>

          <div className="overflow-y-auto flex-1 mb-1 pb-10 pr-5">
            {/* Step 1 */}
            <div className={currentStep === 1 ? "block" : "hidden"}>
              <StepOne
                setService={handleServiceSelection}
                selectedService={selectedService}
              />
            </div>

            {/* Step 2 */}
            <div className={currentStep === 2 ? "block" : "hidden"}>
              <StepTwo selectedService={selectedService} />
            </div>

            {/* Step 3 */}
            <div className={currentStep === 3 ? "block" : "hidden"}>
              <StepThree
                selectedService={selectedService}
                serviceType={serviceType}
                selectedAppointment={selectedAppointment}
                setSelectedAppointment={setSelectedAppointment}
              />
            </div>

            {/* Step 4 */}
            <div className={currentStep === 4 ? "block" : "hidden"}>
              <StepFour
                selectedService={selectedService}
                selectedAppointment={formattedAppointment}
              />
            </div>

            {/* Step 5 */}
            <div className={currentStep === 5 ? "block" : "hidden"}>
              <StepFive
                onDataChange={handlePersonalDataChange}
                initialData={personalData || undefined}
                onLoginClick={() => {
                  const { openLoginModal } = useAuthStore.getState();
                  openLoginModal();
                }}
              />
            </div>

            {/* Step 6 */}
            <div className={currentStep === 6 ? "block" : "hidden"}>
              {currentStep === 6 &&
                (() => {
                  return (
                    <StepSix
                      onDataChange={handlePaymentDataChange}
                      initialData={paymentData || undefined}
                      selectedService={selectedService}
                    />
                  );
                })()}
            </div>

            {/* Step 7 */}
            <div className={currentStep === 7 ? "block" : "hidden"}>
              <StepSeven
                selectedService={selectedService}
                selectedAppointment={formattedAppointment}
                paymentMethod={paymentData?.method}
                onNewAppointment={() => {
                  // Reset para o primeiro step
                  setCurrentStep(1);
                  setSteps(STEPS);
                  setSelectedService(null);
                  setServiceType(null);
                  setSelectedAppointment(null);
                  setPersonalData(null);
                  setPaymentData(null);
                  setCreatedReservationId(null);
                  setAppointmentId(null);
                  setPixPaymentData(null);
                  setShowPixModal(false);
                }}
              />
            </div>
          </div>

          {/* Esconder botões de navegação no step 7 */}
          {currentStep !== 7 && (
            <div className="flex items-center justify-end gap-5">
              {currentStep > 1 && (
                <Button variant="gray.dark" onClick={handlePreviousStep}>
                  Voltar
                </Button>
              )}
              <Button
                onClick={handleNextStep}
                disabled={
                  isCreatingReservation ||
                  isLoading ||
                  (currentStep === 6 && !paymentData)
                }
              >
                {isCreatingReservation
                  ? "Criando reservas..."
                  : isLoading
                  ? currentStep === 5
                    ? "Criando conta..."
                    : currentStep === 6
                    ? "Processando pagamento..."
                    : "Processando..."
                  : currentStep === 6
                  ? paymentData
                    ? "Finalizar Pagamento"
                    : "Preencha os dados de pagamento"
                  : "Próximo"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isLoading}
        message={loadingMessage}
        subMessage={loadingSubMessage}
      />

      {/* PIX Payment Result Modal */}
      {pixPaymentData && (
        <PixPaymentResult
          isVisible={showPixModal}
          onClose={() => setShowPixModal(false)}
          pixData={pixPaymentData.pixData}
          amount={pixPaymentData.amount}
          description={pixPaymentData.description}
        />
      )}
    </div>
  );
}
