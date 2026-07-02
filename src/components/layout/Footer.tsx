import { Mail, Phone, MapPin } from 'lucide-react';

// Custom inline SVG icons to prevent lucide-react version compatibility issues
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.42 4.814c-.23.861-.907 1.538-1.768 1.768C18.256 19 12 19 12 19s-6.256 0-7.814-.418c-.861-.23-1.538-.907-1.768-1.768C2 15.255 2 12 2 12s0-3.255.418-4.814c.23-.861.907-1.538 1.768-1.768C5.744 5 12 5 12 5s6.256 0 7.812.418zM9.75 15.02l5.75-3.02-5.75-3.02v6.04z" clipRule="evenodd" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Shop Info */}
          <div className="space-y-6 xl:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 font-black text-white">
                N
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                NOVATECH<span className="text-cyan-600">.</span>
              </span>
            </div>
            <p className="text-sm max-w-xs text-slate-600 leading-relaxed">
              Nhà cung cấp linh kiện điện tử, vi xử lý, card đồ họa và giải pháp công nghệ máy tính hàng đầu.
            </p>
            <div className="flex space-x-4 text-slate-400">
              <a href="#" className="hover:text-cyan-600"><FacebookIcon /></a>
              <a href="#" className="hover:text-cyan-600"><YoutubeIcon /></a>
              <a href="#" className="hover:text-cyan-600"><GithubIcon /></a>
            </div>
          </div>

          {/* Quick links & Contact */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Sản Phẩm
                </h3>
                <ul className="mt-4 space-y-2 list-none p-0 text-sm">
                  <li><a href="#" className="hover:text-cyan-600 no-underline text-slate-600">Vi Xử Lý CPU</a></li>
                  <li><a href="#" className="hover:text-cyan-600 no-underline text-slate-600">Card Đồ Họa GPU</a></li>
                  <li><a href="#" className="hover:text-cyan-600 no-underline text-slate-600">Bo Mạch Chủ</a></li>
                  <li><a href="#" className="hover:text-cyan-600 no-underline text-slate-600">Ram & SSD</a></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Chính Sách
                </h3>
                <ul className="mt-4 space-y-2 list-none p-0 text-sm">
                  <li><a href="#" className="hover:text-cyan-600 no-underline text-slate-600">Bảo Hành 1-Đổi-1</a></li>
                  <li><a href="#" className="hover:text-cyan-600 no-underline text-slate-600">Chính Sách Vận Chuyển</a></li>
                  <li><a href="#" className="hover:text-cyan-600 no-underline text-slate-600">Hoàn Tiền & Đổi Trả</a></li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Liên Hệ
              </h3>
              <ul className="mt-4 space-y-4 list-none p-0 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cyan-600" />
                  <span>1900 xxxx (8:00 - 21:00)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-600" />
                  <span>support@novatech.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>Khu công nghệ cao, TP. Hồ Chí Minh, Việt Nam</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
        <div className="mt-12 border-t border-slate-200 pt-8 flex items-center justify-between text-xs text-slate-500">
          <p>&copy; 2026 NovaTech Co., Ltd. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Powered by Next.js & Spring Boot</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
