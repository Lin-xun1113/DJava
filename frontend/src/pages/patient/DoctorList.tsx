import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserRound, MapPin, Stethoscope } from "lucide-react";
import { doctorService } from "@/services/doctor";
import type { Doctor } from "@/services/doctor";
import { departmentService } from "@/services/department";
import type { Department } from "@/services/department";

const DoctorList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDeptId = searchParams.get("deptId") || "all";
  const initialName = searchParams.get("name") || "";

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchDeptId, setSearchDeptId] = useState(initialDeptId);
  const [searchName, setSearchName] = useState(initialName);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchDoctors();
    // Update URL params
    const params = new URLSearchParams();
    if (searchDeptId !== "all") params.set("deptId", searchDeptId);
    if (searchName) params.set("name", searchName);
    setSearchParams(params, { replace: true });
  }, [searchDeptId, searchName]); // Re-fetch when filters change (debouncing could be added for name)

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

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorService.getPage({
        pageNum: 1,
        pageSize: 50,
        deptId: searchDeptId !== "all" ? Number(searchDeptId) : undefined,
        name: searchName
      });
      if (res.code === 200) {
        setDoctors(res.data.records);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">找医生，挂号</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="搜索医生姓名..." 
              className="pl-9" 
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/3">
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
          <Button className="md:w-auto" onClick={fetchDoctors}>
            搜索
          </Button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
           {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <UserRound className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>未找到符合条件的医生</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {doctors.map((doctor) => (
            <Card key={doctor.doctorId} className="hover:border-blue-300 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar Placeholder */}
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                    <Stethoscope className="h-10 w-10" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          {doctor.name}
                          <span className="text-xs font-normal bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                            {doctor.deptName || "科室"}
                          </span>
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> 飞马星球医院
                          </span>
                          <span className={`flex items-center gap-1 ${doctor.status === 1 ? 'text-emerald-600' : 'text-slate-400'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${doctor.status === 1 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            {doctor.status === 1 ? '可预约' : '暂不可约'}
                          </span>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <Button asChild size="lg">
                          <Link to={`/doctor/${doctor.doctorId}`}>立即预约</Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">专长：</span>
                      {doctor.specialty || "暂无详细介绍"}
                    </div>

                    <div className="md:hidden pt-2">
                       <Button asChild className="w-full">
                          <Link to={`/doctor/${doctor.doctorId}`}>立即预约</Link>
                        </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
