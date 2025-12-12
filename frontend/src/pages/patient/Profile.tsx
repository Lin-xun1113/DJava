import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { patientService } from "@/services/patient";
import type { Patient } from "@/services/patient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Lock, CreditCard, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: ""
  });

  useEffect(() => {
    if (user?.userId) {
      fetchProfile(user.userId);
    }
  }, [user]);

  const fetchProfile = async (id: string) => {
    try {
      const res = await patientService.getProfile(id);
      if (res.code === 200) {
        setProfile(res.data);
        setFormData({
          name: res.data.name,
          phone: res.data.phone || "",
          password: ""
        });
      }
    } catch (error) {
      toast.error("获取个人信息失败");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const updateData: any = {
        name: formData.name,
        phone: formData.phone
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await patientService.updateProfile(user.userId, updateData);
      if (res.code === 200) {
        toast.success("修改成功");
        setIsEditing(false);
        fetchProfile(user.userId);
        setFormData(prev => ({ ...prev, password: "" }));
      } else {
        toast.error(res.message || "修改失败");
      }
    } catch (error) {
      toast.error("请求失败");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>未找到用户信息</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>个人中心</CardTitle>
          <CardDescription>查看和管理您的个人信息</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">新密码 (留空则不修改)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="请输入新密码"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit">保存修改</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>取消</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                  {profile.name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-slate-500">ID: {profile.patientId}</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-slate-400" />
                    <span className="text-sm font-medium">身份证号</span>
                  </div>
                  <span className="text-sm font-mono text-slate-600">
                    {profile.identityId.replace(/^(\d{6})\d{8}(\d{4})$/, "$1********$2")}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <span className="text-sm font-medium">手机号码</span>
                  </div>
                  <span className="text-sm font-mono text-slate-600">{profile.phone || "未设置"}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-slate-400" />
                    <span className="text-sm font-medium">出生日期</span>
                  </div>
                  <span className="text-sm font-mono text-slate-600">
                    {profile.birthDate ? format(parseISO(profile.birthDate), "yyyy-MM-dd") : "-"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => setIsEditing(true)}>修改信息</Button>
                <Button variant="outline" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={logout}>
                  退出登录
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
