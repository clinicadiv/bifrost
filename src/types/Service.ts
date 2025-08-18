export interface Service {
  id: string;
  name: string;
  description: string;
  consultationType: "PSYCHOLOGICAL" | "PSYCHIATRIC";
  pricing: {
    originalPrice: number;
    yourPrice: number;
    savings: number;
  };
  status: boolean;
}
