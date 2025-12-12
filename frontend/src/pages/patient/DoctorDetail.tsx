import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Stethoscope, Clock, Calendar as CalendarIcon, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { doctorService } from "@/services/doctor";
import type { Doctor } from "@/services/doctor";
import { scheduleService } from "@/services/schedule";
import type { Schedule } from "@/services/schedule";
import { appointmentService } from "@/services/appointment";
import { useAuthStore } from "@/store/auth";
import { format, parseISO, isSameDay } from "date-fns";
import { zhCN } from "date-fns/locale";
import { toast } from "sonner";

const DoctorDetail = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (doctorId) {
      fetchDoctorAndSchedules(doctorId);
    }
  }, [doctorId]);

  const fetchDoctorAndSchedules = async (id: string) => {
    setLoading(true);
    try {
      const [doctorRes, scheduleRes] = await Promise.all([
        doctorService.getById(id),
        scheduleService.getDoctorSchedules(id)
      ]);

      if (doctorRes.code === 200) {
        setDoctor(doctorRes.data);
      }
      if (scheduleRes.code === 200) {
        setSchedules(scheduleRes.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("获取医生信息失败");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("请先登录");
      navigate("/login", { state: { from: `/doctor/${doctorId}` } });
      return;
    }

    if (!selectedSchedule) return;

    if (user.userType !== "patient") {
      toast.error("只有患者账号可以预约挂号");
      return;
    }

    if (confirm(`确定要预约 ${format(parseISO(selectedSchedule.workDate), "MM月dd日")} ${selectedSchedule.startTime}-${selectedSchedule.endTime} 的号源吗？`)) {
      setBookingLoading(true);
      try {
        // Build appointment datetime from schedule date and start time
        const apptDatetime = `${selectedSchedule.workDate}T${selectedSchedule.startTime}`;
        
        const res = await appointmentService.book({
          patientId: user.userId,
          doctorId: doctorId!,
          scheduleId: selectedSchedule.id,
          apptDatetime: apptDatetime
        });

        if (res.code === 200) {
          toast.success("预约成功！");
          navigate("/patient/appointments");
        } else {
          toast.error(res.message || "预约失败");
        }
      } catch (error: any) {
        toast.error(error.message || "预约请求失败");
      } finally {
        setBookingLoading(false);
      }
    }
  };

  // Filter schedules for the selected date
  const daySchedules = schedules.filter(s => 
    selectedDate && isSameDay(parseISO(s.workDate), selectedDate)
  );

  if (loading) {
    return <div className="p-8 text-center">加载中...</div>;
  }

  if (!doctor) {
    return <div className="p-8 text-center">未找到医生信息</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Doctor Info Card */}
      <Card className="border-none shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shrink-0">
              <Stethoscope className="h-12 w-12" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{doctor.name}</h1>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/20">
                  {doctor.deptName}
                </span>
              </div>
              <p className="text-blue-100 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> 飞马星球医院 · 专家门诊
              </p>
              <div className="pt-4">
                <h3 className="font-semibold mb-1 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> 擅长领域
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed max-w-2xl">
                  {doctor.specialty || "暂无详细介绍"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Calendar Column */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              选择日期
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
             {/* Using simple date input for now if Calendar component is complex to setup, 
                 but creating a Calendar component wrapper is better. 
                 Let's stick to a simple list of available dates for robustness first, 
                 or just use the shadcn Calendar if available. 
                 Since I didn't create Calendar component yet, I'll implement a simple list of available dates.
              */}
              <div className="w-full space-y-2">
                <p className="text-sm text-slate-500 mb-2">未来7天排班：</p>
                <div className="grid grid-cols-2 gap-2">
                  {/* Extract unique dates from schedules */}
                  {Array.from(new Set(schedules.map(s => s.workDate))).sort().slice(0, 14).map(dateStr => {
                     const date = parseISO(dateStr);
                     const isSelected = selectedDate && isSameDay(date, selectedDate);
                     return (
                       <button
                         key={dateStr}
                         onClick={() => setSelectedDate(date)}
                         className={`p-2 rounded-md text-sm border transition-colors ${
                           isSelected 
                             ? "bg-blue-600 text-white border-blue-600" 
                             : "bg-white hover:bg-slate-50 border-slate-200"
                         }`}
                       >
                         <div className="font-medium">{format(date, "MM-dd")}</div>
                         <div className="text-xs opacity-80">{format(date, "EEEE", { locale: zhCN })}</div>
                       </button>
                     );
                  })}
                  {schedules.length === 0 && (
                    <div className="col-span-2 text-center py-4 text-slate-400 text-sm">
                      暂无排班
                    </div>
                  )}
                </div>
              </div>
          </CardContent>
        </Card>

        {/* Schedule Slots Column */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              选择时段
            </CardTitle>
            <CardDescription>
              {selectedDate ? format(selectedDate, "yyyy年MM月dd日 EEEE", { locale: zhCN }) : "请选择日期"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {daySchedules.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {daySchedules.map((schedule) => {
                  const isFull = schedule.bookedCount >= schedule.maxPatients;
                  const isSelected = selectedSchedule?.id === schedule.id;

                  return (
                    <div
                      key={schedule.id}
                      onClick={() => !isFull && setSelectedSchedule(schedule)}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all cursor-pointer
                        ${isFull 
                          ? "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed" 
                          : isSelected
                            ? "bg-blue-50 border-blue-600 shadow-sm"
                            : "bg-white border-slate-100 hover:border-blue-300 hover:shadow-sm"
                        }
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-lg text-slate-900">
                          {schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}
                        </div>
                        {isFull ? (
                          <span className="bg-slate-200 text-slate-500 text-xs px-2 py-1 rounded-full font-medium">
                            已满
                          </span>
                        ) : (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            schedule.maxPatients - schedule.bookedCount < 5 
                              ? "bg-amber-100 text-amber-700" 
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            余号 {schedule.maxPatients - schedule.bookedCount}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500">
                        总号源: {schedule.maxPatients}
                      </div>
                      
                      {isSelected && (
                        <div className="absolute -top-3 -right-3 bg-blue-600 text-white rounded-full p-1 shadow-md">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>该日期暂无排班计划</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t flex justify-end">
               <div className="flex items-center gap-4">
                 {selectedSchedule && (
                   <div className="text-right mr-2">
                     <div className="text-sm text-slate-500">已选择</div>
                     <div className="font-bold text-blue-600">
                       {format(parseISO(selectedSchedule.workDate), "MM-dd")} {selectedSchedule.startTime.slice(0, 5)}
                     </div>
                   </div>
                 )}
                 <Button 
                   size="lg" 
                   className="px-8" 
                   disabled={!selectedSchedule || bookingLoading}
                   onClick={handleBooking}
                 >
                   {bookingLoading ? "提交中..." : "确认预约"}
                 </Button>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDetail;
