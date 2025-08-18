"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { getInstallments } from "@/services/http/payments/get-installments";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  CreditCard,
  CreditCardIcon,
  Lock,
  QrCode,
  User,
  WifiHigh,
} from "@phosphor-icons/react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Função para aplicar máscara de CPF/CNPJ
const applyCPFCNPJMask = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const cleanValue = value.replace(/\D/g, "");

  // Determina se é CPF ou CNPJ baseado no tamanho
  if (cleanValue.length <= 11) {
    // Máscara de CPF: 000.000.000-00
    return cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .slice(0, 14); // Limita o tamanho máximo (XXX.XXX.XXX-XX)
  } else {
    // Máscara de CNPJ: 00.000.000/0000-00
    return cleanValue
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})/, "$1-$2")
      .slice(0, 18); // Limita o tamanho máximo (XX.XXX.XXX/XXXX-XX)
  }
};

// Schemas de validação
const pixSchema = z.object({
  cpf: z.string().min(1, "CPF/CNPJ é obrigatório"),
});

const cardSchema = z.object({
  cardNumber: z.string().min(16, "Número do cartão deve ter 16 dígitos"),
  cardHolder: z.string().min(2, "Nome do portador é obrigatório"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Data deve estar no formato MM/AA"),
  cvv: z
    .string()
    .min(3, "CVV deve ter pelo menos 3 dígitos")
    .max(4, "CVV deve ter no máximo 4 dígitos"),
  cpf: z.string().min(1, "CPF/CNPJ é obrigatório"),
  installments: z.number(),
});

type PaymentMethod = "PIX" | "CREDIT_CARD";
type PixData = z.infer<typeof pixSchema>;
type CardData = z.infer<typeof cardSchema>;

export interface PaymentDataProps {
  method: PaymentMethod;
  pixData?: PixData;
  cardData?: CardData;
}

interface InstallmentOption {
  installments: number;
  installmentValue: number;
  totalAmount: number;
  totalInterest: number;
  label: string;
  recommended: boolean;
}

interface StepSixProps {
  onDataChange?: (data: PaymentDataProps | null) => void;
  initialData?: PaymentDataProps;
  selectedService?: {
    id: string;
    name: string;
    pricing: {
      originalPrice: number;
      yourPrice: number;
      savings: number;
    };
  } | null;
}

export const StepSix = ({
  onDataChange,
  initialData,
  selectedService,
}: StepSixProps) => {
  const { theme } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    initialData?.method || "PIX"
  );
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [installmentOptions, setInstallmentOptions] = useState<
    InstallmentOption[]
  >([]);
  const [selectedInstallments, setSelectedInstallments] = useState<number>(1);
  const [isLoadingInstallments, setIsLoadingInstallments] = useState(false);

  // Form para PIX
  const pixForm = useForm<PixData>({
    mode: "onChange",
    resolver: zodResolver(pixSchema),
    defaultValues: initialData?.pixData || { cpf: "" },
  });

  // Form para Cartão
  const cardForm = useForm<CardData>({
    mode: "onChange",
    resolver: zodResolver(cardSchema),
    defaultValues: initialData?.cardData || {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
      cpf: "",
      installments: 1,
    },
  });

  // Buscar opções de parcelamento quando o serviço estiver disponível
  useEffect(() => {
    if (
      selectedService &&
      selectedService.pricing.yourPrice > 0 &&
      selectedMethod === "CREDIT_CARD"
    ) {
      setIsLoadingInstallments(true);
      getInstallments(selectedService.pricing.yourPrice)
        .then((response) => {
          if (response.success) {
            setInstallmentOptions(response.data.installmentOptions);
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar opções de parcelamento:", error);
        })
        .finally(() => {
          setIsLoadingInstallments(false);
        });
    }
  }, [selectedService, selectedMethod]);

  // Função para formatar número do cartão
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Função para formatar data de expiração
  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2}\/\d{2})\d+?$/, "$1");
  };

  // Função para notificar mudanças
  const notifyChange = () => {
    if (selectedMethod === "PIX") {
      const pixValues = pixForm.getValues();

      // VALIDAÇÃO MANUAL: Aceita CPF (11 dígitos) ou CNPJ (14 dígitos)
      const cpfCnpjClean = pixValues.cpf?.replace(/\D/g, "") || "";
      const isValidCPF = cpfCnpjClean.length === 11;
      const isValidCNPJ = cpfCnpjClean.length === 14;
      const cpfCnpjIsValid = isValidCPF || isValidCNPJ;

      if (cpfCnpjIsValid) {
        const data: PaymentDataProps = {
          method: selectedMethod,
          pixData: { cpf: cpfCnpjClean }, // Sempre enviar CPF/CNPJ limpo
        };
        onDataChange?.(data);
      } else {
        onDataChange?.(null);
      }
    } else {
      // Para cartão, usar validação manual também
      const cardValues = cardForm.getValues();

      // Limpar e validar campos individualmente
      const cardNumberClean = cardValues.cardNumber?.replace(/\s/g, "") || "";
      const cardHolder = cardValues.cardHolder?.trim() || "";
      const expiryDate = cardValues.expiryDate || "";
      const cvv = cardValues.cvv || "";
      const cpfCnpjClean = cardValues.cpf?.replace(/\D/g, "") || "";
      const installments = cardValues.installments || 1;

      console.log("installments", installments);

      // Validações básicas mais permissivas
      const cardNumberValid =
        cardNumberClean.length >= 13 && cardNumberClean.length <= 19;
      const cardHolderValid = cardHolder.length >= 2;
      const expiryDateValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate);
      const cvvValid = cvv.length >= 3 && cvv.length <= 4;
      const cpfValid = cpfCnpjClean.length === 11 || cpfCnpjClean.length === 14;

      if (
        cardNumberValid &&
        cardHolderValid &&
        expiryDateValid &&
        cvvValid &&
        cpfValid
      ) {
        const cardData: CardData = {
          cardNumber: cardNumberClean,
          cardHolder,
          expiryDate,
          cvv,
          cpf: cpfCnpjClean,
          installments,
        };

        // Adicionar installments apenas se for maior que 1
        if (selectedInstallments > 1) {
          cardData.installments = selectedInstallments;
        }

        const data: PaymentDataProps = {
          method: selectedMethod,
          cardData,
        };
        onDataChange?.(data);
      } else {
        onDataChange?.(null);
      }
    }
  };

  // Verificar se devemos notificar no carregamento inicial
  useEffect(() => {
    // Se há dados iniciais válidos, forçar revalidação e notificação
    if (initialData && selectedMethod === "PIX" && initialData.pixData?.cpf) {
      pixForm.setValue("cpf", initialData.pixData.cpf);
      // Forçar revalidação
      pixForm.trigger("cpf").then(() => {
        setTimeout(notifyChange, 200);
      });
    } else {
      // Tentar notificar de qualquer forma para verificar estado atual
      setTimeout(notifyChange, 100);
    }
  }, []);

  // Chamar notifyChange quando o método mudar
  useEffect(() => {
    setTimeout(notifyChange, 100);
  }, [selectedMethod]);

  // Monitor de mudanças no CPF para forçar validação
  useEffect(() => {
    const subscription = pixForm.watch((value, { name }) => {
      if (name === "cpf" && selectedMethod === "PIX") {
        setTimeout(notifyChange, 200);
      }
    });
    return () => subscription.unsubscribe();
  }, [selectedMethod]);

  // Monitor de mudanças nos campos do cartão para forçar validação
  useEffect(() => {
    const subscription = cardForm.watch((value, { name }) => {
      if (
        selectedMethod === "CREDIT_CARD" &&
        ["cardNumber", "cardHolder", "expiryDate", "cvv", "cpf"].includes(
          name || ""
        )
      ) {
        setTimeout(notifyChange, 200);
      }
    });
    return () => subscription.unsubscribe();
  }, [selectedMethod]);

  useEffect(() => {
    if (selectedMethod === "CREDIT_CARD") {
      console.log("selectedInstallments", selectedInstallments);
    }
  }, [selectedInstallments]);

  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
    // Reset forms when changing method
    if (method === "PIX") {
      cardForm.reset();
    } else {
      pixForm.reset();
    }
    setTimeout(notifyChange, 100);
  };

  // Componente do Cartão 3D Interativo com Framer Motion
  const InteractiveCard = ({
    cardData,
    isFlipped,
  }: {
    cardData: CardData;
    isFlipped: boolean;
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Motion values para controlar a rotação
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Springs para animações suaves
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
      stiffness: 300,
      damping: 30,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
      stiffness: 300,
      damping: 30,
    });

    // Efeito de elevação simples
    const scale = useSpring(1, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normaliza as coordenadas do mouse para -0.5 a 0.5
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const getCardType = (number: string) => {
      const cleanNumber = number.replace(/\s/g, "");
      if (cleanNumber.startsWith("4")) return "visa";
      if (
        cleanNumber.startsWith("5") ||
        (cleanNumber.startsWith("2") &&
          cleanNumber.length >= 2 &&
          parseInt(cleanNumber.substring(0, 2)) >= 22 &&
          parseInt(cleanNumber.substring(0, 2)) <= 27)
      )
        return "mastercard";
      if (cleanNumber.startsWith("3")) return "amex";
      if (cleanNumber.startsWith("6")) return "discover";
      if (cleanNumber.startsWith("35")) return "jcb";
      return "generic";
    };

    const getCardColor = (type: string) => {
      switch (type) {
        case "visa":
          return "from-blue-600 via-blue-700 to-blue-800";
        case "mastercard":
          return "from-red-500 via-orange-500 to-red-600";
        case "amex":
          return "from-green-600 via-green-700 to-green-800";
        case "discover":
          return "from-orange-500 via-orange-600 to-orange-700";
        case "jcb":
          return "from-purple-600 via-purple-700 to-purple-800";
        default:
          return "from-gray-600 via-gray-700 to-gray-800";
      }
    };

    const getCardBrandLogo = (type: string) => {
      switch (type) {
        case "visa":
          return (
            <motion.div
              className="text-white font-bold text-lg tracking-wider"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              VISA
            </motion.div>
          );
        case "mastercard":
          return (
            <motion.div
              className="flex items-center gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-6 h-6 bg-red-500 rounded-full opacity-90"></div>
              <div className="w-6 h-6 bg-yellow-400 rounded-full opacity-90 -ml-3"></div>
            </motion.div>
          );
        case "amex":
          return (
            <motion.div
              className="text-white font-bold text-sm tracking-wider"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              AMERICAN
              <br />
              EXPRESS
            </motion.div>
          );
        case "discover":
          return (
            <motion.div
              className="text-white font-bold text-lg tracking-wider"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              DISCOVER
            </motion.div>
          );
        case "jcb":
          return (
            <motion.div
              className="text-white font-bold text-lg tracking-wider"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              JCB
            </motion.div>
          );
        default:
          return (
            <motion.div
              className="text-white font-bold text-lg tracking-wider opacity-50"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              CARD
            </motion.div>
          );
      }
    };

    const cardType = getCardType(cardData.cardNumber);
    const cardColor = getCardColor(cardType);

    return (
      <div className="w-80 h-48" style={{ perspective: "1000px" }}>
        <motion.div
          ref={cardRef}
          className="relative w-full h-full cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transformStyle: "preserve-3d",
            rotateX,
            rotateY,
            scale,
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          animate={{
            rotateY: isFlipped ? 180 : 0,
          }}
        >
          {/* Frente do cartão */}
          <motion.div
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${cardColor} rounded-xl shadow-2xl overflow-hidden`}
            style={{ backfaceVisibility: "hidden" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Padrão de fundo melhorado */}
            <div className="absolute inset-0 opacity-10">
              <motion.div
                className="absolute top-4 right-4 w-20 h-20 border border-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute top-8 right-8 w-16 h-16 border border-white rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute bottom-4 left-4 w-12 h-12 border border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full opacity-5"></div>
            </div>

            <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
              {/* Header com chip e contactless */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="w-3 h-2 bg-yellow-900 rounded-sm"></div>
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <WifiHigh size={20} className="text-white opacity-80" />
                  </motion.div>
                </div>
                <div className="text-right">{getCardBrandLogo(cardType)}</div>
              </div>

              {/* Número do cartão */}
              <div className="space-y-4">
                <motion.div
                  className="text-xl font-mono tracking-wider drop-shadow-sm"
                  key={cardData.cardNumber} // Re-anima quando o número muda
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {cardData.cardNumber
                    ? formatCardNumber(cardData.cardNumber)
                    : "•••• •••• •••• ••••"}
                </motion.div>

                {/* Nome e validade */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs opacity-80 uppercase tracking-wider mb-1">
                      Card Holder
                    </div>
                    <motion.div
                      className="text-sm font-medium uppercase tracking-wide drop-shadow-sm"
                      key={cardData.cardHolder}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {cardData.cardHolder || "YOUR NAME"}
                    </motion.div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80 uppercase tracking-wider mb-1">
                      Expires
                    </div>
                    <motion.div
                      className="text-sm font-mono drop-shadow-sm"
                      key={cardData.expiryDate}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {cardData.expiryDate || "MM/YY"}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brilho sutil no hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transform -skew-x-12"
              whileHover={{ opacity: 0.1, x: ["-100%", "100%"] }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>

          {/* Verso do cartão */}
          <motion.div
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${cardColor} rounded-xl shadow-2xl overflow-hidden`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative h-full">
              {/* Tarja magnética */}
              <div className="w-full h-12 bg-black mt-6"></div>

              {/* Área de assinatura e CVV */}
              <div className="p-6 pt-8">
                <motion.div
                  className="bg-white rounded h-10 mb-4 flex items-center justify-end px-3 shadow-inner -translate-y-3.5"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.span
                    className="text-black font-mono text-sm font-bold"
                    key={cardData.cvv}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {cardData.cvv || "•••"}
                  </motion.span>
                </motion.div>

                <div className="text-white text-[10px] opacity-80 space-y-1 -translate-y-3">
                  <p>This card is property of the bank</p>
                  <p>If found, please return to nearest branch</p>
                </div>

                {/* Logo da bandeira no verso também */}
                <div className="absolute bottom-6 right-6 -translate-y-3">
                  {getCardBrandLogo(cardType)}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div
        className={`${
          theme === "dark"
            ? "bg-green-900/30 border-green-700"
            : "bg-green-50 border-green-200"
        } border rounded-lg p-4`}
      >
        <h3
          className={`font-semibold mb-2 ${
            theme === "dark" ? "text-green-400" : "text-green-800"
          }`}
        >
          Pagamento
        </h3>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-green-300" : "text-green-600"
          }`}
        >
          Escolha sua forma de pagamento preferida para finalizar o agendamento
        </p>
      </div>

      {/* Seleção do método de pagamento */}
      <div className="flex flex-col sm:flex-row gap-4 px-2">
        {/* PIX */}
        <button
          type="button"
          onClick={() => handleMethodChange("PIX")}
          className={`flex-1 relative overflow-hidden group transition-all duration-300 ${
            selectedMethod === "PIX"
              ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 scale-[1.02]"
              : theme === "dark"
              ? "bg-gray-800 border border-gray-700 hover:border-green-300 hover:shadow-md text-gray-300 hover:scale-[1.01]"
              : "bg-white border border-gray-200 hover:border-green-300 hover:shadow-md text-gray-700 hover:scale-[1.01]"
          } rounded-xl p-4`}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  selectedMethod === "PIX"
                    ? "bg-white/20"
                    : theme === "dark"
                    ? "bg-green-900/30 group-hover:bg-green-900/50"
                    : "bg-green-50 group-hover:bg-green-100"
                } transition-colors`}
              >
                <QrCode
                  size={20}
                  className={
                    selectedMethod === "PIX" ? "text-white" : "text-green-600"
                  }
                />
              </div>
              <div className="text-left">
                <div
                  className={`font-semibold ${
                    selectedMethod === "PIX"
                      ? "text-white"
                      : theme === "dark"
                      ? "text-gray-200"
                      : "text-gray-800"
                  }`}
                >
                  PIX
                </div>
                <div
                  className={`text-xs ${
                    selectedMethod === "PIX"
                      ? "text-green-100"
                      : theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Aprovação instantânea
                </div>
              </div>
            </div>
            {selectedMethod === "PIX" && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Efeito de brilho no hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>

        {/* Cartão de Crédito */}
        <button
          type="button"
          onClick={() => handleMethodChange("CREDIT_CARD")}
          className={`flex-1 relative overflow-hidden group transition-all duration-300 ${
            selectedMethod === "CREDIT_CARD"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]"
              : theme === "dark"
              ? "bg-gray-800 border border-gray-700 hover:border-blue-300 hover:shadow-md text-gray-300 hover:scale-[1.01]"
              : "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md text-gray-700 hover:scale-[1.01]"
          } rounded-xl p-4`}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  selectedMethod === "CREDIT_CARD"
                    ? "bg-white/20"
                    : theme === "dark"
                    ? "bg-blue-900/30 group-hover:bg-blue-900/50"
                    : "bg-blue-50 group-hover:bg-blue-100"
                } transition-colors`}
              >
                <CreditCard
                  size={20}
                  className={
                    selectedMethod === "CREDIT_CARD"
                      ? "text-white"
                      : "text-blue-600"
                  }
                />
              </div>
              <div className="text-left">
                <div
                  className={`font-semibold ${
                    selectedMethod === "CREDIT_CARD"
                      ? "text-white"
                      : theme === "dark"
                      ? "text-gray-200"
                      : "text-gray-800"
                  }`}
                >
                  Cartão de Crédito
                </div>
                <div
                  className={`text-xs ${
                    selectedMethod === "CREDIT_CARD"
                      ? "text-blue-100"
                      : theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Parcelamento disponível
                </div>
              </div>
            </div>
            {selectedMethod === "CREDIT_CARD" && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
          </div>

          {/* Efeito de brilho no hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>
      </div>

      {/* Formulário PIX */}
      {selectedMethod === "PIX" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <QrCode size={24} className="text-green-600" />
              <h4
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Pagamento via PIX
              </h4>
            </div>

            <form className="space-y-4">
              <div>
                <label
                  htmlFor="cpf"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  CPF/CNPJ do titular <span className="text-red-500">*</span>
                </label>
                <input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  maxLength={18}
                  value={applyCPFCNPJMask(pixForm.watch("cpf") || "")}
                  onChange={(e) => {
                    const maskedValue = applyCPFCNPJMask(e.target.value);
                    const cleanCPF = maskedValue.replace(/\D/g, "");

                    pixForm.setValue("cpf", cleanCPF, { shouldValidate: true });
                    setTimeout(notifyChange, 150);
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ${
                    pixForm.formState.errors.cpf
                      ? "border-red-500"
                      : theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
                {pixForm.formState.errors.cpf && (
                  <span className="text-sm text-red-500 mt-1">
                    {pixForm.formState.errors.cpf.message}
                  </span>
                )}
              </div>

              <div
                className={`${
                  theme === "dark"
                    ? "bg-green-900/30 border-green-700"
                    : "bg-green-50 border-green-200"
                } border rounded-lg p-4`}
              >
                <div className="flex items-start gap-3">
                  <Lock size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-green-400" : "text-green-800"
                      }`}
                    >
                      Pagamento Seguro
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        theme === "dark" ? "text-green-300" : "text-green-600"
                      }`}
                    >
                      Após confirmar, você receberá o código PIX para pagamento.
                      O agendamento será confirmado automaticamente após o
                      pagamento.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Resumo PIX */}
          <div className="space-y-6">
            {/* Resumo Compacto - PIX */}
            {selectedService && (
              <div
                className={`${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border rounded-lg p-4 shadow-sm`}
              >
                <h4
                  className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <QrCode size={16} className="text-green-600" />
                  Resumo PIX
                </h4>

                <div className="space-y-3 text-sm">
                  {/* Serviço */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {selectedService.name}
                    </span>
                    <span
                      className={`font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(selectedService.pricing.yourPrice)}
                    </span>
                  </div>

                  {/* Vantagem PIX */}
                  {installmentOptions.length > 0 && (
                    <div className="flex justify-between items-center">
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Método
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            theme === "dark"
                              ? "bg-green-900/30 text-green-400"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          Sem juros
                        </span>
                      </div>
                    </div>
                  )}

                  <hr
                    className={`${
                      theme === "dark" ? "border-gray-600" : "border-gray-200"
                    }`}
                  />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      Total
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(selectedService.pricing.yourPrice)}
                    </span>
                  </div>

                  {/* Economia vs Cartão */}
                  {installmentOptions.length > 0 &&
                    (() => {
                      const highestInstallmentOption = installmentOptions.find(
                        (opt) => opt.installments > 1
                      );
                      if (
                        highestInstallmentOption &&
                        highestInstallmentOption.totalAmount >
                          selectedService.pricing.yourPrice
                      ) {
                        const savings =
                          highestInstallmentOption.totalAmount -
                          selectedService.pricing.yourPrice;
                        return (
                          <div
                            className={`${
                              theme === "dark"
                                ? "bg-green-900/30 border-green-700"
                                : "bg-green-50 border-green-200"
                            } border rounded-lg p-3 mt-3`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  %
                                </span>
                              </div>
                              <div>
                                <p
                                  className={`text-xs font-medium ${
                                    theme === "dark"
                                      ? "text-green-400"
                                      : "text-green-800"
                                  }`}
                                >
                                  Economize{" "}
                                  {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(savings)}
                                </p>
                                <p
                                  className={`text-xs ${
                                    theme === "dark"
                                      ? "text-green-300"
                                      : "text-green-600"
                                  }`}
                                >
                                  comparado ao parcelamento
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                  {/* Badge do método */}
                  <div className="flex justify-center pt-2">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        theme === "dark"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      <QrCode size={12} />
                      PIX - Instantâneo
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Formulário Cartão com cartão 3D */}
      {selectedMethod === "CREDIT_CARD" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div
            className={`${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <CreditCardIcon size={24} className="text-blue-600" />
              <h4
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Cartão de Crédito
              </h4>
            </div>

            <form className="space-y-6">
              {/* Número do cartão */}
              <div>
                <label
                  htmlFor="cardNumber"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Número do cartão <span className="text-red-500">*</span>
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  value={formatCardNumber(cardForm.watch("cardNumber") || "")}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    const cleanNumber = formatted.replace(/\s/g, "");
                    cardForm.setValue("cardNumber", cleanNumber, {
                      shouldValidate: true,
                    });
                    setTimeout(notifyChange, 100);
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    cardForm.formState.errors.cardNumber
                      ? "border-red-500"
                      : theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
                {cardForm.formState.errors.cardNumber && (
                  <span className="text-sm text-red-500 mt-1">
                    {cardForm.formState.errors.cardNumber.message}
                  </span>
                )}
              </div>

              {/* Nome do portador */}
              <div>
                <label
                  htmlFor="cardHolder"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Nome do portador <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User
                    size={20}
                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <input
                    id="cardHolder"
                    type="text"
                    placeholder="Nome como está no cartão"
                    value={cardForm.watch("cardHolder") || ""}
                    onChange={(e) => {
                      cardForm.setValue(
                        "cardHolder",
                        e.target.value.toUpperCase(),
                        {
                          shouldValidate: true,
                        }
                      );
                      setTimeout(notifyChange, 100);
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      cardForm.formState.errors.cardHolder
                        ? "border-red-500"
                        : theme === "dark"
                        ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                </div>
                {cardForm.formState.errors.cardHolder && (
                  <span className="text-sm text-red-500 mt-1">
                    {cardForm.formState.errors.cardHolder.message}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Data de expiração */}
                <div>
                  <label
                    htmlFor="expiryDate"
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Validade <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar
                      size={20}
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <input
                      id="expiryDate"
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      value={formatExpiryDate(
                        cardForm.watch("expiryDate") || ""
                      )}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value);
                        cardForm.setValue("expiryDate", formatted, {
                          shouldValidate: true,
                        });
                        setTimeout(notifyChange, 100);
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        cardForm.formState.errors.expiryDate
                          ? "border-red-500"
                          : theme === "dark"
                          ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    />
                  </div>
                  {cardForm.formState.errors.expiryDate && (
                    <span className="text-sm text-red-500 mt-1">
                      {cardForm.formState.errors.expiryDate.message}
                    </span>
                  )}
                </div>

                {/* CVV */}
                <div>
                  <label
                    htmlFor="cvv"
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    CVV <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cvv"
                    type="text"
                    placeholder="000"
                    maxLength={4}
                    value={cardForm.watch("cvv") || ""}
                    onFocus={() => setIsCardFlipped(true)}
                    onBlur={() => setIsCardFlipped(false)}
                    onChange={(e) => {
                      cardForm.setValue("cvv", e.target.value, {
                        shouldValidate: true,
                      });
                      setTimeout(notifyChange, 100);
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      cardForm.formState.errors.cvv
                        ? "border-red-500"
                        : theme === "dark"
                        ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                        : "border-gray-300 bg-white text-gray-900"
                    }`}
                  />
                  {cardForm.formState.errors.cvv && (
                    <span className="text-sm text-red-500 mt-1">
                      {cardForm.formState.errors.cvv.message}
                    </span>
                  )}
                </div>
              </div>

              {/* CPF do portador */}
              <div>
                <label
                  htmlFor="cardCpf"
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  CPF/CNPJ do portador <span className="text-red-500">*</span>
                </label>
                <input
                  id="cardCpf"
                  type="text"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  maxLength={18}
                  value={applyCPFCNPJMask(cardForm.watch("cpf") || "")}
                  onChange={(e) => {
                    const maskedValue = applyCPFCNPJMask(e.target.value);
                    const cleanCPF = maskedValue.replace(/\D/g, "");

                    cardForm.setValue("cpf", cleanCPF, {
                      shouldValidate: true,
                    });
                    setTimeout(notifyChange, 150);
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    cardForm.formState.errors.cpf
                      ? "border-red-500"
                      : theme === "dark"
                      ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400"
                      : "border-gray-300 bg-white text-gray-900"
                  }`}
                />
                {cardForm.formState.errors.cpf && (
                  <span className="text-sm text-red-500 mt-1">
                    {cardForm.formState.errors.cpf.message}
                  </span>
                )}
              </div>

              {/* Seleção de parcelas */}
              {selectedService && installmentOptions.length > 0 && (
                <div>
                  <label
                    htmlFor="installments"
                    className={`block text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Parcelamento
                  </label>
                  <div className="relative">
                    <CreditCard
                      size={20}
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        theme === "dark" ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                    <select
                      id="installments"
                      value={selectedInstallments}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setSelectedInstallments(value);
                        cardForm.setValue("installments", value, {
                          shouldValidate: true,
                        });
                        setTimeout(notifyChange, 100);
                      }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none ${
                        theme === "dark"
                          ? "border-gray-600 bg-gray-700 text-gray-200"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                    >
                      {installmentOptions.map((option) => (
                        <option
                          key={option.installments}
                          value={option.installments}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {/* Seta customizada para o select */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-gray-500" : "text-gray-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Informações da parcela selecionada */}
                  {selectedInstallments > 1 && (
                    <div
                      className={`mt-2 p-3 border rounded-lg ${
                        theme === "dark"
                          ? "bg-blue-900/30 border-blue-700"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={`${
                            theme === "dark" ? "text-blue-400" : "text-blue-800"
                          }`}
                        >
                          {selectedInstallments}x de{" "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(
                            installmentOptions.find(
                              (opt) => opt.installments === selectedInstallments
                            )?.installmentValue || 0
                          )}
                        </span>
                        <span
                          className={`${
                            theme === "dark" ? "text-blue-300" : "text-blue-600"
                          }`}
                        >
                          Total:{" "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(
                            installmentOptions.find(
                              (opt) => opt.installments === selectedInstallments
                            )?.totalAmount || 0
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Loading de parcelas */}
              {isLoadingInstallments && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span
                    className={`ml-2 text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Carregando opções de parcelamento...
                  </span>
                </div>
              )}

              <div
                className={`${
                  theme === "dark"
                    ? "bg-blue-900/30 border-blue-700"
                    : "bg-blue-50 border-blue-200"
                } border rounded-lg p-4`}
              >
                <div className="flex items-start gap-3">
                  <Lock size={20} className="text-blue-600" />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-blue-400" : "text-blue-800"
                      }`}
                    >
                      Pagamento Seguro
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        theme === "dark" ? "text-blue-300" : "text-blue-600"
                      }`}
                    >
                      Seus dados são protegidos com criptografia SSL. O
                      pagamento será processado de forma segura.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Cartão 3D Interativo e Resumo */}
          <div className="flex flex-col gap-10 py-5">
            <div className="flex justify-center">
              <InteractiveCard
                cardData={cardForm.watch()}
                isFlipped={isCardFlipped}
              />
            </div>

            {/* Resumo Compacto - Apenas para cartão */}
            {selectedService && (
              <div
                className={`${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                } border rounded-lg p-4 shadow-sm`}
              >
                <h4
                  className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  <CreditCard size={16} className="text-blue-600" />
                  Resumo
                </h4>

                <div className="space-y-3 text-sm">
                  {/* Serviço */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {selectedService.name}
                    </span>
                    <span
                      className={`font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-900"
                      }`}
                    >
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(selectedService.pricing.yourPrice)}
                    </span>
                  </div>

                  {/* Parcelamento */}
                  {selectedInstallments > 1 && (
                    <div className="flex justify-between items-center">
                      <span
                        className={`${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {selectedInstallments}x no cartão
                      </span>
                      <span
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(
                          installmentOptions.find(
                            (opt) => opt.installments === selectedInstallments
                          )?.installmentValue || 0
                        )}
                        /mês
                      </span>
                    </div>
                  )}

                  <hr
                    className={`${
                      theme === "dark" ? "border-gray-600" : "border-gray-200"
                    }`}
                  />

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      Total
                    </span>
                    <span className="font-bold text-green-600 text-lg">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(
                        selectedInstallments > 1
                          ? installmentOptions.find(
                              (opt) => opt.installments === selectedInstallments
                            )?.totalAmount || selectedService.pricing.yourPrice
                          : selectedService.pricing.yourPrice
                      )}
                    </span>
                  </div>

                  {/* Badge do método */}
                  <div className="flex justify-center pt-2">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        theme === "dark"
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <CreditCard size={12} />
                      Cartão - Seguro
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
