import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
    const { items, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const proceedToCheckout = () => {
        if (items.length === 0) return;
        router.push('/checkout');
    };

    const canProceedToCheckout = user?.role !== 'MEMBER';

    if (items.length === 0) {
        return (
            <div className="order-summary">
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <h3 style={{ color: '#6b7280', marginBottom: '8px' }}>Your cart is empty</h3>
                    <p style={{ color: '#9ca3af', fontSize: '14px' }}>Add some delicious items to get started!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="order-summary">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div>
                    <h3 style={{ margin: 0, color: '#1a1a1a' }}>Your Order</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                        {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
                {items.map((item) => (
                    <div key={item.id} className="cart-item">
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.name}</div>
                            <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                                from {item.restaurantName}
                            </div>
                            <div style={{ color: '#28a745', fontWeight: '600' }}>
                                ${item.price.toFixed(2)} × {item.quantity}
                            </div>
                        </div>
                        <div className="quantity-controls">
                            <button
                                className="quantity-btn"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                                −
                            </button>
                            <span className="quantity-display">{item.quantity}</span>
                            <button
                                className="quantity-btn"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                borderTop: '2px solid #e9ecef',
                paddingTop: '16px',
                marginBottom: '20px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '18px',
                    fontWeight: '700'
                }}>
                    <span>Total:</span>
                    <span style={{ color: '#28a745' }}>${getTotalPrice().toFixed(2)}</span>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {canProceedToCheckout ? (
                    <button
                        onClick={proceedToCheckout}
                        className="btn btn-success"
                        style={{ width: '100%', padding: '16px' }}
                    >
                        Proceed to Checkout
                    </button>
                ) : (
                    <div style={{
                        padding: '16px',
                        background: '#fff3cd',
                        border: '1px solid #ffeaa7',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#856404'
                    }}>
                        <div style={{ marginBottom: '8px' }}>Checkout Restricted</div>
                        <div>Only Managers and Admins can place orders</div>
                    </div>
                )}

                <button
                    onClick={clearCart}
                    className="btn btn-outline btn-small"
                    style={{ width: '100%' }}
                >
                    Clear Cart
                </button>
            </div>

            <div style={{
                marginTop: '20px',
                padding: '12px',
                background: '#f9fafb',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#6b7280',
                textAlign: 'center'
            }}>
                Your cart is saved automatically
            </div>
        </div>
    );
}