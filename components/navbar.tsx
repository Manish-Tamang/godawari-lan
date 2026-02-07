'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { TopBanner } from './top-banner';

interface NavbarProps {
    showRegistration?: boolean;
    setShowRegistration?: (show: boolean) => void;
}

export function Navbar({ showRegistration, setShowRegistration }: NavbarProps) {
    const pathname = usePathname();
    const isRegisterPage = pathname === '/register';

    return (
        <>
            <TopBanner />
            <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative w-8 h-8 overflow-hidden rounded-full border border-border">
                            <Image
                                src="/sushma-logo.jpg"
                                alt="Sushma Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-lg font-kenarose text-primary flex items-center gap-1">
                            Godawari Lan</div>
                    </Link>
                    <div className="flex items-center gap-4">
                        {/* <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground transition">
                        Admin
                    </Link> */}
                        {isRegisterPage ? (
                            <Link href="/">
                                <Button variant="gamers">
                                    Back
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/register">
                                <Button variant="gamers">
                                    Register
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}
