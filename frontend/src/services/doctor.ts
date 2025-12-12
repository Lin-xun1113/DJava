import client from "@/api/client";

export interface Doctor {
  doctorId: string;
  name: string;
  deptId: number;
  deptName?: string;
  specialty: string;
  status: number;
}

export interface DoctorPageResponse {
  records: Doctor[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export const doctorService = {
  // Get doctor list (for admin table or patient view)
  getPage: (params: { pageNum?: number; pageSize?: number; deptId?: number; name?: string }) => {
    return client.get<any, { code: number; data: DoctorPageResponse }>("/doctor/page", { params });
  },

  getList: (deptId?: number) => {
    return client.get<any, { code: number; data: Doctor[] }>("/doctor/list", { params: { deptId } });
  },

  getById: (doctorId: string) => {
    return client.get<any, { code: number; data: Doctor }>(`/doctor/${doctorId}`);
  },

  // Admin only
  create: (data: Partial<Doctor> & { password?: string }) => {
    return client.post<any, any>("/doctor", data);
  },

  update: (doctorId: string, data: Partial<Doctor>) => {
    return client.put<any, any>(`/doctor/${doctorId}`, data);
  }
};
