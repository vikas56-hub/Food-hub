import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { api } from '../services/api';

interface Order {
    id: string;
    status: string;
    createdAt: string;
    orderItems: OrderItem[];
}

interface OrderItem {
    id: string;
    quantity: number;
    menuItem: {
        id: string;
        name: string;
        price: number;
    };
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchOrders();
    }, [user, router]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/my-orders');
            setOrders(response.data);
        } catch (err: any) {
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        try {
            await api.post(`/orders/${orderId}/cancel`);
            setOrders(orders.map(order =>
                order.id === orderId
                    ? { ...order, status: 'CANCELLED' }
                    : order
            ));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CREATED': return '#ffc107';
            case 'PLACED': return '#28a745';
            case 'CANCELLED': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CREATED': return '●';
            case 'PLACED': return '●';
            case 'CANCELLED': return '●';
            default: return '●';
        }
    };

    const calculateOrderTotal = (orderItems: OrderItem[]) => {
        return orderItems.reduce((total, item) =>
            total + (item.menuItem.price * item.quantity), 0
        );
    };

    const canCancelOrder = (order: Order) => {
        return order.status === 'CREATED' || order.status === 'PLACED';
    };

    if (loading) {
        return (
            <Layout>
                <div className="loading">
                    <div className="spinner"></div>
                    Loading your orders...
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container">
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ marginBottom: '8px' }}>Your Orders</h1>
                    <p style={{ color: '#6b7280' }}>
                        Track and manage your food orders
                    </p>
                </div>

                {error && <div className="error">{error}</div>}

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <h3>No orders yet</h3>
                        <p>Start by ordering some delicious food!</p>
                        <button
                            onClick={() => router.push('/restaurants')}
                            className="btn btn-success"
                            style={{ marginTop: '16px' }}
                        >
                            Browse Restaurants
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {orders.map((order) => (
                            <div key={order.id} className="card">
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '16px'
                                }}>
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '8px'
                                        }}>
                                            <h3 style={{ margin: 0 }}>Order #{order.id.slice(0, 8)}</h3>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '4px 12px',
                                                borderRadius: '16px',
                                                background: getStatusColor(order.status) + '20',
                                                color: getStatusColor(order.status),
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                {getStatusIcon(order.status)} {order.status}
                                            </div>
                                        </div>
                                        <p style={{
                                            color: '#6c757d',
                                            fontSize: '14px',
                                            margin: 0
                                        }}>
                                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>

                                    {canCancelOrder(order) && user?.role !== 'MEMBER' && (
                                        <button
                                            onClick={() => cancelOrder(order.id)}
                                            className="btn btn-danger btn-small"
                                        >
                                            Cancel Order
                                        </button>
                                    )}
                                </div>

                                <div style={{ marginBottom: '16px' }}>
                                    <h4 style={{
                                        marginBottom: '12px',
                                        color: '#495057',
                                        fontSize: '16px'
                                    }}>
                                        Order Items:
                                    </h4>
                                    {order.orderItems.map((item) => (
                                        <div key={item.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 0',
                                            borderBottom: '1px solid #f1f3f4'
                                        }}>
                                            <div>
                                                <span style={{ fontWeight: '500' }}>{item.menuItem.name}</span>
                                                <span style={{
                                                    color: '#6c757d',
                                                    fontSize: '14px',
                                                    marginLeft: '8px'
                                                }}>
                                                    × {item.quantity}
                                                </span>
                                            </div>
                                            <span style={{
                                                fontWeight: '600',
                                                color: '#28a745'
                                            }}>
                                                ${(item.menuItem.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingTop: '16px',
                                    borderTop: '2px solid #e9ecef'
                                }}>
                                    <span style={{
                                        fontSize: '18px',
                                        fontWeight: '600'
                                    }}>
                                        Total:
                                    </span>
                                    <span style={{
                                        fontSize: '20px',
                                        fontWeight: '700',
                                        color: '#28a745'
                                    }}>
                                        ${calculateOrderTotal(order.orderItems).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}