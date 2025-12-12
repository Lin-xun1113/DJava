import client from "@/api/client";

export interface Department {
  id: number;
  deptName: string;
  description: string;
}

export const departmentService = {
  getList: () => {
    return client.get<any, { code: number; data: Department[] }>("/department/list");
  },

  getById: (id: number) => {
    return client.get<any, { code: number; data: Department }>(`/department/${id}`);
  }
};
