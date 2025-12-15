import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (user) {
                router.push('/restaurants');
            } else {
                router.push('/login');
            }
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="container">Loading...</div>;
    }

    return null;
}