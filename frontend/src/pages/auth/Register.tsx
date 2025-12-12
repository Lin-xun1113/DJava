import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Stethoscope, ArrowLeft } from "lucide-react";
import { authService } from "@/services/auth";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    identityId: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    if (formData.identityId.length !== 18) {
      setError("身份证号必须为18位");
      return;
    }

    setLoading(true);

    try {
      const res = await authService.register({
        name: formData.name,
        identityId: formData.identityId,
        password: formData.password,
        phone: formData.phone
      });

      if (res.code === 200) {
        // Success
        alert(`注册成功！您的患者ID是：${res.data.patientId}，请使用此ID登录。`);
        navigate("/login");
      } else {
        setError(res.message || "注册失败");
      }
    } catch (err: any) {
      setError(err.message || "注册请求失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-blue-600 p-3 rounded-xl w-fit mb-4 shadow-blue-200 shadow-lg">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">注册新账号</CardTitle>
          <CardDescription>
            成为飞马星球医院的会员，享受便捷医疗服务
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">真实姓名</Label>
              <Input 
                id="name" 
                placeholder="请输入您的姓名"
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="identityId">身份证号</Label>
              <Input 
                id="identityId" 
                placeholder="请输入18位身份证号"
                value={formData.identityId}
                onChange={handleChange}
                maxLength={18}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">手机号码</Label>
              <Input 
                id="phone" 
                placeholder="请输入手机号码（选填）"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">设置密码</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="设置登录密码"
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={loading}>
              {loading ? "注册中..." : "立即注册"}
            </Button>
            
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/login" className="flex items-center gap-2 text-slate-500">
                <ArrowLeft className="h-4 w-4" />
                返回登录
              </Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
