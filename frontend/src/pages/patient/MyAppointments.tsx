import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { appointmentService } from "@/services/appointment";
import type { Appointment } from "@/services/appointment";
import { useAuthStore } from "@/store/auth";
import { Calendar, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const MyAppointments = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      fetchAppointments(user.userId);
    }
  }, [user]);

  const fetchAppointments = async (patientId: string) => {
    try {
      const res = await appointmentService.getMyAppointments(patientId);
      if (res.code === 200) {
        // Sort by date desc
        const sorted = res.data.sort((a, b) => 
          new Date(b.apptDatetime).getTime() - new Date(a.apptDatetime).getTime()
        );
        setAppointments(sorted);
      }
    } catch (error) {
      console.error(error);
      toast.error("获取预约记录失败");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (apptId: string) => {
    if (confirm("确定要取消这个预约吗？")) {
      try {
        const res = await appointmentService.cancel(apptId);
        if (res.code === 200) {
          toast.success("预约已取消");
          fetchAppointments(user!.userId);
        } else {
          toast.error(res.message || "取消失败");
        }
      } catch (error: any) {
        toast.error(error.message || "请求失败");
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">加载中...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">我的预约</h1>
        <Button variant="outline" asChild>
          <Link to="/doctors">去挂号</Link>
        </Button>
      </div>

      {appointments.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Calendar className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg">暂无预约记录</p>
            <Button className="mt-4" asChild>
              <Link to="/doctors">立即预约医生</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appt) => {
            const date = parseISO(appt.apptDatetime);
            const isFinished = appt.status === "已完成";
            const isCancelled = appt.status === "已取消";
            const canCancel = !isFinished && !isCancelled; 

            return (
              <Card key={appt.apptId} className={`transition-all ${isCancelled ? 'opacity-70 bg-slate-50' : 'hover:border-blue-300'}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Time Box */}
                    <div className="flex flex-col items-center justify-center bg-blue-50 text-blue-700 rounded-lg p-4 w-full md:w-32 shrink-0">
                       <div className="text-2xl font-bold">{format(date, "MM-dd")}</div>
                       <div className="text-sm font-medium opacity-80">{format(date, "HH:mm")}</div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {appt.doctorName} 
                            <span className="text-sm font-normal text-slate-500 ml-2">
                              {appt.deptName}
                            </span>
                          </h3>
                          <div className="text-sm text-slate-500 flex flex-col gap-1">
                             <div className="flex items-center gap-2">
                               <MapPin className="h-3 w-3" /> 飞马星球医院 · 门诊楼
                             </div>
                             <div className="flex items-center gap-2 font-mono text-xs bg-slate-100 w-fit px-2 py-0.5 rounded">
                               预约号: {appt.apptId}
                             </div>
                          </div>
                        </div>
                        <Badge variant={isCancelled ? "destructive" : isFinished ? "secondary" : "default"}>
                          {appt.status}
                        </Badge>
                      </div>

                      {canCancel && (
                        <div className="pt-2 flex justify-end border-t mt-4">
                           <Button 
                             variant="outline" 
                             size="sm" 
                             className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                             onClick={() => handleCancel(appt.apptId)}
                           >
                             取消预约
                           </Button>
                        </div>
                      )}
                      
                      {isCancelled && appt.cancelReason && (
                         <div className="text-xs text-rose-500 bg-rose-50 p-2 rounded">
                           取消原因: {appt.cancelReason}
                         </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
