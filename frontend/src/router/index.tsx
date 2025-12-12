import { createBrowserRouter } from "react-router-dom";
import PortalLayout from "@/components/layout/PortalLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import NotFound from "@/pages/NotFound";
import DepartmentList from "@/pages/patient/DepartmentList";
import DoctorList from "@/pages/patient/DoctorList";
import DoctorDetail from "@/pages/patient/DoctorDetail";
import MyAppointments from "@/pages/patient/MyAppointments";
import AdminDashboard from "@/pages/admin/Dashboard";
import DoctorManagement from "@/pages/admin/doctors";
import ScheduleManagement from "@/pages/admin/schedules";
import AppointmentManagement from "@/pages/admin/appointments";
import ReportCenter from "@/pages/admin/reports";

import DoctorDashboard from "@/pages/doctor/Dashboard";
import DoctorSchedule from "@/pages/doctor/MySchedule";
import DoctorAppointments from "@/pages/doctor/Appointments";

import Profile from "@/pages/patient/Profile";
import Guide from "@/pages/Guide";

export const router = createBrowserRouter([
  // Portal Routes (Public + Patient)
  {
    path: "/",
    element: <PortalLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "departments",
        element: <DepartmentList />,
      },
      {
        path: "doctors",
        element: <DoctorList />,
      },
      {
        path: "doctor/:doctorId",
        element: <DoctorDetail />,
      },
      {
        path: "patient/appointments",
        element: <MyAppointments />,
      },
      {
        path: "patient/profile",
        element: <Profile />,
      },
      {
        path: "guide",
        element: <Guide />,
      },
    ],
  },
  
  // Auth Routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Admin Routes
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "doctors",
        element: <DoctorManagement />,
      },
      {
        path: "schedules",
        element: <ScheduleManagement />,
      },
      {
        path: "appointments",
        element: <AppointmentManagement />,
      },
      {
        path: "reports",
        element: <ReportCenter />,
      },
    ],
  },

  // Doctor Routes
  {
    path: "/doctor",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <DoctorDashboard />,
      },
      {
        path: "schedule",
        element: <DoctorSchedule />,
      },
      {
        path: "appointments",
        element: <DoctorAppointments />,
      },
    ],
  },
]);
