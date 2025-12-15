import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { user, logout } = useAuth();
    const { getTotalItems } = useCart();

    if (!user) {
        return <>{children}</>;
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return '#dc3545';
            case 'MANAGER': return '#fd7e14';
            case 'MEMBER': return '#28a745';
            default: return '#6c757d';
        }
    };

    const totalItems = getTotalItems();

    return (
        <>
            <nav className="navbar">
                <div className="container">
                    <h1>S.H.I.E.L.D. Food Hub</h1>
                    <div className="user-info">
                        <div className="user-badge" style={{
                            backgroundColor: getRoleBadgeColor(user.role) + '20',
                            color: getRoleBadgeColor(user.role)
                        }}>
                            {user.role} • {user.country}
                        </div>
                        <span>Welcome, {user.name}</span>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Link href="/restaurants" style={{
                                color: '#2563eb',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                Menu
                            </Link>
                            <Link href="/orders" style={{
                                color: '#2563eb',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                Orders
                            </Link>
                        </div>
                        {totalItems > 0 && (
                            <div className="user-badge" style={{
                                backgroundColor: '#2563eb',
                                color: 'white'
                            }}>
                                Cart: {totalItems} item{totalItems !== 1 ? 's' : ''}
                            </div>
                        )}
                        <button onClick={logout} className="btn btn-secondary btn-small">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
            {children}
        </>
    );
}