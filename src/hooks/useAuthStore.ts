import { login } from "@/services/http/auth";
import { findUser } from "@/services/http/auth/find-user";
import { User } from "@/services/http/auth/login";
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

      if (!response.token) {
        throw new Error("Credenciais inválidas");
      }

      const { token, user } = response;

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

      const { user, success } = await findUser(token);

      if (!success) {
        throw new Error("Token inválido");
      }

      set({ token, user });
    } catch (error) {
      console.log(error);
      Cookies.remove("auth_token");
    } finally {
      set({ isLoading: false });
    }
  },
}));
