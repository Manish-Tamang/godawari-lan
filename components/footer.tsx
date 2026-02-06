'use client';

import React from "react"
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="py-12 border-t border-border mt-auto">
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                    <img
                        src="/profile.png"
                        alt="Golecodes"
                        className="w-full h-full object-cover"
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    Made with love by{' '}
                    <Link
                        href="https://manishtamang.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:underline transition-colors font-medium"
                    >
                        golecodes
                    </Link>
                </p>
            </div>
        </footer>
    );
}
