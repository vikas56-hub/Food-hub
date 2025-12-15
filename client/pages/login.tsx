import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(email, password);
            login(response.data.access_token, response.data.user);
            router.push('/restaurants');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const quickLogin = async (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword('password123');
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(demoEmail, 'password123');
            login(response.data.access_token, response.data.user);
            router.push('/restaurants');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome to S.H.I.E.L.D. Food Hub</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
                        Nick Fury's Team Food Ordering System
                    </p>
                </div>

                <div className="auth-body">
                    <div className="demo-accounts">
                        <h3>S.H.I.E.L.D. Team Login:</h3>
                        <div style={{ display: 'grid', gap: '8px', marginTop: '12px' }}>
                            <button
                                onClick={() => quickLogin('nick.fury@shield.com')}
                                className="btn btn-small"
                                disabled={loading}
                                style={{ background: '#1a1a1a', color: 'white' }}
                            >
                                Nick Fury (Admin - Business Owner)
                            </button>
                            <button
                                onClick={() => quickLogin('captain.marvel@shield.com')}
                                className="btn btn-small"
                                disabled={loading}
                                style={{ background: '#dc2626', color: 'white' }}
                            >
                                Captain Marvel (Manager - India)
                            </button>
                            <button
                                onClick={() => quickLogin('captain.america@shield.com')}
                                className="btn btn-small"
                                disabled={loading}
                                style={{ background: '#2563eb', color: 'white' }}
                            >
                                Captain America (Manager - America)
                            </button>
                            <button
                                onClick={() => quickLogin('thanos@shield.com')}
                                className="btn btn-small"
                                disabled={loading}
                                style={{ background: '#6b7280', color: 'white' }}
                            >
                                Thanos (Member - India)
                            </button>
                            <button
                                onClick={() => quickLogin('thor@shield.com')}
                                className="btn btn-small"
                                disabled={loading}
                                style={{ background: '#4b5563', color: 'white' }}
                            >
                                Thor (Member - India)
                            </button>
                            <button
                                onClick={() => quickLogin('travis@shield.com')}
                                className="btn btn-small"
                                disabled={loading}
                                style={{ background: '#374151', color: 'white' }}
                            >
                                Travis (Member - America)
                            </button>
                        </div>
                    </div>

                    {error && <div className="error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Logging in...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>
                </div>

                <div className="auth-footer">
                    Don't have an account? <Link href="/register">Create one here</Link>
                </div>
            </div>
        </div>
    );
}