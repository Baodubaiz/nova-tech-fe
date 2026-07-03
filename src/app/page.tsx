"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { useProduct } from '@/hooks/useProduct';
import { useCategory } from '@/hooks/useCategory';
import { Product, Category } from '@/types/product';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { 
  Laptop, 
  Smartphone, 
  Cpu, 
  HardDrive, 
  Tv, 
  Headphones, 
  Watch, 
  Gamepad2, 
  ChevronRight, 
  Flame, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Newspaper,
  ChevronLeft,
  SlidersHorizontal
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const { getProducts } = useProduct();
  const { getCategories } = useCategory();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Categorized products for CellphoneS layout
  const [phones, setPhones] = useState<Product[]>([]);
  const [laptops, setLaptops] = useState<Product[]>([]);
  const [accessories, setAccessories] = useState<Product[]>([]);
  
  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [cartTrigger, setCartTrigger] = useState(0);

  // Active slide index for Carousel
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Countdown Timer state for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 32, seconds: 15 });

  // Banner Slides data
  const bannerSlides = [
    {
      id: 1,
      title: "MỞ BÁN SIÊU PHẨM",
      subtitle: "ĐẶT TRƯỚC RƯỚC QUÀ KHỦNG",
      desc: "Ưu đãi voucher lên đến 3.000.000đ khi đặt mua sớm điện thoại thông minh thế hệ mới.",
      bg: "from-blue-600 via-blue-800 to-indigo-900",
      image: "📱"
    },
    {
      id: 2,
      title: "LAPTOP GAMING ASUS & DELL",
      subtitle: "CHIẾN GAME CỰC ĐỈNH",
      desc: "Giảm trực tiếp 15% kèm bộ quà tặng balo + chuột gaming chuyên nghiệp cho học sinh, sinh viên.",
      bg: "from-sky-700 via-blue-900 to-slate-900",
      image: "💻"
    },
    {
      id: 3,
      title: "LINH KIỆN PC CHÍNH HÃNG",
      subtitle: "BUILD MÁY SIÊU TỐC",
      desc: "RTX 4060, Intel Core i7 thế hệ mới giá siêu tốt, hỗ trợ lắp ráp và vệ sinh máy trọn đời.",
      bg: "from-blue-900 via-indigo-900 to-slate-950",
      image: "⚙️"
    }
  ];

  // News block data
  const techNews = [
    {
      id: 1,
      title: "Đánh giá chi tiết thế hệ card đồ họa RTX mới nhất: Hiệu năng vượt trội, tiết kiệm điện năng",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&q=80",
      date: "03/07/2026",
      desc: "Trải nghiệm thực tế sức mạnh xử lý Ray Tracing thế hệ mới trên các tựa game AAA đình đám..."
    },
    {
      id: 2,
      title: "Top 5 laptop văn phòng đáng mua nhất năm 2026 cho sinh viên và dân công sở",
      image: "https://images.unsplash.com/photo-1496181130204-755241544e3f?w=500&q=80",
      date: "02/07/2026",
      desc: "Đáp ứng đầy đủ các tiêu chí mỏng nhẹ, pin trâu, màn hình sắc nét và tầm giá vô cùng hợp lý..."
    },
    {
      id: 3,
      title: "NovaTech khai trương chi nhánh mới, giảm giá hàng loạt sản phẩm công nghệ cao cấp",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&q=80",
      date: "01/07/2026",
      desc: "Hàng ngàn phần quà hấp dẫn đang chờ đón những khách hàng đầu tiên đến tham quan và mua sắm..."
    }
  ];

  // Carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Flash Sale Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 0, seconds: 0 }; // Reset
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Redirect admin users to dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = typeof user.role === 'string' 
        ? user.role 
        : (user.role?.roleName || user.role?.name || 'USER');
      if (role === 'ADMIN') {
        router.push('/admin');
      }
    }
  }, [user, isAuthenticated, router]);

  const handleAddToCart = () => {
    setCartTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load Categories
        const catData = await getCategories(0, 30);
        setCategories(catData.content || []);

        // Load Products
        const prodData = await getProducts(0, 100);
        const list: Product[] = prodData.content || [];
        setProducts(list);

        // Phân loại sản phẩm cho các grid
        const categoryMap: { [key: string]: Product[] } = {
          phones: [],
          laptops: [],
          accessories: []
        };

        list.forEach(p => {
          const catName = p.category?.name?.toLowerCase() || '';
          if (catName.includes('thoại') || catName.includes('phone')) {
            categoryMap.phones.push(p);
          } else if (catName.includes('laptop') || catName.includes('máy tính xách tay')) {
            categoryMap.laptops.push(p);
          } else {
            categoryMap.accessories.push(p);
          }
        });

        // Fallback if not enough data
        setPhones(categoryMap.phones.length > 0 ? categoryMap.phones.slice(0, 5) : list.slice(0, 5));
        setLaptops(categoryMap.laptops.length > 0 ? categoryMap.laptops.slice(0, 5) : list.slice(2, 7));
        setAccessories(categoryMap.accessories.length > 0 ? categoryMap.accessories.slice(0, 10) : list.slice(4, 14));

      } catch (err) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getCategoryIcon = (slug: string) => {
    if (slug.includes('phone') || slug.includes('thoai')) return <Smartphone className="w-4 h-4 text-blue-600" />;
    if (slug.includes('laptop') || slug.includes('xach-tay')) return <Laptop className="w-4 h-4 text-blue-600" />;
    if (slug.includes('cpu') || slug.includes('chip')) return <Cpu className="w-4 h-4 text-blue-600" />;
    if (slug.includes('vga') || slug.includes('card')) return <HardDrive className="w-4 h-4 text-blue-600" />;
    if (slug.includes('headphone') || slug.includes('tai-nghe')) return <Headphones className="w-4 h-4 text-blue-600" />;
    if (slug.includes('watch') || slug.includes('dong-ho')) return <Watch className="w-4 h-4 text-blue-600" />;
    if (slug.includes('screen') || slug.includes('man-hinh')) return <Tv className="w-4 h-4 text-blue-600" />;
    return <Gamepad2 className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Header cartTrigger={cartTrigger} />

      <main className="flex-grow pb-12 space-y-8">
        
        {/* SECTION 1: Top Hero Banner & Sidebar Menu (CellphoneS Style) */}
        <section className="bg-white border-b border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-auto lg:h-[380px]">
              
              {/* Left Column: Vertical Menu Sidebar */}
              <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col justify-between overflow-y-auto">
                <div className="space-y-0.5">
                  {loading ? (
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-slate-100 rounded animate-pulse" />
                      <div className="h-6 bg-slate-100 rounded animate-pulse" />
                      <div className="h-6 bg-slate-100 rounded animate-pulse" />
                      <div className="h-6 bg-slate-100 rounded animate-pulse" />
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400 font-bold">
                      Không có danh mục nào
                    </div>
                  ) : (
                    categories.slice(0, 8).map((cat) => (
                      <Link 
                        key={cat.id} 
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 no-underline transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-white group-hover:border-blue-200">
                            {getCategoryIcon(cat.slug)}
                          </div>
                          <span className="text-xs font-extrabold tracking-wide">{cat.name}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                    ))
                  )}
                </div>

                <div className="h-px bg-slate-100 my-2" />

                <Link 
                  href="/search" 
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl text-xs font-bold no-underline cursor-pointer transition-all"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Xem tất cả danh mục
                </Link>
              </div>

              {/* Middle Column: Large Banner Carousel */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-sm group">
                {bannerSlides.map((slide, idx) => (
                  <div 
                    key={slide.id}
                    className={`absolute inset-0 bg-gradient-to-r ${slide.bg} text-white p-8 sm:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${idx === activeSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-95'}`}
                  >
                    <div className="max-w-md space-y-3">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400 text-slate-900 text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                        <Sparkles className="w-3 h-3" /> Promos
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black leading-tight uppercase">
                        {slide.title}<br />
                        <span className="text-yellow-400">{slide.subtitle}</span>
                      </h2>
                      <p className="text-blue-100 text-xs sm:text-sm font-medium">
                        {slide.desc}
                      </p>
                      <button 
                        onClick={() => router.push('/search')}
                        className="px-5 py-2.5 bg-white text-blue-700 font-extrabold rounded-xl hover:bg-slate-100 shadow-md border-none cursor-pointer text-xs uppercase transition-all hover:translate-y-[-1px] active:scale-95"
                      >
                        Khám phá ngay
                      </button>
                    </div>

                    <div className="absolute right-8 bottom-8 text-7xl select-none opacity-20 pointer-events-none sm:opacity-40">
                      {slide.image}
                    </div>
                  </div>
                ))}

                {/* Left/Right Carousel Nav Arrows */}
                <button 
                  onClick={() => setActiveSlide(prev => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center border-none cursor-pointer z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActiveSlide(prev => (prev + 1) % bannerSlides.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center border-none cursor-pointer z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Carousel Dots Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {bannerSlides.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2 rounded-full border-none cursor-pointer transition-all ${idx === activeSlide ? 'w-6 bg-yellow-400' : 'w-2 bg-white/40'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Mini Promo Stack */}
              <div className="lg:col-span-3 flex flex-col gap-4 h-full">
                <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden group shadow-sm">
                  <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider mb-1">Thu Cũ Đổi Mới</span>
                  <h3 className="text-sm font-black text-slate-800 leading-tight">
                    Trợ giá lên đến 2 triệu đồng khi lên đời Laptop/Điện thoại
                  </h3>
                  <Link href="/search" className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center mt-2 no-underline group-hover:underline cursor-pointer">
                    Lên đời ngay <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                  <span className="absolute right-2 bottom-2 text-4xl opacity-10">🔄</span>
                </div>

                <div className="flex-1 bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-center relative overflow-hidden group shadow-sm">
                  <span className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider mb-1">Phụ Kiện Chính Hãng</span>
                  <h3 className="text-sm font-black text-slate-800 leading-tight">
                    Bảo vệ hoàn hảo với ốp lưng, cường lực giảm sâu 40%
                  </h3>
                  <Link href="/search" className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center mt-2 no-underline group-hover:underline cursor-pointer">
                    Mua ngay <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
                  <span className="absolute right-2 bottom-2 text-4xl opacity-10">🔌</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: NEON BLUE FLASH SALE SECTION (CellphoneS style hot sale) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 shadow-md relative overflow-hidden">
            
            {/* Header Flash Sale */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10 z-10 relative">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400 rounded-xl text-slate-900 shadow">
                  <Flame className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                    GIỜ VÀNG CÔNG NGHỆ <span className="text-yellow-400">FLASH SALE</span>
                  </h2>
                  <p className="text-xs text-blue-100 font-semibold mt-0.5">Săn sản phẩm công nghệ giá hời số lượng cực hạn chế</p>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2 text-white">
                <span className="text-xs font-bold text-blue-100 uppercase tracking-widest flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Kết thúc sau:
                </span>
                <div className="flex gap-1.5 font-sans font-black text-slate-950">
                  <span className="bg-white px-2.5 py-1 rounded-lg text-sm shadow">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-white text-base font-black flex items-center">:</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg text-sm shadow">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-white text-base font-black flex items-center">:</span>
                  <span className="bg-white px-2.5 py-1 rounded-lg text-sm shadow">{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
            </div>

            {/* Flash Sale Product Row / Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
                <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
                <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
                <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
                <div className="h-64 bg-white/5 rounded-2xl animate-pulse" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-white/60 text-sm font-bold">
                Chưa có sản phẩm flash sale hôm nay
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {products.slice(0, 5).map((prod) => (
                  <div key={prod.id} className="relative group/card">
                    <ProductCard product={prod} onAddToCart={handleAddToCart} />
                    <span className="absolute top-2 right-2 z-10 bg-yellow-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow border border-yellow-500">
                      GIẢM 25%
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* SECTION 3: CHOOSE FAMOUS BRANDS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
              Thương hiệu công nghệ hàng đầu
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {['Apple', 'Samsung', 'Xiaomi', 'ASUS', 'Lenovo', 'Dell'].map((brand, idx) => (
                <Link 
                  key={idx}
                  href={`/search?q=${brand.toLowerCase()}`}
                  className="h-16 border border-slate-100 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/20 rounded-2xl flex items-center justify-center font-black text-sm text-slate-600 hover:text-blue-600 transition-all cursor-pointer no-underline shadow-inner"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: SMARTPHONES GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Điện thoại nổi bật</h2>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/search?q=phone" className="text-xs font-extrabold text-blue-600 hover:underline no-underline bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl transition-all">
                  Xem tất cả điện thoại
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[1,2,3,4,5].map(i => <div key={i} className="h-72 bg-white border border-slate-200 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {phones.map((prod) => (
                  <ProductCard key={prod.id} product={prod} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 5: LAPTOPS GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Laptop className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Laptop & Máy tính xách tay</h2>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/search?q=laptop" className="text-xs font-extrabold text-blue-600 hover:underline no-underline bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl transition-all">
                  Xem tất cả laptop
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[1,2,3,4,5].map(i => <div key={i} className="h-72 bg-white border border-slate-200 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {laptops.map((prod) => (
                  <ProductCard key={prod.id} product={prod} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 6: LINH KIỆN & PHỤ KIỆN GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Linh kiện & Phụ kiện công nghệ</h2>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/search" className="text-xs font-extrabold text-blue-600 hover:underline no-underline bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl transition-all">
                  Khám phá toàn bộ
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[1,2,3,4,5].map(i => <div key={i} className="h-72 bg-white border border-slate-200 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {accessories.map((prod) => (
                  <ProductCard key={prod.id} product={prod} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 7: WHY CHOOSE US (NovaTech values) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 uppercase m-0">Sản phẩm chính hãng</h4>
              <p className="text-xs text-slate-500 m-0 leading-relaxed">Cam kết linh kiện chính hãng 100%, bảo hành lâu dài tại trung tâm ủy quyền.</p>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 uppercase m-0">Giao hàng hỏa tốc</h4>
              <p className="text-xs text-slate-500 m-0 leading-relaxed">Giao hàng miễn phí toàn quốc cho hóa đơn lớn và nhận hỏa tốc nội thành 2h.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 uppercase m-0">Đổi trả dễ dàng</h4>
              <p className="text-xs text-slate-500 m-0 leading-relaxed">Hỗ trợ đổi mới sản phẩm lỗi phần cứng trong vòng 30 ngày sử dụng đầu tiên.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 uppercase m-0">Hỗ trợ kỹ thuật</h4>
              <p className="text-xs text-slate-500 m-0 leading-relaxed">Đội ngũ kỹ thuật lắp ráp chuyên nghiệp, tư vấn cấu hình tối ưu miễn phí.</p>
            </div>
          </div>
        </section>

        {/* SECTION 8: TECH NEWS & BLOG (CellphoneS Style footer blog) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">Tin tức công nghệ mới nhất</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {techNews.map((news) => (
                <div key={news.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="aspect-video w-full relative">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold text-slate-400">{news.date}</span>
                    <h3 className="font-extrabold text-sm text-slate-800 line-clamp-2 hover:text-blue-600 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {news.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
