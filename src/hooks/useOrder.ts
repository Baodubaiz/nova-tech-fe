import { useState } from 'react';
import { orderService } from '@/services/order.service';
import { CheckoutRequest, OrderResponse, OrderStatus } from '@/types/order';

export const useOrder = () => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [currentOrder, setCurrentOrder] = useState<OrderResponse | null>(null);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const checkout = async (checkoutData: CheckoutRequest, userId: string): Promise<OrderResponse> => {
        setLoading(true);
        setError(null);
        try {
            return await orderService.checkout(checkoutData, userId);
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message || 'Lỗi đặt hàng';
            setError(errMsg);
            throw new Error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const getMyOrders = async (userId: string): Promise<OrderResponse[]> => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getMyOrders(userId);
            setOrders(data);
            return data;
        } catch (err: any) {
            const errMsg = err.response?.data?.message || err.message || 'Lỗi lấy danh sách đơn hàng';
            setError(errMsg);
            throw new Error(errMsg);
        } finally {
            setLoading(false);
        }
    };

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

    const handleCancelOrder = async (orderId: string, reason?: string) => {
        setLoading(true);
        setError(null);
        try {
            const updatedOrder = await orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED, reason);
            return updatedOrder;
        } catch (err: any) {
            setError(err.message || 'Hủy đơn hàng thất bại');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchMyOrders = async (userId: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await orderService.getMyOrders(userId);
            setOrders(data);
            setTotalElements(data.length);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách lịch sử đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    // --- API DÀNH RIÊNG CHO ADMIN ---
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

    return {
        orders,
        currentOrder,
        totalElements,
        loading,
        isLoading: loading,
        error,
        checkout,
        getMyOrders,
        fetchOrderDetail,
        handleCancelOrder,
        fetchMyOrders,
        fetchAllOrdersForAdmin,
        handleAdminUpdateStatus,
        handleConfirmBankTransfer
    };
};

export default useOrder;