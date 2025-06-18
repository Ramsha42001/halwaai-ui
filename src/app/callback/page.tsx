// halwaai-ui/src/app/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CallbackPage = () => {
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            // Save the token to local storage
            localStorage.setItem('token', token);
            console.log('Token saved to local storage:', token);

            // Redirect to the dashboard or home page
            router.push('/dashboard');
        } else {
            // Handle the case where no token is present
            console.error('No token found in the URL');
            // Optionally redirect to an error page or login page
            router.push('/login');
        }
    }, [router]);

    return (
        <div>
            <h1>Loading...</h1>
            <p>Please wait while we process your login...</p>
        </div>
    );
};

export default CallbackPage;