"use client";

import { useAuthStore } from "@/hooks";
import { isPublicRoute } from "@/utils/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./Button";
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

  // Verifica se está em página pública para mostrar botão de fechar
  const isOnPublicPage = isPublicRoute(pathname);

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
    console.log(data);
    handleLogin(data.email, data.password);
  };

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <>
          <motion.div
            initial={{
              y: "100%",
            }}
            animate={isLoginModalOpen ? { y: 0 } : { y: "100%" }}
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed w-screen h-screen bg-neutral-800/25 backdrop-blur-xs left-0 bottom-0 z-50"
            key="backdrop"
            onClick={isOnPublicPage ? closeLoginModal : undefined}
          />

          <motion.div
            initial={{
              y: "100%",
            }}
            animate={isLoginModalOpen ? { y: 0 } : { y: "100%" }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed left-0 bottom-0 h-[95vh] w-full bg-white rounded-t-3xl px-5 py-14 flex flex-col z-50"
            key="loginForm"
          >
            {/* Botão de fechar - só aparece em páginas públicas */}
            {isOnPublicPage && (
              <button
                onClick={closeLoginModal}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
              >
                <X size={16} className="text-gray-600" />
              </button>
            )}

            <div className="relative w-9/12 flex flex-1 bg-[#dfe0e2] mx-auto rounded-3xl">
              <div className="w-full flex-1 grid grid-cols-2">
                <div className="relative w-full flex items-center justify-center">
                  <img
                    src="/assets/bg-login.png"
                    alt=""
                    className="h-full object-center object-cover rounded-l-3xl"
                  />
                </div>

                <div className="flex-1 h-full p-5">
                  <div className="relative flex flex-col flex-1 h-full w-full rounded-3xl bg-white items-center justify-center gap-10">
                    <div className="absolute top-14">
                      <Image
                        src="/logo.png"
                        alt="Logo Clinica div"
                        width={148}
                        height={22}
                      />
                    </div>

                    <form
                      className="flex flex-col gap-5 w-full"
                      onSubmit={handleSubmit(submitForm)}
                    >
                      <div className="w-7/12 mx-auto text-center flex flex-col items-center justify-center gap-2.5">
                        <h2 className="text-4xl text-gray-800 font-sagace font-medium">
                          Bem-vindo!
                        </h2>
                        <p>Coloque seu e-mail e senha para acessar a conta</p>

                        {/* Indicador visual para páginas privadas */}
                        {!isOnPublicPage && (
                          <p className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                            ⚠️ Login necessário para acessar esta página
                          </p>
                        )}
                      </div>

                      <div className="relative flex flex-col gap-5 w-7/12 mx-auto">
                        <Input
                          error={errors.email}
                          label="E-mail"
                          path="email"
                          register={register}
                        />

                        <Input
                          error={errors.password}
                          label="Senha"
                          path="password"
                          register={register}
                          type="password"
                        />

                        <div className="absolute -bottom-10 w-full flex items-center justify-between">
                          <Checkbox
                            path="keepConnected"
                            register={register}
                            label="Lembrar-me"
                          />

                          <span className="font-medium text-neutral-400 text-sm">
                            Esqueci a senha
                          </span>
                        </div>
                      </div>

                      <div className="w-7/12 mx-auto mt-16">
                        <Button className="bg-[#BCFF00] text-black rounded-lg w-full py-4 font-medium flex items-center justify-center border-div-green">
                          Entrar
                        </Button>
                      </div>
                    </form>

                    <div className="absolute bottom-14 text-center text-neutral-700">
                      <p>
                        Não tem uma conta?{" "}
                        <span className="font-semibold">Cadastre-se agora</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
