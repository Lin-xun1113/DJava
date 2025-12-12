import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { appointmentService } from "@/services/appointment";
import type { Appointment } from "@/services/appointment";
import { departmentService } from "@/services/department";
import type { Department } from "@/services/department";
import { Search, Download, FileText } from "lucide-react";
import { format, subDays, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  
  // Filter state
  const [pageNum, setPageNum] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [deptId, setDeptId] = useState<string>("all");
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [pageNum, status, deptId]); // Refetch on filter change

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getList();
      if (res.code === 200) {
        setDepartments(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getPage({
        pageNum,
        pageSize: 10,
        status: status !== "all" ? status : undefined,
        deptId: deptId !== "all" ? Number(deptId) : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      });

      if (res.code === 200) {
        setAppointments(res.data.records);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    window.location.href = `/api/admin/appointment/export?startDate=${startDate}&endDate=${endDate}`;
  };

  const handleGenerateReport = () => {
     // Generate monthly report for current month
     const month = format(new Date(), "yyyy-MM");
     window.location.href = `/api/admin/report/monthly?month=${month}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">预约管理</h2>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleGenerateReport}>
            <FileText className="mr-2 h-4 w-4" /> 月度报表
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> 导出Excel
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
           <Label>日期范围：</Label>
           <Input 
             type="date" 
             className="w-36"
             value={startDate}
             onChange={(e) => setStartDate(e.target.value)}
           />
           <span>-</span>
           <Input 
             type="date" 
             className="w-36"
             value={endDate}
             onChange={(e) => setEndDate(e.target.value)}
           />
        </div>

        <div className="flex items-center gap-2">
          <Label>科室：</Label>
          <Select value={deptId} onValueChange={setDeptId}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="选择科室" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有科室</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={String(dept.id)}>
                  {dept.deptName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label>状态：</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="已预约">已预约</SelectItem>
              <SelectItem value="已完成">已完成</SelectItem>
              <SelectItem value="已取消">已取消</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={fetchAppointments} variant="secondary">
          <Search className="h-4 w-4 mr-2" />
          查询
        </Button>
      </div>

      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>预约号</TableHead>
              <TableHead>患者</TableHead>
              <TableHead>医生</TableHead>
              <TableHead>科室</TableHead>
              <TableHead>预约时间</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">加载中...</TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">暂无预约记录</TableCell>
              </TableRow>
            ) : (
              appointments.map((appt) => (
                <TableRow key={appt.apptId}>
                  <TableCell className="font-mono">{appt.apptId}</TableCell>
                  <TableCell>{appt.patientName} <span className="text-xs text-slate-400">({appt.patientId})</span></TableCell>
                  <TableCell>{appt.doctorName}</TableCell>
                  <TableCell>{appt.deptName}</TableCell>
                  <TableCell>{format(parseISO(appt.apptDatetime), "yyyy-MM-dd HH:mm")}</TableCell>
                  <TableCell>
                    <Badge variant={
                      appt.status === "已完成" ? "secondary" :
                      appt.status === "已取消" ? "destructive" : "default"
                    }>
                      {appt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    {/* Mock created time since API might not return it explicitly in list */}
                    -
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination (Simple) */}
      <div className="flex items-center justify-end gap-4 text-sm">
        <div>共 {total} 条</div>
        <div className="flex gap-2">
           <Button 
             variant="outline" 
             size="sm" 
             disabled={pageNum <= 1}
             onClick={() => setPageNum(p => p - 1)}
           >
             上一页
           </Button>
           <Button 
             variant="outline" 
             size="sm" 
             disabled={pageNum * 10 >= total}
             onClick={() => setPageNum(p => p + 1)}
           >
             下一页
           </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentManagement;
