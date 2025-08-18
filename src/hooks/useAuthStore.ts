import { login } from "@/services/http/auth";
import { findUser } from "@/services/http/auth/find-user";
import { User } from "@/services/http/auth/login";
import { updateUser } from "@/services/http/user";
import { delay } from "@/utils";
import Cookies from "js-cookie";
import { create } from "zustand";

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  handleLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUserData: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: true,
  isLoginModalOpen: false,
  token: "",
  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  handleLogin: async (email: string, password: string) => {
    try {
      const response = await login({
        email,
        password,
      });

      if (!response.success || !response.data.token) {
        throw new Error("Credenciais inválidas");
      }

      const { token, user } = response.data;

      Cookies.set("auth_token", token, {
        expires: 15,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      set({ user, token });
      get().closeLoginModal();
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    Cookies.remove("auth_token");
    set({ user: null });
    set({ token: null });
    get().openLoginModal();
  },

  checkAuth: async () => {
    try {
      await delay(2000);

      const token = Cookies.get("auth_token");

      if (!token) {
        set({ isLoading: false });
        return;
      }

      const response = await findUser(token);

      if (!response.success) {
        throw new Error("Token inválido");
      }

      set({ token, user: response.data.user });
    } catch (error) {
      console.log(error);
      Cookies.remove("auth_token");
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserData: async (data: Partial<User>) => {
    try {
      const { user, token } = get();

      if (!user || !token) {
        throw new Error("Usuário não autenticado");
      }

      // Mapear os dados do User para UpdateUserDTO
      const updateData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        document: data.document || undefined,
        whatsappPhone: data.whatsappPhone,
        whatsapp: Boolean(data.whatsapp),
        avatar: data.avatar,
      };

      const response = await updateUser(user.id, updateData, token);

      if (response.success) {
        // Mapear os dados da resposta para o formato correto do User
        const updatedUser: User = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          document: response.data.user.document,
          agreement: response.data.user.agreement,
          phone: response.data.user.phone,
          whatsapp: Boolean(response.data.user.whatsapp),
          whatsappPhone: response.data.user.whatsappPhone || "",
          level: response.data.user.level,
          avatar: response.data.user.avatar,
          plan: response.data.user.plan || null,
        };

        set({ user: updatedUser });
      } else {
        throw new Error("Erro ao atualizar usuário");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  },
}));
