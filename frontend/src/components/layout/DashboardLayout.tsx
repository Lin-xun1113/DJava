import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  LogOut, 
  Menu,
  X,
  Stethoscope,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";

const adminLinks = [
  { href: "/admin/dashboard", label: "工作台", icon: LayoutDashboard },
  { href: "/admin/doctors", label: "医生管理", icon: Users },
  { href: "/admin/schedules", label: "排班管理", icon: Calendar },
  { href: "/admin/appointments", label: "预约管理", icon: FileText },
  { href: "/admin/reports", label: "报表中心", icon: BarChart3 },
];

const doctorLinks = [
  { href: "/doctor/dashboard", label: "工作台", icon: LayoutDashboard },
  { href: "/doctor/schedule", label: "我的排班", icon: Calendar },
  { href: "/doctor/appointments", label: "预约管理", icon: FileText },
];

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout: storeLogout } = useAuthStore();
  
  // Determine user role from auth store
  const userRole = user?.userType;
  
  // Redirect if not authenticated or not authorized
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Check if user is accessing the right dashboard
    const isAdminRoute = location.pathname.startsWith("/admin");
    const isDoctorRoute = location.pathname.startsWith("/doctor");
    
    if (isAdminRoute && user.userType !== "admin") {
      navigate("/login");
    } else if (isDoctorRoute && user.userType !== "doctor") {
      navigate("/login");
    }
  }, [user, location.pathname, navigate]);
  
  const links = userRole === "admin" ? adminLinks : doctorLinks;

  const logout = () => {
    storeLogout();
    navigate("/login");
  };
  
  // Don't render if not authenticated
  if (!user || (user.userType !== "admin" && user.userType !== "doctor")) {
    return null;
  }

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm transition-transform duration-300 ease-in-out flex flex-col h-screen",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg text-slate-900">
              {userRole === "admin" ? "医院管理系统" : "医生工作台"}
            </span>
          </Link>
          <button 
            className="ml-auto lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 p-4 border-t bg-white">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center font-bold",
              userRole === "admin" ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"
            )}>
              {user.name?.charAt(0) || (userRole === "admin" ? "A" : "D")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">
                {userRole === "admin" ? "系统管理员" : `医生 ID: ${user.userId}`}
              </p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8 shrink-0">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1"></div>

          <div className="flex items-center gap-4">
             {/* Add header actions here if needed */}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
