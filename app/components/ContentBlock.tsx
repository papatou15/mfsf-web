"use client"

import { ReactNode } from 'react';

export default function ContentBlock({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col lg:mx-24 lg:my-12">
            {children}
        </div>
    )
}