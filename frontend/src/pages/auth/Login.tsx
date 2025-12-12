import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Stethoscope, User, Shield, Activity } from "lucide-react";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store/auth";

type UserType = "patient" | "doctor" | "admin";

const Login = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>("patient");
  const [formData, setFormData] = useState({
    userId: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authService.login({
        userId: formData.userId,
        password: formData.password,
        userType: userType
      });

      if (res.code === 200) {
        setAuth(
          {
            userId: res.data.userId,
            name: res.data.name,
            userType: res.data.userType
          },
          res.data.token
        );

        // Redirect based on role
        if (res.data.userType === "patient") {
          navigate("/");
        } else if (res.data.userType === "doctor") {
          navigate("/doctor/dashboard");
        } else if (res.data.userType === "admin") {
          navigate("/admin/dashboard");
        }
      } else {
        setError(res.message || "登录失败");
      }
    } catch (err: any) {
      setError(err.message || "登录请求失败，请检查网络或账号密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-blue-600 p-3 rounded-xl w-fit mb-4 shadow-blue-200 shadow-lg">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">欢迎回来</CardTitle>
          <CardDescription>
            飞马星球医院预约挂号系统
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setUserType("patient")}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-xs font-medium transition-all ${
                  userType === "patient" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <User className="h-4 w-4 mb-1" />
                患者
              </button>
              <button
                type="button"
                onClick={() => setUserType("doctor")}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-xs font-medium transition-all ${
                  userType === "doctor" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Activity className="h-4 w-4 mb-1" />
                医生
              </button>
              <button
                type="button"
                onClick={() => setUserType("admin")}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-xs font-medium transition-all ${
                  userType === "admin" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Shield className="h-4 w-4 mb-1" />
                管理员
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">
                  {userType === "admin" ? "用户名" : userType === "doctor" ? "医生 ID" : "患者 ID"}
                </Label>
                <Input 
                  id="id" 
                  placeholder={
                    userType === "admin" ? "请输入管理员账号" : 
                    userType === "doctor" ? "请输入8位医生工号" : 
                    "请输入10位患者ID"
                  }
                  value={formData.userId}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
                {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" type="submit" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>
            
            {userType === "patient" && (
              <p className="text-sm text-center text-slate-500">
                还没有账号？
                <Link to="/register" className="text-blue-600 hover:underline font-medium ml-1">
                  立即注册
                </Link>
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
