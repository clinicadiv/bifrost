export interface SingleReservation {
  medicalId: string;
  reservationDate: string;
  reservationTime: string;
}

export interface CreateMultipleReservationsDTO {
  patientId: string;
  reservations: SingleReservation[];
  durationMinutes?: number;
  serviceId?: string;
}

export interface CreateMultipleGuestReservationsDTO {
  reservations: SingleReservation[];
  durationMinutes?: number;
  serviceId?: string;
}

export interface LinkMultipleReservationsToUserDTO {
  reservationIds: string[];
  patientId: string;
}

export interface ConfirmMultipleReservationsDTO {
  reservationIds: string[];
  appointmentData?: {
    notes?: string;
    status?: string;
  };
}

export interface TimeSlotReservation {
  id: string;
  medicalId: string;
  patientId: string | null;
  reservationDate: string;
  reservationTime: string;
  status: string;
  expiresAt: string;
  serviceId?: string;
  createdAt: string;
  updatedAt: string;
  medical: {
    id: string;
    name: string;
    email: string;
  };
}
