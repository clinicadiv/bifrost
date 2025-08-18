"use client";

import { useAuthStore } from "@/hooks";
import { isPublicRoute } from "@/utils/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeSlash,
  Lock,
  SignIn,
  User,
  UserPlus,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";

const schema = z.object({
  email: z.string().email().min(1, { message: "O e-mail é obrigatório" }),
  password: z.string().min(1, { message: "A senha é obrigatória" }),
  keepConnected: z.boolean().optional(),
});

type LoginProps = z.infer<typeof schema>;

export const Login = () => {
  const { isLoginModalOpen, handleLogin, closeLoginModal } = useAuthStore();
  const pathname = usePathname();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  // Verifica se está em página pública para mostrar botão de fechar
  const isOnPublicPage = isPublicRoute(pathname);

  // Páginas que devem ter layout standalone (não mostrar modal automaticamente)
  const STANDALONE_PAGES = [
    "/criar-conta",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const isStandalonePage = STANDALONE_PAGES.some((route) =>
    pathname.startsWith(route)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
  });

  const submitForm: SubmitHandler<LoginProps> = async (data) => {
    setIsLogging(true);
    console.log(data);

    // Adiciona um pequeno delay para suavizar a transição
    setTimeout(() => {
      if (isLoginModalOpen) {
        handleLogin(data.email, data.password);
      }
      setIsLogging(false);
    }, 100);
  };

  const handleClose = () => {
    if (isOnPublicPage || isStandalonePage) {
      closeLoginModal();
    }
  };

  const handleRegisterClick = () => {
    closeLoginModal();
  };

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setIsLogging(false)}>
      {isLoginModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={isOnPublicPage || isStandalonePage ? handleClose : undefined}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{
              scale: 0.85,
              opacity: 0,
              y: -20,
              rotate: -1,
              transition: { duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] },
            }}
            transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-300/30 dark:border-slate-700/30 w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header com padrão de fundo */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-div-green/10 to-emerald-500/10 dark:from-div-green/5 dark:to-emerald-500/5"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-div-green/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full blur-2xl"></div>

              <div className="relative p-8 pb-4">
                {/* Botão de fechar - só aparece em páginas públicas ou standalone */}
                {(isOnPublicPage || isStandalonePage) && (
                  <motion.button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-transparent"
                    initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      rotate: 90,
                      transition: { duration: 0.2 },
                    }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X
                      size={18}
                      className="text-gray-700 dark:text-slate-400"
                    />
                  </motion.button>
                )}

                <motion.div
                  className="flex flex-col items-center text-center gap-4"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
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
                  }}
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-div-green to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-div-green/25 rotate-3 hover:rotate-0 transition-transform duration-300"
                    variants={{
                      hidden: { opacity: 0, scale: 0.5, rotate: -180 },
                      visible: { opacity: 1, scale: 1, rotate: 12 },
                      exit: { opacity: 0, scale: 0.3, rotate: 180 },
                    }}
                  >
                    <SignIn size={28} weight="bold" />
                  </motion.div>
                  <motion.div
                    className="mb-2"
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                      exit: { opacity: 0, x: 20 },
                    }}
                  >
                    <Image
                      src="/logo.png"
                      alt="Logo Clinica div"
                      width={148}
                      height={22}
                      className="dark:invert"
                    />
                  </motion.div>
                  <motion.div
                    className="flex flex-col items-center gap-2"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                      exit: { opacity: 0, y: -20 },
                    }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                      Bem-vindo!
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400 text-sm">
                      Coloque seus dados para acessar sua conta
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Indicador visual para páginas privadas */}
            {!isOnPublicPage && !isStandalonePage && (
              <motion.div
                className="px-8 pb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="bg-amber-50 dark:bg-amber-900/30 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-700/50"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm text-amber-700 dark:text-amber-300 text-center flex items-center justify-center gap-2">
                    <motion.span
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Lock size={16} weight="bold" />
                    </motion.span>
                    Login necessário para acessar esta página
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Formulário */}
            <motion.div
              className="px-8 pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30, transition: { duration: 0.3 } }}
              transition={{ delay: 0.6 }}
            >
              <motion.form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit(submitForm)}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.7,
                    },
                  },
                  exit: {
                    opacity: 0,
                    transition: {
                      staggerChildren: 0.05,
                      staggerDirection: -1,
                    },
                  },
                }}
              >
                <motion.div
                  className="space-y-5"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: 20 },
                  }}
                >
                  <div className="relative">
                    <Input
                      error={errors.email}
                      label="E-mail"
                      path="email"
                      register={register}
                      placeholder="Digite seu e-mail"
                      style={{ paddingLeft: "3rem" }}
                    />
                    <motion.div
                      className="absolute inset-y-0 left-4 flex items-center pointer-events-none"
                      style={{ top: "30px" }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: 0.8 }}
                    >
                      <User
                        size={18}
                        className="text-gray-400 dark:text-slate-500"
                      />
                    </motion.div>
                  </div>

                  <div className="relative">
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
                      exit={{ opacity: 0, x: -10 }}
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
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: 1.0 }}
                    >
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? (
                          <EyeSlash size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center justify-between"
                  variants={{
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.95 },
                  }}
                >
                  <Checkbox
                    path="keepConnected"
                    register={register}
                    label="Lembrar-me"
                  />
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Esqueci a senha
                  </button>
                </motion.div>

                <motion.div
                  className="space-y-4"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 },
                  }}
                >
                  <motion.button
                    type="submit"
                    disabled={isLogging}
                    className="bg-gradient-to-r from-div-green to-emerald-500 hover:from-div-green/90 hover:to-emerald-500/90 text-black rounded-xl w-full py-3 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-div-green/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLogging ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        Entrando...
                      </>
                    ) : (
                      <>
                        <SignIn size={20} weight="bold" />
                        Entrar
                      </>
                    )}
                  </motion.button>

                  {/* Botão Agendar como convidado */}
                  <Link href="/nova-consulta">
                    <motion.button
                      type="button"
                      onClick={() => closeLoginModal()}
                      className="w-full py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 font-semibold rounded-xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded-full">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-600 dark:text-blue-300"
                        >
                          <path d="M8 2v4" />
                          <path d="M16 2v4" />
                          <rect width="18" height="18" x="3" y="4" rx="2" />
                          <path d="M3 10h18" />
                          <path d="M8 14h.01" />
                          <path d="M12 14h.01" />
                          <path d="M16 14h.01" />
                          <path d="M8 18h.01" />
                          <path d="M12 18h.01" />
                        </svg>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-bold">
                          Agendar consulta como convidado
                        </span>
                      </div>
                    </motion.button>
                  </Link>

                  <motion.div
                    className="text-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-gray-600 dark:text-slate-400 text-sm flex w-full items-center justify-center gap-5">
                      Não tem uma conta?{" "}
                      <Link href="/criar-conta">
                        <motion.button
                          type="button"
                          onClick={handleRegisterClick}
                          className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <UserPlus size={16} weight="bold" />
                          Cadastre-se agora
                        </motion.button>
                      </Link>
                    </p>
                  </motion.div>
                </motion.div>
              </motion.form>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
