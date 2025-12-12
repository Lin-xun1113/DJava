import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  MapPin, 
  CreditCard, 
  FileText, 
  Phone, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Building2,
  Stethoscope,
  CalendarCheck,
  UserCheck
} from "lucide-react";

const Guide = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">就医指南</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          为了让您的就医过程更加顺畅，请仔细阅读以下指南
        </p>
      </div>

      {/* 就诊流程 */}
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ArrowRight className="h-6 w-6" />
            就诊流程
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: 1, icon: UserCheck, title: "注册/登录", desc: "使用身份证注册账号" },
              { step: 2, icon: CalendarCheck, title: "预约挂号", desc: "选择科室、医生和时间" },
              { step: 3, icon: Building2, title: "到院就诊", desc: "按预约时间到医院" },
              { step: 4, icon: Stethoscope, title: "诊疗服务", desc: "完成诊疗流程" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-3">
                    {item.step}
                  </div>
                  <item.icon className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                </div>
                {item.step < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                    <ArrowRight className="h-4 w-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 门诊时间 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              门诊时间
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-slate-600">周一至周五</span>
              <span className="font-medium">08:00 - 17:00</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-slate-600">周六、周日</span>
              <span className="font-medium">08:00 - 12:00</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600">急诊</span>
              <span className="font-medium text-green-600">24小时</span>
            </div>
            <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>节假日门诊时间可能调整，请提前电话确认</span>
            </div>
          </CardContent>
        </Card>

        {/* 医院地址 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              医院地址
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="font-medium text-slate-900">飞马星球中央大道1号</p>
              <p className="text-sm text-slate-500 mt-1">飞马星球医院（总院）</p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span className="text-slate-500">公交：</span>
                <span>1路、5路、12路、23路 - 医院站</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-slate-500">地铁：</span>
                <span>2号线中央大道站 A出口</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-slate-500">停车：</span>
                <span>医院设有地下停车场（2小时内免费）</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 就诊须知 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              就诊须知
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                "请携带有效身份证件",
                "初诊患者请提前15分钟到院办理就诊卡",
                "复诊患者请携带以往病历资料",
                "预约挂号请按时就诊，过号需重新排队",
                "取消预约请提前2小时操作",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 收费说明 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              收费说明
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">¥10</p>
                <p className="text-sm text-slate-500">普通挂号费</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">¥30</p>
                <p className="text-sm text-slate-500">专家挂号费</p>
              </div>
            </div>
            <div className="text-sm text-slate-600 space-y-1">
              <p>• 支持医保卡、银行卡、微信、支付宝</p>
              <p>• 医保患者请先办理医保登记</p>
              <p>• 发票可在收费窗口或自助机打印</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 联系方式 */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Phone className="h-8 w-8" />
              <div>
                <p className="text-sm text-slate-300">24小时服务热线</p>
                <p className="text-2xl font-bold">400-888-8888</p>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-sm text-slate-300">急救电话</p>
                <p className="text-xl font-bold">120</p>
              </div>
              <div>
                <p className="text-sm text-slate-300">投诉电话</p>
                <p className="text-xl font-bold">400-888-8889</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Guide;
