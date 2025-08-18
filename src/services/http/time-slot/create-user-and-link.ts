import { api } from "@/services/api";

interface CreateUserAndLinkProps {
  reservationId: string;
  body: {
    name: string;
    email: string;
    phone: string;
    document: string;
    avatarFile?: File;
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
      avatar?: string | null;
    };
    userCreated: boolean;
  };
  message: string;
}

export const createUserAndLink = async (userData: CreateUserAndLinkProps) => {
  // Se há arquivo de avatar, usar FormData
  if (userData.body.avatarFile) {
    const formData = new FormData();
    formData.append("name", userData.body.name);
    formData.append("email", userData.body.email);
    formData.append("phone", userData.body.phone);
    formData.append("document", userData.body.document);
    formData.append("avatar", userData.body.avatarFile);

    const response = await api.post<CreateUserAndLinkResponse>(
      `/time-slots/create-user-and-link/${userData.reservationId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  } else {
    // Sem avatar, usar JSON normal
    const bodyData = {
      name: userData.body.name,
      email: userData.body.email,
      phone: userData.body.phone,
      document: userData.body.document,
    };

    const response = await api.post<CreateUserAndLinkResponse>(
      `/time-slots/create-user-and-link/${userData.reservationId}`,
      bodyData
    );

    return response.data.data;
  }
};
