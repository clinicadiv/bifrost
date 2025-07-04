import { create } from 'zustand';

type Login = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useLogin = create<Login>()((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set(() => ({ isOpen })),
}));
