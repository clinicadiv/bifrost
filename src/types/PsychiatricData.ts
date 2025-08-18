export interface CreatePsychiatricDataDTO {
  userId: string;
  age: number;
  birthDate: string;
  psychiatricHistory: string;
  medicalHistory: string;
  continuousMedications: string;
  allergies?: string;
  addressId?: string;
  psychiatricPathologies?: string;
  diseases?: string;
  additionalInformation?: string;
  sadnessScore?: number;
  hopelessnessScore?: number;
  worryScore?: number;
  irritationScore?: number;
  tirednessScore?: number;
  insomniaScore?: number;
  hallucinationScore?: number;
}

export interface CreatePsychiatricDataResponse {
  success: boolean;
  data: {
    id: string;
    userId: string;
    createdAt: string;
  };
}

export interface GetPsychiatricDataResponse {
  success: boolean;
  data:
    | {
        id: string;
        userId: string;
        age: string;
        birthDate: string;
        psychiatricHistory: string;
        medicalHistory: string;
        continuousMedications: string;
        allergies?: string;
        addressId?: string;
        psychiatricPathologies?: string;
        diseases?: string;
        additionalInformation?: string;
        sadnessScore?: number;
        hopelessnessScore?: number;
        worryScore?: number;
        irritationScore?: number;
        tirednessScore?: number;
        insomniaScore?: number;
        hallucinationScore?: number;
        createdAt: string;
        updatedAt: string;
      }[]
    | {
        id: string;
        userId: string;
        age: string;
        birthDate: string;
        psychiatricHistory: string;
        medicalHistory: string;
        continuousMedications: string;
        allergies?: string;
        addressId?: string;
        psychiatricPathologies?: string;
        diseases?: string;
        additionalInformation?: string;
        sadnessScore?: number;
        hopelessnessScore?: number;
        worryScore?: number;
        irritationScore?: number;
        tirednessScore?: number;
        insomniaScore?: number;
        hallucinationScore?: number;
        createdAt: string;
        updatedAt: string;
      }
    | null;
}
