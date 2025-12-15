import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'MEMBER',
        country: 'INDIA',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.register(formData);
            login(response.data.access_token, response.data.user);
            router.push('/restaurants');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Join S.H.I.E.L.D. Food Hub</h1>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
                        Create your account to get started
                    </p>
                </div>

                <div className="auth-body">
                    {error && <div className="error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label>Role:</label>
                            <select name="role" value={formData.role} onChange={handleChange}>
                                <option value="MEMBER">Member (View & Order)</option>
                                <option value="MANAGER">Manager (+ Order Management)</option>
                                <option value="ADMIN">Admin (Full Access)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Country:</label>
                            <select name="country" value={formData.country} onChange={handleChange}>
                                <option value="INDIA">India</option>
                                <option value="AMERICA">America</option>
                            </select>
                        </div>

                        <button type="submit" className="btn" disabled={loading} style={{ width: '100%' }}>
                            {loading ? (
                                <>
                                    <div className="spinner"></div>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>
                </div>

                <div className="auth-footer">
                    Already have an account? <Link href="/login">Sign in here</Link>
                </div>
            </div>
        </div>
    );
}