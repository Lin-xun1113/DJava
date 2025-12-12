import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { scheduleService } from "@/services/schedule";
import type { Schedule } from "@/services/schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

const MySchedule = () => {
  const { user } = useAuthStore();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      fetchSchedules();
    }
  }, [user]);

  const fetchSchedules = async () => {
    if (!user) return;
    try {
      const res = await scheduleService.getDoctorSchedules(user.userId);
      if (res.code === 200) {
        // Sort by date
        setSchedules(res.data.sort((a, b) => new Date(a.workDate).getTime() - new Date(b.workDate).getTime()));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>加载中...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">我的排班</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schedules.map((schedule) => {
          const date = parseISO(schedule.workDate);
          const isToday = format(new Date(), "yyyy-MM-dd") === schedule.workDate;

          return (
            <Card key={schedule.id} className={isToday ? "border-blue-500 shadow-md" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-slate-500" />
                    {format(date, "MM月dd日")}
                    <span className="text-sm font-normal text-slate-500">
                      {format(date, "EEEE", { locale: zhCN })}
                    </span>
                  </CardTitle>
                  {isToday && (
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                      今天
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="h-4 w-4" />
                  {schedule.startTime} - {schedule.endTime}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">预约进度</span>
                    <span className="font-medium">
                      {schedule.bookedCount} / {schedule.maxPatients}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        schedule.bookedCount >= schedule.maxPatients 
                          ? "bg-red-500" 
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${Math.min((schedule.bookedCount / schedule.maxPatients) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {schedules.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 bg-slate-50 rounded-lg border border-dashed">
            暂无排班记录
          </div>
        )}
      </div>
    </div>
  );
};

export default MySchedule;
