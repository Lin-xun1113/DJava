import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, User, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900">
          飞马星球医院 <span className="text-blue-600">在线预约服务</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-[600px] mx-auto">
          更专业、更便捷、更贴心的医疗服务。无需排队，指尖轻点即可完成专家预约。
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild className="h-12 px-8 text-lg">
            <Link to="/departments">立即预约 <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 px-8 text-lg">
            <Link to="/doctors">专家团队</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <Card className="border-none shadow-md bg-white/50 backdrop-blur">
          <CardHeader>
            <Calendar className="h-12 w-12 text-blue-600 mb-4" />
            <CardTitle>智能预约</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">实时查看号源，灵活选择就诊时间，告别繁琐的排队等待。</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white/50 backdrop-blur">
          <CardHeader>
            <User className="h-12 w-12 text-blue-600 mb-4" />
            <CardTitle>名医荟萃</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">汇集各科室顶尖专家，为您提供最权威的诊疗方案。</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-white/50 backdrop-blur">
          <CardHeader>
            <Shield className="h-12 w-12 text-blue-600 mb-4" />
            <CardTitle>隐私保护</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">严格保护患者隐私，采用最先进的数据加密技术。</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;
