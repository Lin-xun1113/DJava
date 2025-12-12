import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { appointmentService } from "@/services/appointment";
import type { Appointment } from "@/services/appointment";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

const DoctorAppointments = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Reusing getPage for now, fetching more to filter client side if needed
      // Ideally backend supports filtering by doctor ID context automatically
      const res = await appointmentService.getPage({
        pageNum: 1,
        pageSize: 100
      });
      if (res.code === 200) {
        // Client side filter just in case
        const myAppts = res.data.records.filter(a => a.doctorId === user.userId);
        // Sort by date desc
        setAppointments(myAppts.sort((a, b) => new Date(b.apptDatetime).getTime() - new Date(a.apptDatetime).getTime()));
      }
    } catch (error) {
      console.error(error);
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
          fetchAppointments();
        } else {
          toast.error(res.message || "操作失败");
        }
      } catch (error: any) {
        toast.error(error.message || "请求失败");
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">预约记录</h1>

      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>预约号</TableHead>
              <TableHead>患者</TableHead>
              <TableHead>预约时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">加载中...</TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">暂无预约记录</TableCell>
              </TableRow>
            ) : (
              appointments.map((appt) => (
                <TableRow key={appt.apptId}>
                  <TableCell className="font-mono">{appt.apptId}</TableCell>
                  <TableCell>{appt.patientName}</TableCell>
                  <TableCell>{format(parseISO(appt.apptDatetime), "yyyy-MM-dd HH:mm")}</TableCell>
                  <TableCell>
                    <Badge variant={
                      appt.status === "已完成" ? "secondary" :
                      appt.status === "已取消" ? "destructive" : "default"
                    }>
                      {appt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {appt.status === "已预约" && (
                      <Button size="sm" onClick={() => handleComplete(appt.apptId)}>
                        完成就诊
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DoctorAppointments;
