"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle,
  Envelope,
  Eye,
  EyeSlash,
  IdentificationCard,
  Lock,
  Phone,
  User,
  UserPlus,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { PageErrorBoundary } from "../../components/ErrorBoundary";
import { Input } from "../../components/Input";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useFormErrorHandler } from "../../hooks/useErrorHandler";
import { createUser } from "../../services/http/user/create-user";

const schema = z
  .object({
    name: z
      .string()
      .min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
    email: z
      .string()
      .email({ message: "Digite um e-mail válido" })
      .min(1, { message: "O e-mail é obrigatório" }),
    cpf: z
      .string()
      .min(11, { message: "Digite um CPF válido" })
      .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
        message: "Use o formato 000.000.000-00",
      }),
    phone: z
      .string()
      .min(10, { message: "Digite um telefone válido" })
      .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, {
        message: "Use o formato (00) 00000-0000",
      }),
    password: z
      .string()
      .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "A confirmação de senha é obrigatória" }),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "Você deve aceitar os termos de uso",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterProps = z.infer<typeof schema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export default function CriarConta() {
  const router = useRouter();
  const { openLoginModal, user, isLoading } = useAuthStore();
  const { processFormError, clearFormErrors } = useFormErrorHandler();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redireciona usuários autenticados para o dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterProps>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
  });

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return numbers
      .slice(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const submitForm: SubmitHandler<RegisterProps> = async (data) => {
    setIsLoadingForm(true);
    clearFormErrors();

    try {
      // Limpar formatação do CPF para enviar apenas os números
      const cleanCpf = data.cpf.replace(/\D/g, "");

      // Preparar dados para o serviço
      const userData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        document: cleanCpf,
        password: data.password,
        level: 3,
      };

      console.log("Criando usuário:", userData);

      const response = await createUser(userData);

      if (response.success) {
        setIsLoadingForm(false);
        setIsSuccess(true);

        // Após 2 segundos, redirecionar para login ou abrir modal
        setTimeout(() => {
          openLoginModal();
        }, 2000);
      } else {
        throw new Error(response.message || "Erro ao criar conta");
      }
    } catch (error) {
      setIsLoadingForm(false);
      processFormError(error, "registerForm");
    }
  };

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-div-green/10 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-div-green/30 border-t-div-green rounded-full animate-spin"></div>
      </div>
    );
  }

  // Se o usuário está logado, não renderiza nada (redirect já foi feito)
  if (user) {
    return null;
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-br from-div-green/10 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-div-green rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} weight="bold" className="text-black" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3"
          >
            Conta criada com sucesso!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-gray-600 dark:text-slate-400 mb-6"
          >
            Redirecionando para a página de login...
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="w-8 h-8 border-2 border-div-green/30 border-t-div-green rounded-full animate-spin mx-auto"
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <PageErrorBoundary pageTitle="Criar Conta">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-br from-div-green/10 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-300/30 dark:border-slate-700/30 w-full max-w-2xl overflow-hidden"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="relative bg-gradient-to-br from-div-green/10 to-emerald-500/10 dark:from-div-green/5 dark:to-emerald-500/5 p-8 pb-6"
          >
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-div-green/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full blur-2xl"></div>

            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-6 left-6"
            >
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm font-medium">Voltar</span>
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-col items-center text-center gap-4 relative"
              variants={containerVariants}
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-div-green to-emerald-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-div-green/25"
                variants={itemVariants}
                whileHover={{
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.5 },
                }}
              >
                <UserPlus size={28} weight="bold" />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Image
                  src="/logo.png"
                  alt="Logo Clinica div"
                  width={148}
                  height={22}
                  className="dark:invert"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                  Criar Conta
                </h1>
                <p className="text-gray-600 dark:text-slate-400">
                  Preencha os dados abaixo para criar sua conta
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div variants={itemVariants} className="p-8 pt-6">
            <motion.form
              onSubmit={handleSubmit(submitForm)}
              className="space-y-6"
              variants={containerVariants}
            >
              {/* Grid layout for better organization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <motion.div variants={itemVariants} className="relative">
                  <Input
                    error={errors.name}
                    label="Nome completo"
                    path="name"
                    register={register}
                    placeholder="Digite seu nome completo"
                    style={{ paddingLeft: "3rem" }}
                  />
                  <motion.div
                    className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
                    style={{ top: "30px" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <User
                      size={18}
                      className="text-gray-400 dark:text-slate-500"
                    />
                  </motion.div>
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants} className="relative">
                  <Input
                    error={errors.email}
                    label="E-mail"
                    path="email"
                    register={register}
                    placeholder="seu@email.com"
                    style={{ paddingLeft: "3rem" }}
                  />
                  <motion.div
                    className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
                    style={{ top: "30px" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Envelope
                      size={18}
                      className="text-gray-400 dark:text-slate-500"
                    />
                  </motion.div>
                </motion.div>

                {/* CPF */}
                <motion.div variants={itemVariants} className="relative">
                  <Input
                    error={errors.cpf}
                    label="CPF"
                    path="cpf"
                    register={register}
                    placeholder="000.000.000-00"
                    mask={formatCPF}
                    style={{ paddingLeft: "3rem" }}
                  />
                  <motion.div
                    className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
                    style={{ top: "30px" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <IdentificationCard
                      size={18}
                      className="text-gray-400 dark:text-slate-500"
                    />
                  </motion.div>
                </motion.div>

                {/* Telefone */}
                <motion.div variants={itemVariants} className="relative">
                  <Input
                    error={errors.phone}
                    label="Telefone"
                    path="phone"
                    register={register}
                    placeholder="(00) 00000-0000"
                    mask={formatPhone}
                    style={{ paddingLeft: "3rem" }}
                  />
                  <motion.div
                    className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
                    style={{ top: "30px" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Phone
                      size={18}
                      className="text-gray-400 dark:text-slate-500"
                    />
                  </motion.div>
                </motion.div>
              </div>

              {/* Senha - full width */}
              <motion.div variants={itemVariants} className="relative">
                <Input
                  error={errors.password}
                  label="Senha"
                  path="password"
                  register={register}
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
                />
                <motion.div
                  className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
                  style={{ top: "30px" }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Lock
                    size={18}
                    className="text-gray-400 dark:text-slate-500"
                  />
                </motion.div>
                <motion.div
                  className="absolute inset-y-0 right-4 flex items-center"
                  style={{ top: "30px" }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </motion.div>
              </motion.div>

              {/* Confirmação de senha - full width */}
              <motion.div variants={itemVariants} className="relative">
                <Input
                  error={errors.confirmPassword}
                  label="Confirmar senha"
                  path="confirmPassword"
                  register={register}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  style={{ paddingLeft: "3rem", paddingRight: "3rem" }}
                />
                <motion.div
                  className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
                  style={{ top: "30px" }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <Lock
                    size={18}
                    className="text-gray-400 dark:text-slate-500"
                  />
                </motion.div>
                <motion.div
                  className="absolute inset-y-0 right-4 flex items-center"
                  style={{ top: "30px" }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlash size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </motion.div>
              </motion.div>

              {/* Checkbox de termos */}
              <motion.div
                variants={itemVariants}
                className="flex items-start gap-3"
              >
                <input
                  {...register("acceptTerms")}
                  type="checkbox"
                  id="acceptTerms"
                  className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-div-green focus:ring-div-green focus:ring-offset-0"
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed"
                >
                  Eu aceito os{" "}
                  <a
                    href="#"
                    className="text-div-green hover:text-emerald-600 dark:text-div-green dark:hover:text-emerald-400 font-medium transition-colors"
                  >
                    termos de uso
                  </a>{" "}
                  e{" "}
                  <a
                    href="#"
                    className="text-div-green hover:text-emerald-600 dark:text-div-green dark:hover:text-emerald-400 font-medium transition-colors"
                  >
                    política de privacidade
                  </a>
                </label>
                {errors.acceptTerms && (
                  <p className="text-red-600 dark:text-red-400 text-xs">
                    {errors.acceptTerms?.message}
                  </p>
                )}
              </motion.div>

              {/* Buttons */}
              <motion.div variants={itemVariants} className="space-y-4">
                <motion.button
                  type="submit"
                  disabled={isLoadingForm}
                  className="bg-gradient-to-r from-div-green to-emerald-500 hover:from-div-green/90 hover:to-emerald-500/90 text-black rounded-xl w-full py-4 font-semibold flex items-center justify-center gap-3 shadow-lg shadow-div-green/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoadingForm ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} weight="bold" />
                      Criar Conta
                    </>
                  )}
                </motion.button>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <p className="text-gray-600 dark:text-slate-400 text-sm">
                    Já tem uma conta?{" "}
                    <button
                      type="button"
                      onClick={openLoginModal}
                      className="font-semibold text-div-green hover:text-emerald-600 dark:text-div-green dark:hover:text-emerald-400 transition-colors"
                    >
                      Faça login
                    </button>
                  </p>
                </motion.div>
              </motion.div>
            </motion.form>
          </motion.div>
        </motion.div>
      </motion.div>
    </PageErrorBoundary>
  );
}
