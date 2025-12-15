import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Layout from '../components/Layout';
import Cart from '../components/Cart';
import { restaurantsAPI } from '../services/api';

interface Restaurant {
    id: string;
    name: string;
    country: string;
    menuItems: MenuItem[];
}

interface MenuItem {
    id: string;
    name: string;
    price: number;
}

export default function Restaurants() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const { addItem, items } = useCart();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchRestaurants();
    }, [user, router]);

    const fetchRestaurants = async () => {
        try {
            const response = await restaurantsAPI.getAll();
            setRestaurants(response.data);
        } catch (err: any) {
            setError('Failed to fetch restaurants');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item: MenuItem, restaurant: Restaurant) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
        });
    };

    const getItemQuantityInCart = (itemId: string) => {
        const cartItem = items.find(item => item.id === itemId);
        return cartItem ? cartItem.quantity : 0;
    };

    if (loading) {
        return (
            <Layout>
                <div className="container">
                    <div className="loading">🍽️ Loading delicious restaurants...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container">
                <div className="main-layout">
                    <div>
                        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
                                Discover Amazing Restaurants
                            </h1>
                            <p style={{ color: '#6b7280', fontSize: '18px' }}>
                                Choose from our curated selection of restaurants in {user?.country}
                            </p>
                        </div>

                        {error && <div className="error">{error}</div>}

                        {restaurants.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                                <h3>No restaurants available</h3>
                                <p>Check back later for new restaurants in your area!</p>
                            </div>
                        ) : (
                            <div className="grid">
                                {restaurants.map((restaurant) => (
                                    <div key={restaurant.id} className="restaurant-card">
                                        <div className="restaurant-header">
                                            <h2>{restaurant.name}</h2>
                                            <div className="country-badge">{restaurant.country}</div>
                                        </div>

                                        <div className="menu-items">
                                            <h3 style={{ marginBottom: '16px', color: '#1a1a1a', fontSize: '16px', fontWeight: '600' }}>
                                                Menu Items
                                            </h3>

                                            {restaurant.menuItems.length === 0 ? (
                                                <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                                                    No menu items available
                                                </p>
                                            ) : (
                                                restaurant.menuItems.map((item) => {
                                                    const quantityInCart = getItemQuantityInCart(item.id);

                                                    return (
                                                        <div key={item.id} className="menu-item">
                                                            <div className="menu-item-info">
                                                                <h4>{item.name}</h4>
                                                                <div className="menu-item-price">${item.price.toFixed(2)}</div>
                                                            </div>

                                                            <div className="menu-item-actions">
                                                                {quantityInCart > 0 && (
                                                                    <div className="quantity-controls">
                                                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                                                            {quantityInCart} in cart
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <button
                                                                    onClick={() => handleAddToCart(item, restaurant)}
                                                                    className="btn btn-small"
                                                                >
                                                                    Add to Cart
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Cart />
                </div>
            </div>
        </Layout>
    );
}