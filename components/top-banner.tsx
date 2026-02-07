'use client';

import React from "react"
import { AlertCircle } from 'lucide-react';

export function TopBanner() {
    return (
        <div className="bg-primary/10 border-b border-primary/20 py-2.5 px-4 text-center">
            <div className="flex items-center justify-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-primary" />
                <p className="text-[10px] sm:text-xs font-medium text-primary uppercase tracking-wider">
                    Intra-College Event: Exclusive to <span className="underline decoration-primary/30 underline-offset-2">Sushma Godawari College</span> Students
                </p>
            </div>
        </div>
    );
}
