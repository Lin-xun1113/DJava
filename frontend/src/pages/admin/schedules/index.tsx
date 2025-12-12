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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { scheduleService } from "@/services/schedule";
import type { Schedule } from "@/services/schedule";
import { doctorService } from "@/services/doctor";
import type { Doctor } from "@/services/doctor";
import { Search, Plus, Trash2, FileUp, Download } from "lucide-react";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import client from "@/api/client";

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [searchDate, setSearchDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchDoctorId, setSearchDoctorId] = useState<string>("all");
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Schedule>>({
    workDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    startTime: "08:00:00",
    endTime: "12:00:00",
    maxPatients: 20
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [searchDate, searchDoctorId]); // Auto fetch when filter changes

  const fetchDoctors = async () => {
    try {
      const res = await doctorService.getList();
      if (res.code === 200) {
        setDoctors(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      let res;
      if (searchDoctorId !== "all") {
        // Fetch by doctor
        res = await scheduleService.getDoctorSchedules(searchDoctorId, searchDate);
      } else {
        // Fetch by date
        res = await scheduleService.getAvailable(searchDate);
      }

      if (res.code === 200) {
        setSchedules(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这个排班吗？")) {
      try {
        await scheduleService.delete(id);
        toast.success("删除成功");
        fetchSchedules();
      } catch (error) {
        toast.error("删除失败");
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await scheduleService.create(formData);
      toast.success("排班创建成功");
      setIsDialogOpen(false);
      fetchSchedules();
    } catch (error: any) {
      toast.error(error.message || "创建失败");
    }
  };

  const handleExportTemplate = () => {
    window.location.href = "/api/admin/template/schedule";
  };
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Direct axios call for file upload
      const res = await client.post("/admin/schedule/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const result = res as any;
      if (result.code === 200) {
        toast.success(`导入成功：成功 ${result.data.success} 条，失败 ${result.data.failed} 条`);
        fetchSchedules();
      } else {
        toast.error(result.message || "导入失败");
      }
    } catch (error) {
      toast.error("导入请求失败");
    } finally {
       // Reset input
       e.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">排班管理</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportTemplate}>
            <Download className="mr-2 h-4 w-4" /> 下载模板
          </Button>
          <div className="relative">
            <Button variant="outline" className="relative cursor-pointer">
              <FileUp className="mr-2 h-4 w-4" /> 批量导入
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept=".xlsx, .xls"
                onChange={handleImport}
              />
            </Button>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> 添加排班
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-2">
           <Label htmlFor="date">日期：</Label>
           <Input 
             id="date" 
             type="date" 
             className="w-40"
             value={searchDate}
             onChange={(e) => setSearchDate(e.target.value)}
           />
        </div>
        
        <div className="flex items-center gap-2">
          <Label>医生：</Label>
          <Select value={searchDoctorId} onValueChange={setSearchDoctorId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="选择医生" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">所有医生</SelectItem>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.doctorId} value={doctor.doctorId}>
                  {doctor.name} - {doctor.deptName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={fetchSchedules} variant="secondary">
          <Search className="h-4 w-4 mr-2" />
          查询
        </Button>
      </div>

      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>医生姓名</TableHead>
              <TableHead>科室</TableHead>
              <TableHead>日期</TableHead>
              <TableHead>时段</TableHead>
              <TableHead>已预约/总数</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">加载中...</TableCell>
              </TableRow>
            ) : schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">该条件下暂无排班</TableCell>
              </TableRow>
            ) : (
              schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.id}</TableCell>
                  <TableCell>{schedule.doctorName}</TableCell>
                  <TableCell>{schedule.deptName}</TableCell>
                  <TableCell>{schedule.workDate}</TableCell>
                  <TableCell>{schedule.startTime} - {schedule.endTime}</TableCell>
                  <TableCell>
                    <span className={schedule.bookedCount >= schedule.maxPatients ? "text-red-500 font-bold" : "text-green-600"}>
                      {schedule.bookedCount}
                    </span>
                    <span className="text-slate-400 mx-1">/</span>
                    {schedule.maxPatients}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(schedule.id)}
                      disabled={schedule.bookedCount > 0} // Cannot delete if booked
                      title={schedule.bookedCount > 0 ? "已有预约，不可删除" : "删除"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加排班</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">医生</Label>
                <Select 
                  value={formData.doctorId} 
                  onValueChange={(val) => setFormData(prev => ({ ...prev, doctorId: val }))}
                  required
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择医生" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.doctorId} value={doctor.doctorId}>
                        {doctor.name} ({doctor.deptName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">日期</Label>
                <Input 
                  type="date"
                  value={formData.workDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, workDate: e.target.value }))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">开始时间</Label>
                <Input 
                  type="time"
                  step="1"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">结束时间</Label>
                <Input 
                  type="time"
                  step="1"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">最大人数</Label>
                <Input 
                  type="number"
                  min="1"
                  value={formData.maxPatients}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPatients: parseInt(e.target.value) }))}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
              <Button type="submit">创建排班</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduleManagement;
