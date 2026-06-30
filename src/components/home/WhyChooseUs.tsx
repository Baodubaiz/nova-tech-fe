import React from 'react';
import { ShieldCheck, Truck, Cpu, Box, CheckCircle } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const items = [
    {
      icon: <Truck className="w-8 h-8 text-cyan-600" />,
      title: "Giao Hàng Siêu Tốc",
      description: "Giao hàng hỏa tốc trong nội thành và vận chuyển toàn quốc nhanh chóng, an toàn."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-violet-600" />,
      title: "Thông Số Chính Xác",
      description: "Mọi sản phẩm đều được kiểm định kỹ càng và ghi rõ chi tiết kỹ thuật chuẩn xác."
    },
    {
      icon: <Cpu className="w-8 h-8 text-emerald-600" />,
      title: "Hỗ Trợ Kỹ Thuật 24/7",
      description: "Đội ngũ kỹ thuật viên giàu kinh nghiệm sẵn sàng hỗ trợ bạn lắp đặt và cài đặt."
    },
    {
      icon: <Box className="w-8 h-8 text-amber-600" />,
      title: "Đóng Gói Chống Tĩnh Điện",
      description: "Bảo vệ các vi mạch nhạy cảm bằng túi và hộp chống tĩnh điện chuyên dụng chuẩn công nghiệp."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-rose-600" />,
      title: "Bảo Hành Uy Tín",
      description: "Cam kết đổi trả 1-đổi-1 nhanh chóng nếu phát hiện lỗi từ nhà sản xuất."
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Tại Sao Chọn NovaTech?
          </h2>
          <p className="mt-2 text-slate-500 text-sm max-w-md mx-auto">
            Chúng tôi cam kết đem lại trải nghiệm mua sắm linh kiện PC/e-commerce hoàn hảo và đáng tin cậy nhất
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-6 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
export default WhyChooseUs;
