'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    restaurantId: string;
    restaurantName: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    currentOrderId: string | null;
    setCurrentOrderId: (orderId: string | null) => void;
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (itemId: string) => void;
    getItemQuantity: (itemId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedOrderId = localStorage.getItem('currentOrderId');

        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
        if (savedOrderId) {
            setCurrentOrderId(savedOrderId);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        if (currentOrderId) {
            localStorage.setItem('currentOrderId', currentOrderId);
        } else {
            localStorage.removeItem('currentOrderId');
        }
    }, [currentOrderId]);

    const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existingItem = prev.find(item => item.id === newItem.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
    };

    const removeItem = (itemId: string) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(itemId);
            return;
        }

        setItems(prev =>
            prev.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        setCurrentOrderId(null);
    };

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getItemQuantity = (itemId: string) => {
        const item = items.find(item => item.id === itemId);
        return item ? item.quantity : 0;
    };

    // Aliases for backward compatibility
    const addToCart = addItem;
    const removeFromCart = removeItem;

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice,
            currentOrderId,
            setCurrentOrderId,
            addToCart,
            removeFromCart,
            getItemQuantity,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}