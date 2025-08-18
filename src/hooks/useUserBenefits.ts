import { getUserBenefits } from "@/services/http/user-subscriptions/get-user-benefits";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "./useAuthStore";

export const useUserBenefits = () => {
  const { user, token } = useAuthStore();

  return useQuery({
    queryKey: ["userBenefits", user?.id],
    queryFn: () => getUserBenefits(user!.id, token!),
    enabled: !!user?.id && !!token,
  });
};
