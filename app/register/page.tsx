'use client';

import { RegistrationForm } from '@/components/registration-form';
import { Navbar } from '@/components/navbar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    // We'll keep the navbar state for consistency, but it won't be used to toggle the form here
    const [showRegistration, setShowRegistration] = useState(true);
    const router = useRouter();

    const handleBack = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar showRegistration={true} setShowRegistration={handleBack} />

            <main className="container mx-auto px-6 py-8 max-w-2xl">
                <RegistrationForm onSuccess={() => router.push('/')} />
            </main>
        </div>
    );
}
