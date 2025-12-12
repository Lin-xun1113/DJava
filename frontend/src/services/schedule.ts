import client from "@/api/client";

export interface Schedule {
  id: number;
  doctorId: string;
  doctorName?: string;
  deptName?: string;
  workDate: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
  bookedCount: number;
  version?: number;
}

export const scheduleService = {
  // Get available schedules for a specific date (or range)
  getAvailable: (date: string) => {
    return client.get<any, { code: number; data: Schedule[] }>("/schedule/available", { params: { date } });
  },

  // Get schedules for a specific doctor
  getDoctorSchedules: (doctorId: string, date?: string) => {
    return client.get<any, { code: number; data: Schedule[] }>(`/doctor/${doctorId}/schedule`, { params: { date } });
  },

  // Admin: Create schedule
  create: (data: Partial<Schedule>) => {
    return client.post<any, any>("/schedule", data);
  },

  // Admin: Update schedule
  update: (id: number, data: Partial<Schedule>) => {
    return client.put<any, any>(`/schedule/${id}`, data);
  },

  // Admin: Delete schedule
  delete: (id: number) => {
    return client.delete<any, any>(`/schedule/${id}`);
  }
};
