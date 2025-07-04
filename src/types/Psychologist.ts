export interface Psychologist {
  id: string;
  userId: string;
  userName: string;
  crp: string;
  bio: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  hiredAt: string;
  finishedAppointments: number;
  totalAppointments: number;
  specialties: string[];
  availableTimes: AvailableTime[];
}

export interface AvailableTime {
  date: string;
  times: Time[];
}

export interface Time {
  time: string;
}
