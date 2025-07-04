import { api } from "@/services/api";

interface CreateUserAndLinkProps {
  reservationId: string;
  body: {
    name: string;
    email: string;
    phone: string;
  };
}

interface CreateUserAndLinkResponse {
  success: boolean;
  data: {
    reservation: {
      id: string;
      medicalId: string;
      patientId: string;
      reservationDate: string;
      reservationTime: string;
      status: string;
      expiresAt: string;
      serviceId: string;
      createdAt: string;
      updatedAt: string;
    };
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
    userCreated: boolean;
  };
  message: string;
}

export const createUserAndLink = async (userData: CreateUserAndLinkProps) => {
  const response = await api.post<CreateUserAndLinkResponse>(
    `/time-slots/create-user-and-link/${userData.reservationId}`,
    userData.body
  );

  return response.data.data;
};
