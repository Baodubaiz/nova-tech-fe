import { useState } from 'react';
import { orderService } from '@/services/order.service';
import { Order, CreateOrderRequest, OrderStatus } from '@/types/order';

export const useOrder = () => {
    // --- STATES DÙNG CHUNG ---
    const [orders, setOrders] = useState<Order[]>([]); // Chứa danh sách đơn hàng (cho cả client lịch sử hoặc admin danh sách)
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null); // Chi tiết 1 đơn hàng đang xem
    const [totalElements, setTotalElements] = useState<number>(0); // Tổng số lượng đơn để làm phân trang
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // --- API DÙNG CHUNG (CẢ CLIENT & ADMIN) ---

    // 1. Xem chi tiết một đơn hàng cụ thể
    const fetchOrderDetail = async (orderId: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getOrderById(orderId);
            setCurrentOrder(data);
            return data;
        } catch (err: any) {
            setError(err.message || 'Không thể tải thông tin đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    // 2. Hủy đơn hàng (User tự hủy hoặc Admin hủy hộ)
    const handleCancelOrder = async (orderId: string, reason?: string) => {
        setLoading(true);
        setError(null);
        try {
            const updatedOrder = await orderService.cancelOrder(orderId, reason);
            // Cập nhật lại list local để giao diện đổi trạng thái ngay lập tức
            setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
            if (currentOrder?.id === orderId) setCurrentOrder(updatedOrder);
            return updatedOrder;
        } catch (err: any) {
            setError(err.message || 'Hủy đơn hàng thất bại');
            throw err;
        } finally {
            setLoading(false);
        }
    };


    // --- API DÀNH RIÊNG CHO CLIENT (USER) ---

    // 3. Khách xem lịch sử đơn hàng của chính mình
    const fetchMyOrders = async (page = 0, size = 10) => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getMyOrders(page, size);
            setOrders(data.content);
            setTotalElements(data.totalElements);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách lịch sử đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    // 4. Khách tiến hành đặt hàng (Checkout)
    const handleCheckout = async (orderData: CreateOrderRequest) => {
        setLoading(true);
        setError(null);
        try {
            return await orderService.checkout(orderData);
        } catch (err: any) {
            setError(err.message || 'Đặt hàng thất bại');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 5. Cập nhật trạng thái đơn hàng (Cơ bản/User)
    const handleUpdateStatus = async (orderId: string, status: OrderStatus, note?: string) => {
        setLoading(true);
        setError(null);
        try {
            const updatedOrder = await orderService.updateOrderStatus(orderId, status, note);
            setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
            if (currentOrder?.id === orderId) setCurrentOrder(updatedOrder);
            return updatedOrder;
        } catch (err: any) {
            setError(err.message || 'Cập nhật trạng thái thất bại');
        } finally {
            setLoading(false);
        }
    };


    // --- API DÀNH RIÊNG CHO ADMIN ---

    // 6. Admin quản lý xem toàn bộ đơn hàng hệ thống (Có bộ lọc trạng thái)
    const fetchAllOrdersForAdmin = async (page = 0, size = 10, status?: OrderStatus) => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getAllOrders(page, size, status);
            setOrders(data.content);
            setTotalElements(data.totalElements);
        } catch (err: any) {
            setError(err.message || 'Không thể tải toàn bộ danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    // 7. Admin cập nhật trạng thái nâng cao
    const handleAdminUpdateStatus = async (orderId: string, status: OrderStatus, note?: string) => {
        setLoading(true);
        setError(null);
        try {
            const updatedOrder = await orderService.adminUpdateOrderStatus(orderId, status, note);
            setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
            if (currentOrder?.id === orderId) setCurrentOrder(updatedOrder);
            return updatedOrder;
        } catch (err: any) {
            setError(err.message || 'Admin cập nhật trạng thái thất bại');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 8. Admin phê duyệt/xác nhận tiền chuyển khoản ngân hàng
    const handleConfirmBankTransfer = async (orderId: string, note?: string) => {
        setLoading(true);
        setError(null);
        try {
            const updatedOrder = await orderService.confirmBankTransfer(orderId, note);
            setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
            if (currentOrder?.id === orderId) setCurrentOrder(updatedOrder);
            return updatedOrder;
        } catch (err: any) {
            setError(err.message || 'Xác nhận chuyển khoản thất bại');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Trả về toàn bộ "vũ khí" để các màn hình thích xài hàm nào thì lôi hàm đó ra
    return {
        orders,
        currentOrder,
        totalElements,
        loading,
        error,
        fetchOrderDetail,
        handleCancelOrder,
        fetchMyOrders,
        handleCheckout,
        handleUpdateStatus,
        fetchAllOrdersForAdmin,
        handleAdminUpdateStatus,
        handleConfirmBankTransfer
    };
};

export default useOrder;