import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Layout from '../components/Layout';
import { ordersAPI } from '../services/api';

interface PaymentMethod {
    id: string;
    type: string;
    last4: string;
}

export default function Checkout() {
    const { user } = useAuth();
    const { items, getTotalPrice, clearCart } = useCart();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [orderPlaced, setOrderPlaced] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.role === 'MEMBER') {
            router.push('/restaurants');
            return;
        }

        if (items.length === 0) {
            router.push('/restaurants');
            return;
        }
    }, [user, items, router]);

    const createOrder = async () => {
        setLoading(true);
        setError('');

        try {
            // Step 1: Create order
            const orderResponse = await ordersAPI.create();
            const newOrderId = orderResponse.data.id;
            setOrderId(newOrderId);

            // Step 2: Add items to order
            for (const item of items) {
                await ordersAPI.addItem(newOrderId, item.id, item.quantity);
            }

            setCurrentStep(2);
            setSuccess('Order created successfully! Please review and confirm.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const processPayment = async () => {
        if (!orderId) return;

        setLoading(true);
        setError('');

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Place the order
            await ordersAPI.checkout(orderId);

            setOrderPlaced(true);
            setCurrentStep(3);
            setSuccess('Payment successful! Your order has been placed.');

            // Clear cart after successful order
            setTimeout(() => {
                clearCart();
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    const goBackToRestaurants = () => {
        router.push('/restaurants');
    };

    if (!user || user.role === 'MEMBER' || items.length === 0) {
        return null;
    }

    return (
        <Layout>
            <div className="container">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {/* Progress Steps */}
                    <div style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: currentStep >= 1 ? '#0070f3' : '#6c757d'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: currentStep >= 1 ? '#0070f3' : '#e9ecef',
                                        color: currentStep >= 1 ? 'white' : '#6c757d',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {currentStep > 1 ? '✓' : '1'}
                                    </div>
                                    <span>Review Order</span>
                                </div>

                                <div style={{ width: '40px', height: '2px', background: currentStep >= 2 ? '#0070f3' : '#e9ecef' }}></div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: currentStep >= 2 ? '#0070f3' : '#6c757d'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: currentStep >= 2 ? '#0070f3' : '#e9ecef',
                                        color: currentStep >= 2 ? 'white' : '#6c757d',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {currentStep > 2 ? '✓' : '2'}
                                    </div>
                                    <span>Payment</span>
                                </div>

                                <div style={{ width: '40px', height: '2px', background: currentStep >= 3 ? '#0070f3' : '#e9ecef' }}></div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: currentStep >= 3 ? '#28a745' : '#6c757d'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: currentStep >= 3 ? '#28a745' : '#e9ecef',
                                        color: currentStep >= 3 ? 'white' : '#6c757d',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {currentStep >= 3 ? '✓' : '3'}
                                    </div>
                                    <span>Confirmation</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && <div className="error">{error}</div>}
                    {success && <div className="success">{success}</div>}

                    {/* Step 1: Review Order */}
                    {currentStep === 1 && (
                        <div className="card">
                            <h2 style={{ marginBottom: '24px' }}>Review Your Order</h2>

                            <div style={{ marginBottom: '24px' }}>
                                {items.map((item) => (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '16px',
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        marginBottom: '12px'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.name}</div>
                                            <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                from {item.restaurantName}
                                            </div>
                                            <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                                ${item.price.toFixed(2)} × {item.quantity}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: '600', color: '#28a745' }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                borderTop: '2px solid #e9ecef',
                                paddingTop: '16px',
                                marginBottom: '24px'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '20px',
                                    fontWeight: '700'
                                }}>
                                    <span>Total Amount:</span>
                                    <span style={{ color: '#28a745' }}>${getTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={goBackToRestaurants}
                                    className="btn btn-outline"
                                    disabled={loading}
                                >
                                    ← Back to Menu
                                </button>
                                <button
                                    onClick={createOrder}
                                    className="btn btn-success"
                                    disabled={loading}
                                    style={{ flex: 1 }}
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner"></div>
                                            Creating Order...
                                        </>
                                    ) : (
                                        'Confirm & Continue'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Payment */}
                    {currentStep === 2 && (
                        <div className="card">
                            <h2 style={{ marginBottom: '24px' }}>Payment Information</h2>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{
                                    padding: '16px',
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ fontWeight: '600', marginBottom: '8px' }}>Order Summary</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Total Amount:</span>
                                        <span style={{ fontWeight: '600', color: '#28a745' }}>
                                            ${getTotalPrice().toFixed(2)}
                                        </span>
                                    </div>
                                    {orderId && (
                                        <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '8px' }}>
                                            Order ID: {orderId}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        disabled={loading}
                                    >
                                        <option value="credit_card">Credit Card</option>
                                        <option value="debit_card">Debit Card</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="apple_pay">Apple Pay</option>
                                    </select>
                                </div>

                                <div style={{
                                    padding: '16px',
                                    background: '#e3f2fd',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    color: '#1976d2'
                                }}>
                                    This is a demo. No real payment will be processed.
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="btn btn-outline"
                                    disabled={loading}
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={processPayment}
                                    className="btn btn-success"
                                    disabled={loading}
                                    style={{ flex: 1 }}
                                >
                                    {loading ? (
                                        <>
                                            <div className="spinner"></div>
                                            Processing Payment...
                                        </>
                                    ) : (
                                        `Pay $${getTotalPrice().toFixed(2)}`
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {currentStep === 3 && orderPlaced && (
                        <div className="card" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 'bold', color: '#059669' }}>Success!</div>
                            <h2 style={{ color: '#28a745', marginBottom: '16px' }}>Order Placed Successfully!</h2>
                            <p style={{ color: '#6c757d', marginBottom: '24px' }}>
                                Thank you for your order. You will receive a confirmation email shortly.
                            </p>

                            {orderId && (
                                <div style={{
                                    padding: '16px',
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{ fontWeight: '600', marginBottom: '8px' }}>Order Details</div>
                                    <div>Order ID: {orderId}</div>
                                    <div>Total: ${getTotalPrice().toFixed(2)}</div>
                                    <div>Status: Confirmed</div>
                                </div>
                            )}

                            <button
                                onClick={goBackToRestaurants}
                                className="btn btn-success"
                                style={{ padding: '16px 32px' }}
                            >
                                Order More Food
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}