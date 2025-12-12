import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { appointmentService } from "@/services/appointment";
import type { Appointment } from "@/services/appointment";
import { scheduleService } from "@/services/schedule";
import type { Schedule } from "@/services/schedule";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<Schedule | null>(null);
  const [stats, setStats] = useState({
    todayCount: 0,
    pendingCount: 0,
    finishedCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      
      // 1. Get today's schedule
      const scheduleRes = await scheduleService.getDoctorSchedules(user.userId, today);
      if (scheduleRes.code === 200 && scheduleRes.data.length > 0) {
        setTodaySchedule(scheduleRes.data[0]);
      }

      // 2. Get appointments (we need an API to get doctor's appointments, reusing page API for now)
      // Note: Ideally backend should provide a dedicated endpoint or we filter
      const apptRes = await appointmentService.getPage({
        pageNum: 1,
        pageSize: 100, // Fetch enough for today
        startDate: today,
        endDate: today,
        // We assume backend filters by doctor if user is doctor, or we pass doctorId if API supports
        // Since the current API definition in FRONTEND_DEVELOPMENT.md doesn't explicitly show doctorId param for getPage,
        // we might rely on backend context or client-side filtering if getPage returns all.
        // Let's assume getPage filters by context for Doctor role or we might need to update API.
        // For now, let's assume we get data and filter locally just in case.
      });

      if (apptRes.code === 200) {
        // Filter for this doctor just to be safe
        const myAppts = apptRes.data.records.filter(a => a.doctorId === user.userId);
        setAppointments(myAppts);
        
        setStats({
          todayCount: myAppts.length,
          pendingCount: myAppts.filter(a => a.status === "已预约").length,
          finishedCount: myAppts.filter(a => a.status === "已完成").length
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("获取数据失败");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (apptId: string) => {
    if (confirm("确认该患者已完成就诊？")) {
      try {
        const res = await appointmentService.complete(apptId);
        if (res.code === 200) {
          toast.success("操作成功");
          fetchData(); // Refresh
        } else {
          toast.error(res.message || "操作失败");
        }
      } catch (error: any) {
        toast.error(error.message || "请求失败");
      }
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">医生工作台</h1>
        <p className="text-slate-500">欢迎回来，{user?.name}医生。今天是 {format(new Date(), "yyyy年MM月dd日")}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日预约总量</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCount}</div>
            <p className="text-xs text-muted-foreground">
              {todaySchedule ? `排班容量: ${todaySchedule.maxPatients}` : "今日无排班"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待接诊</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.pendingCount}</div>
            <p className="text-xs text-muted-foreground">请及时处理</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.finishedCount}</div>
            <p className="text-xs text-muted-foreground">辛苦了！</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>待接诊列表</CardTitle>
          <CardDescription>今日待处理的预约患者</CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.filter(a => a.status === "已预约").length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-20" />
              <p>暂无待接诊患者</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments
                .filter(a => a.status === "已预约")
                .map((appt) => (
                <div key={appt.apptId} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {appt.patientName?.[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{appt.patientName}</h3>
                      <p className="text-sm text-slate-500">
                        预约号: {appt.apptId} · 时间: {format(parseISO(appt.apptDatetime), "HH:mm")}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => handleComplete(appt.apptId)}>
                    完成就诊
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
