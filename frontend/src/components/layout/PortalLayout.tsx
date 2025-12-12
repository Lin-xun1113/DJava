import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Stethoscope, User, LogOut, Calendar } from "lucide-react";
import { useAuthStore } from "@/store/auth";

const PortalLayout = () => {
  const navigate = useNavigate();
  const { user, logout: storeLogout } = useAuthStore();
  
  const logout = () => {
    storeLogout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">飞马星球医院</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600">首页</Link>
            <Link to="/departments" className="text-sm font-medium text-slate-600 hover:text-blue-600">科室导航</Link>
            <Link to="/doctors" className="text-sm font-medium text-slate-600 hover:text-blue-600">专家介绍</Link>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/patient/appointments" className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600">
                  <Calendar className="h-4 w-4" />
                  <span>我的预约</span>
                </Link>
                <Link to="/patient/profile" className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600">
                  <User className="h-4 w-4" />
                  <span>{user.name || '个人中心'}</span>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout} className="text-slate-500">
                  <LogOut className="h-4 w-4 mr-2" />
                  退出
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">登录</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">注册</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">关于我们</h3>
              <p className="text-sm">飞马星球唯一的综合性三甲医院，致力于为星球居民提供最优质的医疗服务。</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">快速链接</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/departments" className="hover:text-white">预约挂号</Link></li>
                <li><Link to="/doctors" className="hover:text-white">专家团队</Link></li>
                <li><Link to="/guide" className="hover:text-white">就医指南</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">联系方式</h3>
              <ul className="space-y-2 text-sm">
                <li>急救电话：120</li>
                <li>咨询热线：400-888-8888</li>
                <li>地址：飞马星球中央大道1号</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2024 Pegasus Hospital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortalLayout;
