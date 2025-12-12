import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Heart, Brain, Bone, Eye, Baby } from "lucide-react";
import { departmentService } from "@/services/department";
import type { Department } from "@/services/department";

// Map department names to icons (simple heuristic)
const getDeptIcon = (name: string) => {
  if (name.includes("心")) return Heart;
  if (name.includes("脑") || name.includes("神经")) return Brain;
  if (name.includes("骨")) return Bone;
  if (name.includes("眼")) return Eye;
  if (name.includes("儿")) return Baby;
  return Activity;
};

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await departmentService.getList();
        if (res.code === 200) {
          setDepartments(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch departments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">科室导航</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          飞马星球医院设有多个临床医技科室，为您提供全方位的医疗服务。
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {departments.map((dept) => {
            const Icon = getDeptIcon(dept.deptName);
            return (
              <Card key={dept.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{dept.deptName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 line-clamp-2 min-h-[40px]">
                    {dept.description || "暂无描述"}
                  </CardDescription>
                  <Button variant="ghost" className="w-full justify-between group-hover:text-blue-600 px-0" asChild>
                    <Link to={`/doctors?deptId=${dept.id}`}>
                      查看专家 <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
