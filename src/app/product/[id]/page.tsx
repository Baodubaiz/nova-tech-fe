"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import productService from '@/services/product.service';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Product, ProductVariant } from '@/types/product';
import { env } from '@/config';
import { 
  ShoppingCart, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Info,
  ChevronDown,
  ChevronUp,
  Star
} from 'lucide-react';

import { ProductCard } from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartTrigger, setCartTrigger] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getProductById(id as string);
        setProduct(data);
        
        if (data.variants && data.variants.length > 0) {
          const firstVariant = data.variants.find(v => v.isActive) || data.variants[0];
          setSelectedVariant(firstVariant);
          
          const primaryImg = firstVariant.images?.find(img => img.isThumbnail) || firstVariant.images?.[0];
          if (primaryImg) {
            setActiveImage(getAbsoluteImageUrl(primaryImg.url));
          } else {
            setActiveImage('/placeholder-product.png');
          }
        }

        // Tải các sản phẩm liên quan
        try {
          const productsRes = await productService.getProducts(0, 15);
          const allProds = productsRes.content || [];
          let filtered = allProds.filter(p => p.id !== (id as string));
          if (data.category) {
            const sameCategory = filtered.filter(p => p.category?.id === data.category?.id);
            if (sameCategory.length > 0) {
              filtered = [...sameCategory, ...filtered.filter(p => p.category?.id !== data.category?.id)];
            }
          }
          setRelatedProducts(filtered.slice(0, 5));
        } catch (relatedErr) {
          console.warn('Lỗi khi nạp sản phẩm liên quan:', relatedErr);
        }
      } catch (err) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    const primaryImg = variant.images?.find(img => img.isThumbnail) || variant.images?.[0];
    if (primaryImg) {
      setActiveImage(getAbsoluteImageUrl(primaryImg.url));
    } else {
      setActiveImage('/placeholder-product.png');
    }
  };

  const getAbsoluteImageUrl = (url: string) => {
    if (!url) return '/placeholder-product.png';
    if (url.startsWith('http')) return url;
    const base = env.apiBaseUrl.replace('/api/v1', '');
    return `${base}${url}`;
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      await addToCart(selectedVariant.id, 1, user?.id);
      setCartTrigger(prev => prev + 1);
      triggerToast(`Đã thêm ${product?.name} (${selectedVariant.variantName}) vào giỏ hàng thành công!`);
    } catch (err) {
      console.error(err);
      triggerToast('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!');
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    try {
      await addToCart(selectedVariant.id, 1, user?.id);
      router.push('/cart');
    } catch (err) {
      console.error(err);
      alert('Không thể mua ngay. Vui lòng thử lại!');
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header cartTrigger={cartTrigger} />
        <div className="flex-grow flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium">Đang tải chi tiết sản phẩm...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header cartTrigger={cartTrigger} />
        <div className="flex-grow flex flex-col items-center justify-center py-20">
          <p className="text-slate-500 font-semibold text-lg">Không tìm thấy sản phẩm này</p>
          <button 
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer border-none font-bold"
          >
            Quay lại trang chủ
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Header cartTrigger={cartTrigger} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 text-xs text-slate-500">
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push('/')}>Trang chủ</span>
          <ChevronRight className="w-3.5 h-3.5" />
          {product.category && (
            <>
              <span className="hover:text-blue-600 cursor-pointer">{product.category.name}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          <span className="font-semibold text-slate-800 line-clamp-1">{product.name}</span>
        </div>
      </div>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Product Title Section */}
        <div className="border-b border-slate-200 pb-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {product.name} {selectedVariant && `- ${selectedVariant.variantName}`}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-xs">
                {product.brand && (
                  <span className="bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-100">
                    Thương hiệu: {product.brand.name}
                  </span>
                )}
                <div className="flex items-center text-amber-500 gap-0.5 font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-slate-600 ml-1">5.0 (đánh giá)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Section: Media and Purchase Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          {/* Left Column: Image Gallery (Narrower column span to prevent white gap) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col gap-4 h-fit">
            {/* Big Active Image */}
            <div className="w-full h-[400px] bg-white rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-50 relative group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80';
                }}
              />
            </div>

            {/* Thumbnails Gallery */}
            {selectedVariant?.images && selectedVariant.images.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center overflow-x-auto py-1">
                {selectedVariant.images.map((img, index) => {
                  const imgUrl = getAbsoluteImageUrl(img.url);
                  return (
                    <button
                      key={img.id || index}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border p-0.5 bg-white cursor-pointer transition-all ${
                        activeImage === imgUrl ? 'border-blue-600 ring-2 ring-blue-100 scale-105' : 'border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <img 
                        src={imgUrl} 
                        className="w-full h-full object-contain" 
                        alt="thumbnail" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=150&q=80';
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Configurations and Cart Actions (Wider column span) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Variant Selectors */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
                Chọn phiên bản cấu hình:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.variants?.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variant)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedVariant?.id === variant.id 
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100' 
                        : 'border-slate-200 bg-white hover:border-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{variant.variantName}</span>
                    <span className="text-sm font-black text-blue-600 mt-1">
                      {formatPrice(variant.discountPrice || variant.price)}
                    </span>
                    {variant.discountPrice && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatPrice(variant.price)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price display & Promotion Box */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-black text-blue-600">
                  {selectedVariant ? formatPrice(selectedVariant.discountPrice || selectedVariant.price) : '0đ'}
                </span>
                {selectedVariant && selectedVariant.discountPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatPrice(selectedVariant.price)}
                  </span>
                )}
              </div>

              {/* Promotion Box (CellphoneS style in Blue theme) */}
              <div className="border border-blue-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-blue-50 px-4 py-2 border-b border-blue-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span className="text-xs font-bold text-blue-700 uppercase">Khuyến mãi & ưu đãi đặc biệt</span>
                </div>
                <div className="p-4 bg-white text-xs text-slate-600 space-y-2">
                  <p className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white font-bold text-[9px] px-1 rounded-sm shrink-0 mt-0.5">1</span>
                    Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500k.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white font-bold text-[9px] px-1 rounded-sm shrink-0 mt-0.5">2</span>
                    Bảo hành 12 tháng chính hãng lỗi 1 đổi 1.
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white font-bold text-[9px] px-1 rounded-sm shrink-0 mt-0.5">3</span>
                    Giảm thêm tới 5% khi thanh toán qua cổng PayOS.
                  </p>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                  className="flex-grow py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-sm rounded-xl cursor-pointer active:scale-95 shadow-md border-none flex flex-col items-center justify-center transition-all leading-tight"
                >
                  <span className="uppercase font-extrabold text-base">Mua ngay</span>
                  <span className="text-[10px] font-normal mt-0.5 opacity-90">Giao tận nơi hoặc nhận tại cửa hàng</span>
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                  className="px-6 py-4 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-slate-200 disabled:text-slate-400 disabled:hover:bg-transparent rounded-xl flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all bg-white font-bold text-xs"
                >
                  <ShoppingCart className="w-5 h-5 mb-0.5" />
                  Thêm vào giỏ
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-slate-100 rounded-xl p-4 flex flex-col gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Bảo hành chính hãng 12 tháng tại các trung tâm bảo hành ủy quyền.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-blue-600 shrink-0" />
                <span>Giao hàng nhanh chóng miễn phí trong 2 giờ nội thành.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-5 h-5 text-orange-500 shrink-0" />
                <span>Đổi mới sản phẩm lỗi trong vòng 30 ngày đầu sử dụng.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Details Description & Specifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Description */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col h-fit">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 uppercase">
              Đặc điểm nổi bật & Đánh giá chi tiết
            </h2>
            <div className={`prose max-w-none text-sm text-slate-600 leading-relaxed overflow-hidden transition-all duration-500 relative ${
              isDescExpanded ? 'max-h-none pb-4' : 'max-h-[500px]'
            }`}>
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
              ) : (
                <p>Đang cập nhật thông tin mô tả chi tiết sản phẩm.</p>
              )}
              
              {/* Blur gradient overlay for collapsed state */}
              {!isDescExpanded && product.description && product.description.length > 300 && (
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>

            {product.description && product.description.length > 300 && (
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="mt-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer bg-white transition-colors"
              >
                {isDescExpanded ? (
                  <>
                    Thu gọn nội dung <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Đọc tiếp bài viết <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Technical Specifications */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 uppercase">
              Thông số kỹ thuật
            </h2>
            
            {selectedVariant?.specs && selectedVariant.specs.length > 0 ? (
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left text-slate-600 border-collapse">
                  <tbody>
                    {selectedVariant.specs.map((spec, idx) => (
                      <tr key={spec.id} className={`${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                        <td className="px-4 py-3 font-bold text-slate-700 border-r border-slate-100 w-1/3">
                          {spec.specKey.name}
                        </td>
                        <td className="px-4 py-3 text-slate-800">
                          {spec.value} {spec.specKey.unit && spec.specKey.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Info className="w-5 h-5 mx-auto mb-2 text-slate-300" />
                <span>Không có thông số kỹ thuật cho phiên bản này.</span>
              </div>
            )}
          </div>
        </div>

        {/* Có thể bạn cũng thích (Sản phẩm liên quan) */}
        {relatedProducts.length > 0 && (
          <div className="mt-10 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6 uppercase">
              Có thể bạn cũng thích
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard 
                  key={prod.id} 
                  product={prod} 
                  onAddToCart={() => setCartTrigger(prev => prev + 1)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Đánh giá khách hàng (CellphoneS style) */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4 uppercase">
            Đánh giá {product.name}
          </h2>

          {/* Lọc đánh giá */}
          <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-50 pb-4">
            <span className="text-xs font-bold text-slate-500 mr-2">Lọc đánh giá theo:</span>
            {['Tất cả', 'Có hình ảnh', 'Đã mua hàng', '5 sao', '4 sao', '3 sao', '2 sao', '1 sao'].map((filter, idx) => (
              <button
                key={filter}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-all ${
                  idx === 0 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Trạng thái trống */}
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-48 h-36 relative mb-6 flex items-center justify-center">
              {/* Cute rating mascot SVG illustration */}
              <svg viewBox="0 0 200 150" className="w-full h-full">
                <circle cx="100" cy="75" r="50" fill="#eff6ff" />
                <path d="M70,85 C70,110 130,110 130,85" fill="none" stroke="#bfdbfe" strokeWidth="4" strokeLinecap="round" />
                {/* Gift box / rating board */}
                <rect x="75" y="45" width="50" height="40" rx="6" fill="#3b82f6" />
                <rect x="80" y="50" width="40" height="30" rx="4" fill="#ffffff" />
                {/* Star on board */}
                <path d="M100,56 L103,62 L109,63 L105,67 L106,73 L100,70 L94,73 L95,67 L91,63 L97,62 Z" fill="#f59e0b" />
                <circle cx="88" cy="78" r="3" fill="#3b82f6" />
                <circle cx="112" cy="78" r="3" fill="#3b82f6" />
                {/* Cute Shopping Bags in background */}
                <rect x="50" y="65" width="20" height="25" rx="3" fill="#93c5fd" opacity="0.7" />
                <rect x="130" y="60" width="22" height="30" rx="3" fill="#60a5fa" opacity="0.8" />
              </svg>
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 mb-1">Hiện chưa có đánh giá nào.</h3>
            <p className="text-xs text-slate-500 mb-6">Bạn sẽ là người đầu tiên đánh giá sản phẩm này chứ?</p>
            <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl active:scale-95 shadow-md shadow-blue-100 border-none cursor-pointer transition-all uppercase">
              Đánh giá ngay
            </button>
          </div>
        </div>

      </main>

      <Footer />

      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
