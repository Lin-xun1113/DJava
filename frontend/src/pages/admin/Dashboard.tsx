import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Building2
} from "lucide-react";
import { doctorService } from "@/services/doctor";
import { departmentService } from "@/services/department";
import { appointmentService } from "@/services/appointment";
import { format } from "date-fns";

interface Stats {
  totalDoctors: number;
  totalDepartments: number;
  todayAppointments: number;
  completedToday: number;
  cancelledToday: number;
  pendingToday: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalDoctors: 0,
    totalDepartments: 0,
    todayAppointments: 0,
    completedToday: 0,
    cancelledToday: 0,
    pendingToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      
      const [doctorRes, deptRes, apptRes] = await Promise.all([
        doctorService.getPage({ pageNum: 1, pageSize: 1 }),
        departmentService.getList(),
        appointmentService.getPage({ 
          pageNum: 1, 
          pageSize: 10, 
          startDate: today, 
          endDate: today 
        })
      ]);

      const appointments = apptRes.code === 200 ? apptRes.data.records : [];
      
      setStats({
        totalDoctors: doctorRes.code === 200 ? doctorRes.data.total : 0,
        totalDepartments: deptRes.code === 200 ? deptRes.data.length : 0,
        todayAppointments: apptRes.code === 200 ? apptRes.data.total : 0,
        completedToday: appointments.filter((a: any) => a.status === "已完成").length,
        cancelledToday: appointments.filter((a: any) => a.status === "已取消").length,
        pendingToday: appointments.filter((a: any) => a.status === "已预约").length
      });
      
      setRecentAppointments(appointments.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: "医生总数", 
      value: stats.totalDoctors, 
      icon: Users, 
      color: "bg-blue-500",
      link: "/admin/doctors"
    },
    { 
      title: "科室数量", 
      value: stats.totalDepartments, 
      icon: Building2, 
      color: "bg-purple-500",
      link: "/admin/doctors"
    },
    { 
      title: "今日预约", 
      value: stats.todayAppointments, 
      icon: Calendar, 
      color: "bg-green-500",
      link: "/admin/appointments"
    },
    { 
      title: "待就诊", 
      value: stats.pendingToday, 
      icon: Clock, 
      color: "bg-amber-500",
      link: "/admin/appointments"
    },
  ];

  const quickActions = [
    { title: "医生管理", desc: "添加、编辑医生信息", icon: Users, link: "/admin/doctors" },
    { title: "排班管理", desc: "设置医生出诊时间", icon: Calendar, link: "/admin/schedules" },
    { title: "预约管理", desc: "查看所有预约记录", icon: FileText, link: "/admin/appointments" },
    { title: "报表中心", desc: "生成统计报表", icon: TrendingUp, link: "/admin/reports" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">管理员工作台</h1>
          <p className="text-slate-500">欢迎回来，这是今天的概览</p>
        </div>
        <p className="text-sm text-slate-500">
          {format(new Date(), "yyyy年MM月dd日 EEEE")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {loading ? "-" : stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">今日预约状态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <span className="text-slate-700">待就诊</span>
                </div>
                <span className="text-xl font-bold text-amber-600">{stats.pendingToday}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-slate-700">已完成</span>
                </div>
                <span className="text-xl font-bold text-green-600">{stats.completedToday}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-slate-700">已取消</span>
                </div>
                <span className="text-xl font-bold text-red-600">{stats.cancelledToday}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">快捷操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.link}>
                  <div className="p-4 border rounded-lg hover:bg-slate-50 hover:border-blue-200 transition-colors cursor-pointer group">
                    <action.icon className="h-6 w-6 text-blue-600 mb-2" />
                    <h3 className="font-medium text-slate-900 group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">最近预约</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/appointments" className="flex items-center gap-1">
              查看全部 <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentAppointments.length > 0 ? (
            <div className="space-y-3">
              {recentAppointments.map((appt) => (
                <div key={appt.apptId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">
                        {appt.patientName || appt.patientId}
                      </p>
                      <p className="text-sm text-slate-500">
                        {appt.doctorName} · {appt.deptName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {appt.apptDatetime?.split("T")[1]?.slice(0, 5) || "-"}
                    </p>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                      appt.status === "已完成" ? "bg-green-100 text-green-700" :
                      appt.status === "已取消" ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>今日暂无预约记录</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
