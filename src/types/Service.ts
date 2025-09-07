export interface Service {
  id: string;
  name: string;
  description: string;
  consultationType: "PSYCHOLOGICAL" | "PSYCHIATRIC";
  status: boolean;
  pricing: {
    originalPrice: number;
    finalPrice: number;
    hasDiscount: boolean;
    planInfo: {
      planName: string;
      copayAmount: number;
      remainingSessions: number;
    };
  };
}
