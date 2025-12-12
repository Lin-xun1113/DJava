import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, Calendar, TrendingUp, Users, Building2 } from "lucide-react";
import { format, subMonths, subDays } from "date-fns";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { departmentService } from "@/services/department";
import { doctorService } from "@/services/doctor";

// 模拟过去7天的预约趋势数据
const generateTrendData = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, "MM-dd"),
      预约数: Math.floor(Math.random() * 30) + 10,
      完成数: Math.floor(Math.random() * 25) + 5,
    });
  }
  return data;
};

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

const ReportCenter = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [trendData] = useState(generateTrendData());
  const [deptData, setDeptData] = useState<any[]>([]);
  const [statsData, setStatsData] = useState({
    totalAppointments: 0,
    completedRate: 0,
    totalDoctors: 0,
    totalDepts: 0
  });
  const [, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, doctorRes] = await Promise.all([
        departmentService.getList(),
        doctorService.getPage({ pageNum: 1, pageSize: 1 })
      ]);

      if (deptRes.code === 200) {
        // 模拟各科室预约分布数据
        const depts = deptRes.data.map((d: any, i: number) => ({
          name: d.deptName,
          value: Math.floor(Math.random() * 50) + 10,
          color: COLORS[i % COLORS.length]
        }));
        setDeptData(depts);
        setStatsData(prev => ({ ...prev, totalDepts: deptRes.data.length }));
      }

      if (doctorRes.code === 200) {
        setStatsData(prev => ({ ...prev, totalDoctors: doctorRes.data.total }));
      }

      // 计算统计数据
      const totalAppts = trendData.reduce((sum, d) => sum + d.预约数, 0);
      const totalCompleted = trendData.reduce((sum, d) => sum + d.完成数, 0);
      setStatsData(prev => ({
        ...prev,
        totalAppointments: totalAppts,
        completedRate: Math.round((totalCompleted / totalAppts) * 100)
      }));

    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportMonthlyReport = () => {
    window.location.href = `/api/admin/report/monthly?month=${selectedMonth}`;
  };

  const handleExportAppointments = () => {
    const startDate = format(subMonths(new Date(), 1), "yyyy-MM-dd");
    const endDate = format(new Date(), "yyyy-MM-dd");
    window.location.href = `/api/admin/appointment/export?startDate=${startDate}&endDate=${endDate}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">报表中心</h2>
          <p className="text-slate-500">数据统计与分析</p>
        </div>
        <p className="text-sm text-slate-500">{format(new Date(), "yyyy年MM月dd日")}</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">本周预约</p>
                <p className="text-2xl font-bold">{statsData.totalAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">完成率</p>
                <p className="text-2xl font-bold">{statsData.completedRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">医生数量</p>
                <p className="text-2xl font-bold">{statsData.totalDoctors}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Building2 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">科室数量</p>
                <p className="text-2xl font-bold">{statsData.totalDepts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表区域 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 预约趋势图 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">预约趋势（近7天）</CardTitle>
            <CardDescription>每日预约数与完成数对比</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "white", 
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px"
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="预约数" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="完成数" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 科室预约分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">科室预约分布</CardTitle>
            <CardDescription>各科室预约量占比</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 科室柱状图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">各科室预约量统计</CardTitle>
          <CardDescription>本周各科室预约数量对比</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={80} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px"
                }} 
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {deptData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 导出功能 */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              月度统计报表
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              生成指定月份的预约统计报表，包含各科室预约量、完成率等数据分析。
            </p>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label>选择月份</Label>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
              <Button onClick={handleExportMonthlyReport}>
                <Download className="mr-2 h-4 w-4" />
                导出 PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              预约数据导出
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              导出最近一个月的所有预约记录，支持 Excel 格式，便于数据分析。
            </p>
            <Button onClick={handleExportAppointments} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              导出 Excel 数据
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportCenter;
