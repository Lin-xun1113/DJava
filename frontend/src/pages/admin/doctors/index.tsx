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
import { doctorService } from "@/services/doctor";
import type { Doctor } from "@/services/doctor";
import { Search, Plus, Pencil, FileUp } from "lucide-react";
import { departmentService } from "@/services/department";
import type { Department } from "@/services/department";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchDeptId, setSearchDeptId] = useState<string>("all");
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Partial<Doctor> | null>(null);

  useEffect(() => {
    fetchDepartments();
    fetchDoctors();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getList();
      if (res.code === 200) {
        setDepartments(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorService.getPage({
        pageNum: 1,
        pageSize: 100, // For simplicity in this demo, fetch all
        name: searchName,
        deptId: searchDeptId !== "all" ? Number(searchDeptId) : undefined
      });
      if (res.code === 200) {
        setDoctors(res.data.records);
      }
    } catch (error) {
      console.error("Failed to fetch doctors", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchDoctors();
  };

  const handleCreate = () => {
    setEditingDoctor({});
    setIsDialogOpen(true);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;

    try {
      if (editingDoctor.doctorId && doctors.some(d => d.doctorId === editingDoctor.doctorId)) {
        // Edit existing (logic depends on whether ID is editable, usually update uses ID)
        // Here we assume editingDoctor has the original ID
        await doctorService.update(editingDoctor.doctorId, editingDoctor);
      } else {
        // Create new
        await doctorService.create(editingDoctor);
      }
      setIsDialogOpen(false);
      fetchDoctors();
    } catch (error) {
      alert("操作失败，请检查输入");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">医生管理</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" /> 批量导入
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> 添加医生
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="搜索医生姓名..." 
              className="pl-8" 
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
        </div>
        <div className="w-[200px]">
          <Select value={searchDeptId} onValueChange={setSearchDeptId}>
            <SelectTrigger>
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
        <Button onClick={handleSearch}>查询</Button>
      </div>

      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>工号</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>科室</TableHead>
              <TableHead>专长</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">加载中...</TableCell>
              </TableRow>
            ) : doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">暂无数据</TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.doctorId}>
                  <TableCell className="font-medium">{doctor.doctorId}</TableCell>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.deptName || doctor.deptId}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={doctor.specialty}>
                    {doctor.specialty}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      doctor.status === 1 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {doctor.status === 1 ? '在职' : '离职'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(doctor)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingDoctor?.doctorId ? '编辑医生' : '添加医生'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doctorId" className="text-right">工号</Label>
                <Input 
                  id="doctorId" 
                  value={editingDoctor?.doctorId || ''}
                  onChange={(e) => setEditingDoctor(prev => ({ ...prev, doctorId: e.target.value }))}
                  disabled={!!editingDoctor?.doctorId && doctors.some(d => d.doctorId === editingDoctor.doctorId)}
                  className="col-span-3"
                  placeholder="8位数字工号"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">姓名</Label>
                <Input 
                  id="name" 
                  value={editingDoctor?.name || ''}
                  onChange={(e) => setEditingDoctor(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dept" className="text-right">科室</Label>
                <Select 
                  value={String(editingDoctor?.deptId || '')} 
                  onValueChange={(val) => setEditingDoctor(prev => ({ ...prev, deptId: Number(val) }))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="选择科室" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={String(dept.id)}>
                        {dept.deptName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="specialty" className="text-right">专长</Label>
                <Input 
                  id="specialty" 
                  value={editingDoctor?.specialty || ''}
                  onChange={(e) => setEditingDoctor(prev => ({ ...prev, specialty: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              {!editingDoctor?.doctorId && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">密码</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={(editingDoctor as any)?.password || ''} 
                    onChange={(e) => setEditingDoctor(prev => ({ ...prev, password: e.target.value } as any))}
                    className="col-span-3"
                    placeholder="默认密码"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorManagement;
