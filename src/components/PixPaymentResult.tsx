import { Button } from "@/components/Button";
import { CheckIcon, CopyIcon, XIcon } from "@phosphor-icons/react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface PixPaymentResultProps {
  isVisible: boolean;
  onClose: () => void;
  pixData: {
    qrCode: string;
    payload: string;
    expirationDate: string;
  };
  amount: number;
  description: string;
}

export function PixPaymentResult({
  isVisible,
  onClose,
  pixData,
  amount,
  description,
}: PixPaymentResultProps) {
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (pixData.payload) {
      QRCode.toDataURL(pixData.payload, {
        width: 320,
        margin: 4,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrCodeImage(url))
        .catch((err) => console.error(err));
    }
  }, [pixData.payload]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(pixData.payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar código PIX:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatExpirationDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-satoshi font-semibold text-gray-900">
              Pagamento PIX
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Escaneie o QR Code ou copie o código para realizar o pagamento
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content - Layout Horizontal */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - QR Code */}
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-satoshi font-bold text-primary-dark">
                  {formatCurrency(amount)}
                </div>
                <p className="text-sm text-gray-600">{description}</p>
              </div>

              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-sm">
                {qrCodeImage ? (
                  <img
                    src={qrCodeImage}
                    alt="QR Code PIX"
                    className="w-64 h-64"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Carregando QR Code...</span>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 rounded-xl p-4 w-full max-w-sm">
                <h3 className="font-satoshi font-medium text-blue-900 mb-2 text-center">
                  Como pagar:
                </h3>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Abra o app do seu banco</li>
                  <li>2. Escolha a opção PIX</li>
                  <li>3. Escaneie o QR Code</li>
                  <li>4. Confirme o pagamento</li>
                </ol>
              </div>
            </div>

            {/* Right Side - PIX Code and Info */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-satoshi font-semibold text-gray-900">
                  Código PIX (Copia e Cola)
                </h3>
                <p className="text-sm text-gray-600">
                  Você também pode copiar o código abaixo e colar no seu app
                  bancário:
                </p>

                <div className="relative">
                  <textarea
                    value={pixData.payload}
                    readOnly
                    className="w-full p-4 pr-14 border border-gray-300 rounded-xl text-xs font-mono bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-primary-dark/20"
                    rows={6}
                  />
                  <button
                    onClick={handleCopyCode}
                    className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 ${
                      copied
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
                  </button>
                </div>

                {copied && (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <CheckIcon size={16} />
                    Código copiado com sucesso!
                  </p>
                )}
              </div>

              {/* Expiration and Important Info */}
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-xl p-4">
                  <h4 className="font-satoshi font-medium text-orange-900 mb-2">
                    ⏰ Prazo de Pagamento
                  </h4>
                  <p className="text-sm text-orange-800">
                    <strong>Válido até:</strong>{" "}
                    {formatExpirationDate(pixData.expirationDate)}
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-satoshi font-medium text-green-900 mb-2">
                    ✅ Pagamento Seguro
                  </h4>
                  <p className="text-sm text-green-800">
                    Este é um pagamento PIX oficial e seguro. Após a
                    confirmação, você receberá uma confirmação por email.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="gray.dark"
                  onClick={handleCopyCode}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckIcon size={16} />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <CopyIcon size={16} />
                      Copiar Código
                    </>
                  )}
                </Button>
                <Button
                  onClick={onClose}
                  className="flex-1 flex items-center justify-center"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
