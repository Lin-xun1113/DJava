import client from "@/api/client";

export interface Appointment {
  apptId: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  deptName?: string;
  scheduleId: number;
  apptDatetime: string;
  status: "已预约" | "已取消" | "已完成";
  cancelReason?: string;
}

export interface AppointmentPageResponse {
  records: Appointment[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export const appointmentService = {
  // Book an appointment
  book: (data: { patientId: string; doctorId: string; scheduleId: number; apptDatetime: string }) => {
    return client.post<any, { code: number; message: string; data: Appointment }>("/appointment/book", data);
  },

  // Cancel an appointment
  cancel: (apptId: string, reason?: string) => {
    return client.put<any, any>(`/appointment/${apptId}/cancel`, null, { params: { reason } });
  },

  // Get appointment details
  getDetail: (apptId: string) => {
    return client.get<any, { code: number; data: Appointment }>(`/appointment/${apptId}`);
  },

  // Get my appointments (Patient)
  getMyAppointments: (patientId: string) => {
    return client.get<any, { code: number; data: Appointment[] }>("/appointment/my", { params: { patientId } });
  },

  // Admin/Doctor: Get appointment page
  getPage: (params: { 
    pageNum?: number; 
    pageSize?: number; 
    status?: string; 
    startDate?: string; 
    endDate?: string; 
    deptId?: number;
  }) => {
    return client.get<any, { code: number; data: AppointmentPageResponse }>("/appointment/page", { params });
  },

  // Doctor: Complete appointment
  complete: (apptId: string) => {
    return client.put<any, any>(`/appointment/${apptId}/complete`);
  }
};
