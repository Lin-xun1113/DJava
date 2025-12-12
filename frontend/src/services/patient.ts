import client from "@/api/client";

export interface Patient {
  patientId: string;
  name: string;
  identityId: string;
  phone: string;
  gender: string;
  birthDate: string;
  status: number;
}

export const patientService = {
  getProfile: (patientId: string) => {
    return client.get<any, { code: number; data: Patient }>(`/patient/${patientId}`);
  },

  updateProfile: (patientId: string, data: { name?: string; phone?: string; password?: string }) => {
    return client.put<any, any>(`/patient/${patientId}`, data);
  },
};
